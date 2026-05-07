
# FlavorAI — Rebrand + Recipe Detail Page

## 1. Rebrand to FlavorAI
- Update `Header.tsx`: name → **FlavorAI** (`Flavor` + accent `AI`), swap `ChefHat` for a new custom logo.
- Generate a premium logo (transparent PNG, warm orange→amber gradient flame/leaf mark) → `src/assets/flavorai-logo.png`.
- Update `index.html` `<title>`, meta description, and favicon to FlavorAI.
- Update README headline.

## 2. Backend: recipes in Lovable Cloud
Create a `recipes` table:

| field | type |
|---|---|
| id | uuid pk |
| slug | text unique (from TheMealDB id) |
| title, description, image | text |
| cuisine, category, difficulty | text |
| prep_time, cook_time | int (minutes) |
| servings | int |
| ingredients | jsonb `[{name, amount}]` |
| instructions | jsonb `string[]` |
| nutrition | jsonb `{calories, protein, carbs, fat, fiber, sugar, sodium}` (nullable) |
| tags | text[] |
| created_at | timestamptz |

- RLS: public read, no public write (admin-only via service role).
- Edge function `import-recipes`: pulls every meal from TheMealDB (categories → meals → lookup), normalizes ingredients/instructions, estimates nutrition with Lovable AI (`google/gemini-2.5-flash`) in batches, upserts by `slug`. Idempotent. One-shot trigger from a small admin button (or curl).
- Edge function `enrich-nutrition`: on-demand fallback that fills `nutrition` for a single recipe if null when the detail page opens, then caches it back to the row.

## 3. Routing & data flow
Project is **React + Vite + React Router** (not Next.js). Dynamic route:
- `App.tsx`: add `<Route path="/recipe/:id" element={<RecipeDetail />} />`.
- `RecipeCard` becomes a `<Link to={'/recipe/${recipe.id}'}>`.
- `Index.tsx`: switch from local `src/data/recipes.ts` to Supabase query (`useQuery`) for the matching grid; keep ingredient-match scoring client-side.

## 4. Recipe detail page (`/recipe/:id`)
File: `src/pages/RecipeDetail.tsx`. Fetched via `useQuery` → `supabase.from('recipes').select('*').eq('id', id).maybeSingle()`. Skeleton while loading; "Recipe not found" empty state; graceful image fallback.

Layout (mobile-first, 2-col on `lg`):
- Sticky top bar: back button, title, share + favorite icons (glassmorphism, blurred bg).
- Hero: large 16/10 HD image with gradient overlay + animated fade-in (Framer Motion).
- Header block: title, description, chips for cuisine/category/difficulty.
- Stat row: prep time, cook time, servings, total time (icon tiles).
- Tags row.
- Left col: `IngredientList` (checkable items) + `InstructionSteps` (numbered, large readable cards).
- Right col (sticky on `lg`): `NutritionCard` (Calories headline + grid of Protein/Carbs/Fat/Fiber/Sugar/Sodium with subtle gradient bars) + action buttons: **Favorite**, **Share** (Web Share API + clipboard fallback), **Save Recipe**.

Components (new):
- `src/components/recipe/NutritionCard.tsx`
- `src/components/recipe/IngredientList.tsx`
- `src/components/recipe/InstructionSteps.tsx`
- `src/components/recipe/RecipeDetailSkeleton.tsx`

## 5. UI / design system
- Use existing semantic tokens (warm orange/amber, cream, fresh green) from `index.css`; add `--gradient-hero-warm`, `--shadow-glass`, `--glass-bg` tokens for glassmorphism.
- Framer Motion for hero fade/scale and staggered ingredient/step reveal (add `framer-motion` dep).
- Dark mode: ensure all new tokens have dark counterparts.
- Lazy-load images with `loading="lazy"` + `decoding="async"`; `onError` swap to placeholder.

## 6. Out of scope (this plan)
- Persisted favorites/saved recipes per user (needs auth wiring; the buttons will work optimistically with `localStorage` for now and a TODO to migrate to a `favorites` table once sign-in is hooked up — sign-in/up page from earlier message is still pending).
- Swipe gestures (can add later with `framer-motion` drag if you want).

## Order of execution
1. Rebrand (Header + logo + index.html).
2. Migration: create `recipes` table + RLS.
3. Edge functions: `import-recipes`, `enrich-nutrition`. Trigger import.
4. Wire `Index.tsx` to Supabase; make cards link to `/recipe/:id`.
5. Build `RecipeDetail` page + sub-components with Framer Motion + skeletons.
6. Verify: console, network, and a screenshot of `/recipe/:id` for QA.

Confirm to proceed and I'll execute.
