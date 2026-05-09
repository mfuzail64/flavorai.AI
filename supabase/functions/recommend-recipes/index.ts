import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const { mode = "trending", recipe_id, limit = 8 } = body as any;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    if (mode === "similar" && recipe_id) {
      const { data: base } = await supabase
        .from("recipes")
        .select("cuisine, category, tags")
        .eq("id", recipe_id)
        .single();
      const tags = base?.tags || [];
      let q = supabase
        .from("recipes")
        .select("*")
        .neq("id", recipe_id)
        .eq("cuisine", base?.cuisine || "")
        .limit(limit);
      const { data: byCuisine } = await q;
      let results = byCuisine || [];
      if (results.length < limit && tags.length) {
        const { data: byTag } = await supabase
          .from("recipes")
          .select("*")
          .neq("id", recipe_id)
          .overlaps("tags", tags)
          .limit(limit);
        const ids = new Set(results.map((r) => r.id));
        for (const r of byTag || []) if (!ids.has(r.id)) results.push(r);
      }
      return new Response(JSON.stringify({ recipes: results.slice(0, limit) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (mode === "trending") {
      // Top recipes from views in the last 14 days
      const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
      const { data: views } = await supabase
        .from("recipe_views")
        .select("recipe_id")
        .gte("viewed_at", since)
        .limit(500);
      const counts = new Map<string, number>();
      (views || []).forEach((v: any) => counts.set(v.recipe_id, (counts.get(v.recipe_id) || 0) + 1));
      const topIds = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([id]) => id);
      let recipes: any[] = [];
      if (topIds.length) {
        const { data } = await supabase.from("recipes").select("*").in("id", topIds);
        recipes = data || [];
      }
      if (recipes.length < limit) {
        const { data: latest } = await supabase
          .from("recipes")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);
        const ids = new Set(recipes.map((r) => r.id));
        for (const r of latest || []) if (!ids.has(r.id)) recipes.push(r);
      }
      return new Response(JSON.stringify({ recipes: recipes.slice(0, limit) }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ recipes: [] }), {
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
