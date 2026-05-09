import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const MIN_RESULTS = 8;
const PAGE = 24;

function normalize(name: string) {
  return name.toLowerCase().trim().replace(/s$/, "");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      query,
      ingredients = [],
      cuisine,
      category,
      diet,
      maxCalories,
      maxTime,
      tag,
      autofill = true,
      limit = PAGE,
    } = body as any;

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let recipeIds: string[] | null = null;
    const normIngs = (ingredients as string[]).map(normalize).filter(Boolean);

    if (normIngs.length) {
      const { data: matches } = await supabase
        .from("recipe_ingredients_index")
        .select("recipe_id, ingredient")
        .in("ingredient", normIngs);
      const counts = new Map<string, number>();
      (matches || []).forEach((m: any) => counts.set(m.recipe_id, (counts.get(m.recipe_id) || 0) + 1));
      recipeIds = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
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

    // Compute match info
    if (normIngs.length) {
      const ids = results.map((r) => r.id);
      const { data: allIng } = await supabase
        .from("recipe_ingredients_index")
        .select("recipe_id, ingredient")
        .in("recipe_id", ids);
      const byRecipe = new Map<string, string[]>();
      (allIng || []).forEach((m: any) => {
        if (!byRecipe.has(m.recipe_id)) byRecipe.set(m.recipe_id, []);
        byRecipe.get(m.recipe_id)!.push(m.ingredient);
      });
      results = results
        .map((r) => {
          const all = byRecipe.get(r.id) || [];
          const matched = all.filter((i) => normIngs.includes(i));
          const missing = all.filter((i) => !normIngs.includes(i));
          return {
            ...r,
            matched_ingredients: matched,
            missing_ingredients: missing,
            match_score: all.length ? matched.length / all.length : 0,
          };
        })
        .sort((a, b) => b.match_score - a.match_score);
    }

    // Autofill: if too few results AND there is a real intent, generate more
    const hasIntent = (normIngs.length > 0) || query || cuisine || category || diet || tag;
    if (autofill && hasIntent && results.length < MIN_RESULTS) {
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
            if (!existingIds.has(r.id)) results.push({ ...r, match_score: 0, matched_ingredients: [], missing_ingredients: [] });
          }
        }
      } catch (e) {
        console.error("autofill failed", e);
      }
    }

    return new Response(JSON.stringify({ recipes: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
