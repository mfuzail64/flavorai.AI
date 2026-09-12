import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  json,
  serviceClient,
  readJsonBody,
  str,
  int,
  stringList,
  escapeLike,
  rateLimit,
  callerKey,
  getUserId,
  tooManyRequests,
  ValidationError,
  SUPABASE_URL,
  SERVICE_ROLE,
} from "../_shared/security.ts";

const MIN_RESULTS = 8;
const PAGE = 24;

function normalize(name: string) {
  return name.toLowerCase().trim().replace(/s$/, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const body = await readJsonBody(req);

    const query = str(body.query, "Search text", { max: 200 });
    const ingredients = stringList(body.ingredients, "Ingredients", { maxItems: 30, maxLength: 40 });
    const cuisine = str(body.cuisine, "Cuisine", { max: 40 });
    const category = str(body.category, "Category", { max: 40 });
    const diet = str(body.diet, "Diet", { max: 40 });
    const tag = str(body.tag, "Tag", { max: 40 });
    const maxCalories = int(body.maxCalories, "Max calories", { min: 50, max: 5000 });
    const maxTime = int(body.maxTime, "Max time", { min: 1, max: 600 });
    const limit = int(body.limit, "Limit", { min: 1, max: PAGE, fallback: PAGE })!;
    const autofill = body.autofill === undefined ? true : body.autofill === true;

    const userId = await getUserId(req);
    const caller = callerKey(req, userId);
    const limited = await rateLimit({
      key: caller,
      action: "search-recipes",
      max: 60,
      windowSeconds: 60,
    });
    if (!limited.allowed) return tooManyRequests();

    const supabase = serviceClient();

    let recipeIds: string[] | null = null;
    const normIngs = ingredients.map(normalize).map(escapeLike).filter(Boolean);

    const ingMatches = (indexed: string, token: string) =>
      indexed.toLowerCase().includes(token);

    if (normIngs.length) {
      const orFilter = normIngs.map((t) => `ingredient.ilike.%${t}%`).join(",");
      const { data: matches } = await supabase
        .from("recipe_ingredients_index")
        .select("recipe_id, ingredient")
        .or(orFilter);

      const tokensByRecipe = new Map<string, Set<string>>();
      (matches || []).forEach((m: { recipe_id: string; ingredient: string }) => {
        for (const tok of normIngs) {
          if (ingMatches(m.ingredient, tok)) {
            if (!tokensByRecipe.has(m.recipe_id)) tokensByRecipe.set(m.recipe_id, new Set());
            tokensByRecipe.get(m.recipe_id)!.add(tok);
          }
        }
      });
      recipeIds = [...tokensByRecipe.entries()]
        .sort((a, b) => b[1].size - a[1].size)
        .map(([id]) => id);
    }

    let q = supabase.from("recipes").select("*").limit(limit);
    if (recipeIds && recipeIds.length) q = q.in("id", recipeIds.slice(0, limit * 2));
    if (cuisine) q = q.eq("cuisine", cuisine);
    if (category) q = q.eq("category", category);
    if (tag) q = q.contains("tags", [tag]);
    if (diet) q = q.contains("tags", [diet]);
    if (maxTime) q = q.lte("total_time", maxTime);
    if (maxCalories) q = q.lte("nutrition->>calories", String(maxCalories));
    if (query && !recipeIds) {
      q = q.textSearch("search_text", query, { type: "websearch", config: "simple" });
    }
    q = q.order("created_at", { ascending: false });

    const { data: recipes, error } = await q;
    if (error) throw error;

    let results = recipes || [];

    if (normIngs.length) {
      const ids = results.map((r) => r.id);
      const { data: allIng } = await supabase
        .from("recipe_ingredients_index")
        .select("recipe_id, ingredient")
        .in("recipe_id", ids);
      const byRecipe = new Map<string, string[]>();
      (allIng || []).forEach((m: { recipe_id: string; ingredient: string }) => {
        if (!byRecipe.has(m.recipe_id)) byRecipe.set(m.recipe_id, []);
        byRecipe.get(m.recipe_id)!.push(m.ingredient);
      });
      results = results
        .map((r) => {
          const all = byRecipe.get(r.id) || [];
          const matched = all.filter((i) => normIngs.some((tok) => ingMatches(i, tok)));
          const missing = all.filter((i) => !normIngs.some((tok) => ingMatches(i, tok)));
          const matchedTokens = new Set(
            normIngs.filter((tok) => all.some((i) => ingMatches(i, tok))),
          );
          return {
            ...r,
            matched_ingredients: matched,
            missing_ingredients: missing,
            match_score: normIngs.length ? matchedTokens.size / normIngs.length : 0,
          };
        })
        .sort((a, b) => b.match_score - a.match_score);
    }

    const hasIntent = normIngs.length > 0 || !!query || !!cuisine || !!category || !!diet || !!tag;
    if (autofill && hasIntent && results.length < MIN_RESULTS) {
      // AI generation is expensive: throttle it separately from plain search.
      const genAllowed = await rateLimit({
        key: caller,
        action: "search-autofill-ai",
        max: 10,
        windowSeconds: 3600,
      });
      if (genAllowed.allowed) {
        try {
          const genResp = await fetch(`${SUPABASE_URL}/functions/v1/generate-recipes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SERVICE_ROLE}`,
            },
            body: JSON.stringify({
              ingredients: normIngs,
              cuisine,
              category,
              diet,
              maxTime,
              query,
              count: Math.max(6, MIN_RESULTS - results.length),
            }),
          });
          if (genResp.ok) {
            const gen = await genResp.json();
            const existingIds = new Set(results.map((r) => r.id));
            for (const r of gen.recipes || []) {
              if (!existingIds.has(r.id)) {
                results.push({ ...r, match_score: 0, matched_ingredients: [], missing_ingredients: [] });
              }
            }
          } else {
            console.error("autofill generation returned", genResp.status);
          }
        } catch (e) {
          console.error("autofill failed", e instanceof Error ? e.message : e);
        }
      }
    }

    return json({ recipes: results });
  } catch (e) {
    if (e instanceof ValidationError) return json({ error: e.message }, 400);
    console.error("search-recipes failed", e instanceof Error ? e.message : e);
    return json({ error: "Something went wrong while searching recipes." }, 500);
  }
});
