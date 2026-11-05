DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
CREATE POLICY "Published recipes are publicly viewable"
  ON public.recipes FOR SELECT TO anon, authenticated
  USING (status = 'published');