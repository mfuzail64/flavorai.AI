
# FlavorAI Authentication System

Note: project is Vite + React Router (not Next.js), so we use the equivalent patterns: an `AuthProvider` context + a `<ProtectedRoute>` wrapper instead of Next middleware. Backend uses Lovable Cloud (Supabase), already wired in `src/integrations/supabase/client.ts`.

## 1. Backend (Lovable Cloud)

**Auth config**
- Enable email auth with auto-confirm (per your choice — easy to flip later).
- Enable Google sign-in via Lovable's managed Google OAuth (no keys needed).

**`profiles` table**
- Fields: `id` (uuid PK), `user_id` (uuid, FK→auth.users, unique, on delete cascade), `name`, `email`, `avatar_url`, `created_at`, `updated_at`.
- RLS enabled:
  - Anyone authenticated can read profiles (so we can show names later).
  - Users can insert/update only their own row.
- Trigger `handle_new_user()` on `auth.users` insert → auto-creates a profile row populated from `raw_user_meta_data` (name, avatar_url) and email.
- `update_updated_at_column` trigger for `updated_at`.

## 2. Frontend

**New files**
- `src/contexts/AuthProvider.tsx` — context exposing `{ user, session, profile, loading, signOut }`. Sets up `onAuthStateChange` first, then `getSession()` (avoids deadlocks). Fetches profile via deferred `setTimeout(0)` inside the listener.
- `src/components/auth/ProtectedRoute.tsx` — redirects to `/auth` if no session; shows spinner while loading.
- `src/components/auth/GoogleButton.tsx` — branded Google button using `lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin })`.
- `src/components/auth/ProfileMenu.tsx` — avatar dropdown (shadcn `DropdownMenu` + `Avatar`) with name, email, "Sign out".
- `src/pages/Auth.tsx` — single page with Login / Sign up tabs. Glassmorphism card on a warm gradient background, framer-motion fade/scale, Outfit type. Email + password fields, Google button, error toasts via sonner.
- `src/pages/AIGenerator.tsx` — placeholder protected page ("AI Recipe Generator — coming soon") so the protected route is real.

**Edits**
- `src/App.tsx` — wrap `<BrowserRouter>` contents with `<AuthProvider>`. Add routes: `/auth` (public), `/ai-generator` (wrapped in `<ProtectedRoute>`). Keep `/` and `/recipe/:id` public.
- `src/components/Header.tsx` — add nav link "AI Generator". Right side: if no user → "Log in" + "Sign up" buttons (link to `/auth`). If user → `<ProfileMenu />`.
- Configure social auth (`supabase--configure_social_auth` with `providers: ["google"]`) — generates the `lovable` SDK module.

## 3. UX details
- Toast on success ("Welcome back", "Account created") and on errors.
- Session persists automatically (already configured in `client.ts`).
- After successful login/signup, redirect to the page the user came from (or `/`).
- Spinner state on submit buttons.
- Mobile: full-width inputs, stacked layout, the auth card is `max-w-md`.

## 4. Out of scope (call out)
- Password reset page — can add next if you want.
- Per-user favorites/saved recipes persistence — schema not added yet; tell me when to wire it.

## Technical notes
- Use `supabase.auth.signInWithPassword` and `supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } })`.
- Google via `lovable.auth.signInWithOAuth` (managed OAuth — no client keys required).
- Profile auto-creation handled in DB trigger (not client) so it works for both email and OAuth signups.
