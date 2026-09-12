import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  corsHeaders,
  json,
  serviceClient,
  readJsonBody,
  int,
  uuid,
  oneOf,
  rateLimit,
  callerKey,
  getUserId,
  tooManyRequests,
  ValidationError,
} from "../_shared/security.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const body = await readJsonBody(req);
    const mode = oneOf(body.mode, "mode", ["trending", "similar"] as const, "trending")!;
    const recipe_id = uuid(body.recipe_id, "recipe_id");
    const limit = int(body.limit, "limit", { min: 1, max: 24, fallback: 8 })!;

    const userId = await getUserId(req);
    const limited = await rateLimit({
      key: callerKey(req, userId),
      action: "recommend-recipes",
      max: 120,
      windowSeconds: 60,
    });
    if (!limited.allowed) return tooManyRequests();

    const supabase = serviceClient();

    if (mode === "similar" && recipe_id) {
      const { data: base } = await supabase
        .from("recipes")
        .select("cuisine, category, tags")
        .eq("id", recipe_id)
        .maybeSingle();
      const tags = base?.tags || [];
      const { data: byCuisine } = await supabase
        .from("recipes")
        .select("*")
        .neq("id", recipe_id)
        .eq("cuisine", base?.cuisine || "")
        .limit(limit);
      const results = byCuisine || [];
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
      return json({ recipes: results.slice(0, limit) });
    }

    // trending
    const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
    const { data: views } = await supabase
      .from("recipe_views")
      .select("recipe_id")
      .gte("viewed_at", since)
      .limit(500);
    const counts = new Map<string, number>();
    (views || []).forEach((v: { recipe_id: string }) =>
      counts.set(v.recipe_id, (counts.get(v.recipe_id) || 0) + 1),
    );
    const topIds = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);

    let recipes: Record<string, unknown>[] = [];
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
      const ids = new Set(recipes.map((r) => r.id as string));
      for (const r of latest || []) if (!ids.has(r.id)) recipes.push(r);
    }
    return json({ recipes: recipes.slice(0, limit) });
  } catch (e) {
    if (e instanceof ValidationError) return json({ error: e.message }, 400);
    console.error("recommend-recipes failed", e instanceof Error ? e.message : e);
    return json({ error: "Something went wrong loading recommendations." }, 500);
  }
});
