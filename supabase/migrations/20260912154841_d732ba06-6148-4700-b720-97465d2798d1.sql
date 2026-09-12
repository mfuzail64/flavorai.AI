CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_key text NOT NULL,
  action text NOT NULL,
  window_start timestamptz NOT NULL DEFAULT now(),
  request_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (bucket_key, action, window_start)
);

GRANT ALL ON public.rate_limits TO service_role;

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No client access to rate limits"
  ON public.rate_limits FOR SELECT TO authenticated USING (false);

CREATE INDEX IF NOT EXISTS rate_limits_lookup_idx
  ON public.rate_limits (bucket_key, action, window_start DESC);

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  _bucket_key text,
  _action text,
  _max_requests integer,
  _window_seconds integer
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _window_start timestamptz;
  _count integer;
BEGIN
  _window_start := to_timestamp(floor(extract(epoch from now()) / _window_seconds) * _window_seconds);

  INSERT INTO public.rate_limits (bucket_key, action, window_start, request_count)
  VALUES (_bucket_key, _action, _window_start, 1)
  ON CONFLICT (bucket_key, action, window_start)
  DO UPDATE SET request_count = public.rate_limits.request_count + 1,
                updated_at = now()
  RETURNING request_count INTO _count;

  DELETE FROM public.rate_limits
  WHERE window_start < now() - interval '1 day';

  RETURN _count <= _max_requests;
END;
$$;

REVOKE ALL ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) TO service_role;