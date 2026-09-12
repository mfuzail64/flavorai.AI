// Shared server-side security helpers: CORS, input validation, rate limiting, auth.
// Never import client-side. All secrets stay in the function environment.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

export const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
export const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function serviceClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE);
}

/** True when the request carries the internal service-role token (function-to-function). */
export function isInternalCall(req: Request) {
  const auth = req.headers.get("Authorization") ?? "";
  return auth === `Bearer ${SERVICE_ROLE}`;
}

/** Returns the authenticated user id, or null. Never trusts a client-supplied id. */
export async function getUserId(req: Request): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  if (token === SERVICE_ROLE) return null;
  const { data } = await serviceClient().auth.getUser(token);
  return data?.user?.id ?? null;
}

/** Coarse caller identity used only for throttling. */
export function callerKey(req: Request, userId?: string | null) {
  if (userId) return `user:${userId}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  return `ip:${ip}`;
}

/**
 * Server-side rate limit backed by the database. Fails open on infrastructure
 * errors so a limiter outage never takes the product down.
 */
export async function rateLimit(opts: {
  key: string;
  action: string;
  max: number;
  windowSeconds: number;
}): Promise<{ allowed: boolean }> {
  try {
    const { data, error } = await serviceClient().rpc("check_rate_limit", {
      _bucket_key: opts.key,
      _action: opts.action,
      _max_requests: opts.max,
      _window_seconds: opts.windowSeconds,
    });
    if (error) {
      console.error("rate limit check failed", error.message);
      return { allowed: true };
    }
    return { allowed: data !== false };
  } catch (e) {
    console.error("rate limit error", e instanceof Error ? e.message : e);
    return { allowed: true };
  }
}

export const tooManyRequests = (retryAfterSeconds = 60) =>
  new Response(
    JSON.stringify({
      error: "Too many requests. Please wait a moment and try again.",
    }),
    {
      status: 429,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );

/* ---------------------------------- input --------------------------------- */

export class ValidationError extends Error {}

export async function readJsonBody(req: Request, maxBytes = 16_000): Promise<Record<string, unknown>> {
  const raw = await req.text();
  if (raw.length > maxBytes) throw new ValidationError("Request body is too large.");
  if (!raw.trim()) return {};
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new ValidationError("Request body must be valid JSON.");
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new ValidationError("Request body must be a JSON object.");
  }
  return parsed as Record<string, unknown>;
}

/** Strips control characters and trims; returns undefined when empty. */
export function str(
  value: unknown,
  field: string,
  opts: { max?: number; optional?: boolean } = {},
): string | undefined {
  const { max = 120, optional = true } = opts;
  if (value === undefined || value === null || value === "") {
    if (optional) return undefined;
    throw new ValidationError(`${field} is required.`);
  }
  if (typeof value !== "string") throw new ValidationError(`${field} must be text.`);
  const cleaned = value.replace(/[\u0000-\u001F\u007F]/g, " ").trim();
  if (!cleaned) {
    if (optional) return undefined;
    throw new ValidationError(`${field} is required.`);
  }
  if (cleaned.length > max) throw new ValidationError(`${field} must be ${max} characters or fewer.`);
  return cleaned;
}

export function int(
  value: unknown,
  field: string,
  opts: { min?: number; max?: number; fallback?: number } = {},
): number | undefined {
  const { min = 0, max = 1000, fallback } = opts;
  if (value === undefined || value === null || value === "") return fallback;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be a number.`);
  const rounded = Math.round(n);
  if (rounded < min || rounded > max) {
    throw new ValidationError(`${field} must be between ${min} and ${max}.`);
  }
  return rounded;
}

export function stringList(
  value: unknown,
  field: string,
  opts: { maxItems?: number; maxLength?: number } = {},
): string[] {
  const { maxItems = 40, maxLength = 60 } = opts;
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new ValidationError(`${field} must be a list.`);
  if (value.length > maxItems) throw new ValidationError(`${field} may contain at most ${maxItems} items.`);
  return value
    .map((v) => str(v, field, { max: maxLength }))
    .filter((v): v is string => !!v);
}

export function uuid(value: unknown, field: string): string | undefined {
  const s = str(value, field, { max: 64 });
  if (!s) return undefined;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) {
    throw new ValidationError(`${field} must be a valid id.`);
  }
  return s;
}

export function oneOf<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  fallback?: T,
): T | undefined {
  const s = str(value, field, { max: 40 });
  if (!s) return fallback;
  const hit = allowed.find((a) => a.toLowerCase() === s.toLowerCase());
  if (!hit) throw new ValidationError(`${field} is not a supported value.`);
  return hit;
}

/** Escapes PostgREST/LIKE wildcards so user text can't broaden a query. */
export function escapeLike(value: string) {
  return value.replace(/[%_\\,()*]/g, "");
}
