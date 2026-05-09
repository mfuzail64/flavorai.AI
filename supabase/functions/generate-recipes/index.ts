import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function normalizeIngredient(name: string) {
  return name.toLowerCase().trim().replace(/s$/, "");
}

const recipeTool = {
  type: "function",
  function: {
    name: "return_recipes",
    description: "Return an array of complete, accurate recipes.",
    parameters: {
      type: "object",
      properties: {
        recipes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              cuisine: { type: "string" },
              category: {
                type: "string",
                enum: [
                  "Breakfast",
                  "Lunch",
                  "Dinner",
                  "Main Course",
                  "Appetizer",
                  "Dessert",
                  "Drink",
                  "Snack",
                  "Soup",
                  "Salad",
                  "Side",
                ],
              },
              difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
              prep_time: { type: "integer", minimum: 1 },
              cook_time: { type: "integer", minimum: 0 },
              servings: { type: "integer", minimum: 1 },
              tags: { type: "array", items: { type: "string" } },
              ingredients: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    quantity: { type: "string" },
                    unit: { type: "string" },
                  },
                  required: ["name", "quantity"],
                  additionalProperties: false,
                },
              },
              instructions: {
                type: "array",
                items: { type: "string" },
                minItems: 3,
              },
              nutrition: {
                type: "object",
                properties: {
                  calories: { type: "integer" },
                  protein: { type: "integer" },
                  carbs: { type: "integer" },
                  fat: { type: "integer" },
                  fiber: { type: "integer" },
                  sugar: { type: "integer" },
                  sodium: { type: "integer" },
                },
                required: ["calories", "protein", "carbs", "fat", "fiber", "sugar", "sodium"],
                additionalProperties: false,
              },
              image_prompt: {
                type: "string",
                description:
                  "Restaurant-quality food photography prompt for this dish (no text, vibrant, top-down or 45-degree, on a clean surface).",
              },
            },
            required: [
              "title",
              "description",
              "cuisine",
              "category",
              "difficulty",
              "prep_time",
              "cook_time",
              "servings",
              "tags",
              "ingredients",
              "instructions",
              "nutrition",
              "image_prompt",
            ],
            additionalProperties: false,
          },
        },
      },
      required: ["recipes"],
      additionalProperties: false,
    },
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const {
      ingredients = [],
      cuisine,
      category,
      diet,
      maxTime,
      query,
      count = 6,
    } = body as {
      ingredients?: string[];
      cuisine?: string;
      category?: string;
      diet?: string;
      maxTime?: number;
      query?: string;
      count?: number;
    };

    const constraints: string[] = [];
    if (ingredients.length)
      constraints.push(`User has these ingredients on hand: ${ingredients.join(", ")}. Use as many as possible; minor pantry staples (salt, pepper, oil, water) are allowed extras.`);
    if (cuisine) constraints.push(`Cuisine: ${cuisine}.`);
    if (category) constraints.push(`Category: ${category}.`);
    if (diet) constraints.push(`Diet: ${diet}.`);
    if (maxTime) constraints.push(`Total time under ${maxTime} minutes.`);
    if (query) constraints.push(`Theme/keywords: ${query}.`);

    const userPrompt = `Generate ${count} DIFFERENT, real, accurate, production-quality recipes${
      constraints.length ? `. Constraints: ${constraints.join(" ")}` : ""
    }. Mix cuisines and styles for variety. Nutrition values must be realistic per serving. Instructions: clear, numbered, 4-8 steps each.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are a world-class recipe developer. Output ONLY via the return_recipes tool. Each recipe must be authentic, well-tested, and complete with realistic nutrition.",
          },
          { role: "user", content: userPrompt },
        ],
        tools: [recipeTool],
        tool_choice: { type: "function", function: { name: "return_recipes" } },
      }),
    });

    if (!aiResp.ok) {
      const txt = await aiResp.text();
      console.error("AI error", aiResp.status, txt);
      if (aiResp.status === 429)
        return new Response(JSON.stringify({ error: "Rate limited. Try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      if (aiResp.status === 402)
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiJson = await aiResp.json();
    const toolCall = aiJson.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;
    if (!args) throw new Error("No tool call from AI");
    const parsed = JSON.parse(args);
    const recipesIn: any[] = parsed.recipes || [];

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const inserted: any[] = [];
    for (const r of recipesIn) {
      const slug = `${slugify(r.title)}-${crypto.randomUUID().slice(0, 6)}`;
      const row = {
        slug,
        title: r.title,
        description: r.description,
        cuisine: r.cuisine,
        category: r.category,
        difficulty: r.difficulty,
        prep_time: r.prep_time,
        cook_time: r.cook_time,
        servings: r.servings,
        tags: r.tags || [],
        ingredients: r.ingredients,
        instructions: r.instructions,
        nutrition: r.nutrition,
        image_status: "pending",
        source: "ai",
      };
      const { data, error } = await supabase.from("recipes").insert(row).select().single();
      if (error) {
        console.error("insert error", error);
        continue;
      }
      // ingredient index
      const ingRows = (r.ingredients as any[])
        .map((i) => normalizeIngredient(i.name))
        .filter(Boolean)
        .map((ingredient) => ({ recipe_id: data.id, ingredient }));
      if (ingRows.length) {
        await supabase.from("recipe_ingredients_index").upsert(ingRows, {
          onConflict: "recipe_id,ingredient",
          ignoreDuplicates: true,
        });
      }
      inserted.push({ ...data, image_prompt: r.image_prompt });

      // fire image generation in background
      const imgUrl = `${SUPABASE_URL}/functions/v1/generate-recipe-image`;
      EdgeRuntime.waitUntil(
        fetch(imgUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SERVICE_ROLE}`,
          },
          body: JSON.stringify({ recipe_id: data.id, prompt: r.image_prompt, title: r.title }),
        }).catch((e) => console.error("img fn dispatch", e)),
      );
    }

    return new Response(JSON.stringify({ recipes: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
