# FlavorAI Production Upgrade

A pragmatic note up-front: a static "10,000 recipes" seed is not realistic to hand-curate, and pre-generating 10k AI recipes + 10k AI images would be slow and expensive. Instead, we'll build an **infinite-recipe engine**: the database starts with a curated seed and grows automatically as users search. Every result is real, structured, validated, cached, and instantly reusable for everyone.

## Architecture

```text
User searches "chicken, rice"
        │
        ▼
[ Supabase: search recipes table ] ──► hits ──► return cached recipes
        │
        ▼ misses / not enough
[ Edge function: generate-recipes ]
   ├─ Lovable AI (gemini-3-flash-preview) → 6 structured recipes (tool calling)
   ├─ Validate + dedupe (slug hash)
   ├─ Insert into recipes table
   └─ Kick off generate-recipe-image edge fn (async, per recipe)
        │
        ▼
[ Supabase Realtime / refetch ] → cards stream in
```

Result: feels infinite, costs scale with usage, every recipe is high quality.

## Database (new schema)

New tables (migration):

- `recipes` — id, slug (unique), title, description, cuisine, category, difficulty, prep_time, cook_time, total_time, servings, image_url, tags[], ingredients (jsonb: `[{name, quantity, unit}]`), instructions (jsonb: `string[]`), nutrition (jsonb), source ('seed' | 'ai'), created_by (nullable), created_at, search_text (generated tsvector)
- `recipe_ingredients_index` — recipe_id, ingredient (lowercased, normalized) — for fast ingredient matching
- `user_favorites` — user_id, recipe_id, created_at
- `recipe_views` — recipe_id, user_id, viewed_at (for "trending" + "recommended")

Indexes: GIN on `search_text`, GIN on `tags`, btree on `cuisine`, `category`, `total_time`, `(nutrition->>'calories')::int`, unique on `slug`, composite on `recipe_ingredients_index(ingredient, recipe_id)`.

RLS:
- `recipes`: public read, insert/update only via service role (edge functions).
- `user_favorites`, `recipe_views`: per-user CRUD, `auth.uid() = user_id`.

## Edge Functions

1. **`generate-recipes`** — input `{ ingredients?, cuisine?, category?, diet?, maxTime?, query?, count? }`. Calls Lovable AI with strict tool-calling schema, validates with Zod, dedupes by slug, inserts rows, fires image generation per recipe (background). Returns inserted recipes immediately (with placeholder image URL).
2. **`generate-recipe-image`** — input `{ recipe_id }`. Calls `google/gemini-2.5-flash-image` with restaurant-style food-photography prompt, uploads PNG to `recipe-images` storage bucket, updates `recipes.image_url`.
3. **`search-recipes`** — input `{ query?, ingredients?, cuisine?, diet?, maxCalories?, maxTime? }`. Hybrid search: full-text + ingredient match + filters, ranks by match %, falls back to `generate-recipes` when results < threshold.
4. **`recommend-recipes`** — uses recent `recipe_views` and `user_favorites` to return similar/recommended recipes.

All gateway errors (429, 402) surfaced to the client as toasts.

## Storage
- `recipe-images` bucket (public read), folder per recipe id, RLS allowing only service-role writes.

## Frontend

### Data layer
- `src/hooks/useRecipes.ts` — react-query wrapper around `search-recipes`.
- `src/hooks/useRecipeDetail.ts` — fetches a single recipe by slug from Supabase.
- `src/hooks/useFavorites.ts` — toggle/list favorites.
- Replace `src/data/recipes.ts` and `src/data/recipeDetails.ts` with thin types only; old hard-coded data is removed.

### Pages
- `Index` — hero, ingredient input, filter bar (cuisine, diet, max time, max calories), "Trending" + "Recommended for you" rails, infinite-scroll grid. Skeleton loaders + lazy images.
- `RecipeDetail` — sticky nutrition panel on desktop, swipeable hero on mobile, ingredient checkboxes, step tracker, similar-recipes carousel.
- `Explore` (new) — category tiles for every cuisine listed (Indian, Italian, Chinese, Japanese, Korean, Thai, Mexican, American, Arabic, Turkish, Mediterranean, French, Spanish, African, Indonesian) and tag-based collections (Trending, Viral 2026, Student-friendly, Budget, High-protein, Keto, Vegan, Vegetarian, Quick <15m, Desserts, Drinks, Street food).

### Components
- `RecipeCard` — refined card, lazy `<img loading="lazy">`, blurred placeholder until image arrives, match % badge, time/cal/diet chips.
- `FilterBar`, `CuisineChips`, `TrendingRail`, `SimilarRecipes`, `FavoriteButton`, `NutritionStickyPanel`.

### UI polish
- Apple-grade typography (existing Outfit), generous whitespace, consistent radii, soft shadows, smooth `framer-motion` transitions, perfected dark mode tokens in `index.css`.

## Search & filtering
- Ingredient match: normalize (lowercase, singularize basic plurals) → `recipe_ingredients_index` join → rank by `matched / total`.
- Full-text: tsvector on title + description + tags + ingredients.
- Filter chips compose into a single Supabase query.
- If <8 results, transparently call `generate-recipes` to top up.

## Performance
- React Query caching (5-min stale).
- Image lazy-load + width/height attrs to prevent CLS.
- Skeletons for cards and detail page.
- Edge functions stream multiple recipes in one AI call (one round trip per search).
- Background image generation so cards render before the photo lands; image swaps in via Supabase Realtime subscription on the row.

## What's explicitly out of scope this round
- Meal planner, shopping list, ratings/comments, recipe authoring UI, push notifications. These can come later.

## Risks / cost notes
- Each new search triggers 1 AI text call + N image calls (only on cache miss). After a few weeks of use the DB will hold thousands of real recipes and most searches will be cache hits.
- Image generation latency (~3-6s per image) is hidden by background generation + skeleton placeholders.
- 429/402 errors from the AI gateway are surfaced as toasts with clear next steps.

## Build order
1. Migration: tables, indexes, RLS, storage bucket.
2. Edge functions: `generate-recipes`, `generate-recipe-image`, `search-recipes`, `recommend-recipes`.
3. Seed: ~60 hand-picked diverse recipes (one AI batch run during setup) so the app isn't empty on first load.
4. Frontend hooks + new `Explore` page + refactored `Index` and `RecipeDetail`.
5. Favorites, trending rail, recommendations.
6. UI polish pass + dark mode QA.
