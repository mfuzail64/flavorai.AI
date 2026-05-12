## Plan: Fix console warning + add missing pages

The app is loading correctly (homepage, search, recipe detail all work — verified via network 200s). The user mentioned "Something else" without specifics, so I'll address concrete gaps: the React warning, the missing routes, and a global safety net.

### 1. Fix `fetchPriority` React warning
In `src/components/recipe/RecipeImage.tsx`, replace the `fetchPriority` JSX prop with the lowercase DOM attribute via `{...({ fetchpriority: priority ? "high" : "auto" } as any)}`. Removes the only console error.

### 2. Add ErrorBoundary + global safety net
- New `src/components/ErrorBoundary.tsx` — catches render errors, shows branded fallback with "Reload" + "Go home" buttons.
- Wrap `<Routes>` in `src/App.tsx`.
- Ensures no truly blank screen even if a future bug throws.

### 3. New page: `/favorites`
- `src/pages/Favorites.tsx` — uses existing `useFavorites` hook to list saved recipes.
- Fetches recipes by ID via Supabase, renders existing `RecipeCard` grid.
- Empty state: "No favorites yet — tap ♥ on any recipe."
- Auth-gated via `ProtectedRoute`.

### 4. New page: `/recipes` (browse all)
- `src/pages/Recipes.tsx` — paginated grid of all recipes.
- Reuses `FilterBar` (cuisine/diet/category/time).
- Search bar wired to existing `search-recipes` edge function.
- Skeleton loaders + "Load more" pagination (20/page).

### 5. New page: `/collections`
- `src/pages/Collections.tsx` — curated tag/category tiles (Trending 2026, Quick 15, Vegan, Keto, Desserts, Drinks, Street Food, High-Protein, Budget, Student) — same list already in `Explore.tsx`.
- Each tile links to `/explore?collection=<key>` (extend Explore to read query param) so we don't duplicate the listing UI.
- Visual: glassmorphism tiles with category-fallback imagery from `RecipeImage`.

### 6. Wire routes + nav
- Register `/favorites`, `/recipes`, `/collections` in `src/App.tsx`.
- Add nav links in `src/components/Header.tsx` (desktop nav + mobile menu).
- Add i18n keys: `nav.favorites`, `nav.recipes`, `nav.collections`, plus empty-state strings (English + 9 other locales).

### Out of scope
- Migrating to Next.js (project is Vite/React — `next/image`, `NEXT_PUBLIC_*` env vars don't apply here).
- Database schema changes (recipes table, RLS, edge functions all working).
- Re-seeding 10k recipes (separate request).

### Files
- **New:** `src/components/ErrorBoundary.tsx`, `src/pages/Favorites.tsx`, `src/pages/Recipes.tsx`, `src/pages/Collections.tsx`
- **Edit:** `src/components/recipe/RecipeImage.tsx`, `src/App.tsx`, `src/components/Header.tsx`, `src/pages/Explore.tsx` (read `?collection=`), `src/i18n/locales.ts`
