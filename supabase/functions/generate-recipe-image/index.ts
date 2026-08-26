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

function dataUrlToBytes(dataUrl: string): { bytes: Uint8Array; mime: string } {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) throw new Error("invalid data url");
  const mime = m[1];
  const b64 = m[2];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return { bytes, mime };
}

// Deterministic-but-varied styling so no two recipes share a composition.
const ANGLES = [
  "straight-on eye-level shot",
  "45-degree three-quarter angle",
  "top-down flat lay",
  "low angle hero shot",
  "close-up macro detail shot",
  "slightly overhead 60-degree angle",
];
const SURFACES = [
  "dark slate board",
  "rustic weathered wood table",
  "white marble countertop",
  "matte black ceramic surface",
  "warm terracotta tiles",
  "linen-draped table",
  "brushed steel kitchen counter",
];
const LIGHTING = [
  "soft window daylight from the side",
  "warm golden-hour light",
  "moody low-key lighting with deep shadows",
  "bright airy diffused light",
  "dramatic directional light with soft falloff",
];
const VESSELS = [
  "served in its traditional authentic serveware",
  "plated on a handmade ceramic plate",
  "in a rustic bowl with visible steam",
  "on a banana leaf / traditional platter if culturally appropriate",
  "on a simple minimalist plate with negative space",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pick<T>(arr: T[], seed: number, salt: number) {
  return arr[(seed + salt * 7919) % arr.length];
}

function buildPrompt(
  id: string,
  title: string,
  description?: string | null,
  cuisine?: string | null,
  category?: string | null,
  ingredients?: { name: string }[] | null,
) {
  const seed = hash(id + title);
  const key = (ingredients ?? [])
    .slice(0, 6)
    .map((i) => i.name)
    .join(", ");
  return [
    `Ultra-realistic professional food photograph of "${title}" — the exact, authentic dish named, nothing else.`,
    `It must be unmistakably recognizable as ${title}${cuisine ? ` from ${cuisine} cuisine` : ""}${
      category ? ` (${category})` : ""
    }.`,
    description ? `Dish description: ${description}` : "",
    key ? `Visible key ingredients: ${key}.` : "",
    `Correct ingredients, realistic textures and proportions, appropriate authentic garnish and accompaniments.`,
    `Composition: ${pick(ANGLES, seed, 1)}, ${pick(VESSELS, seed, 2)}, on a ${pick(SURFACES, seed, 3)}, ${pick(
      LIGHTING,
      seed,
      4,
    )}, shallow depth of field, editorial food-magazine styling.`,
    `Absolutely no text, no watermarks, no logos, no people, no cartoon or illustration style. Photorealistic only.`,
  ]
    .filter(Boolean)
    .join(" ");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { recipe_id, prompt, title } = await req.json();
    if (!recipe_id) throw new Error("recipe_id required");

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let imgPrompt = prompt;
    if (!imgPrompt) {
      const { data: r } = await supabase
        .from("recipes")
        .select("title, description, cuisine, category, ingredients")
        .eq("id", recipe_id)
        .single();
      imgPrompt = buildPrompt(
        recipe_id,
        r?.title ?? title ?? "a dish",
        r?.description,
        r?.cuisine,
        r?.category,
        r?.ingredients as { name: string }[] | null,
      );
    }

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-image",
        messages: [{ role: "user", content: imgPrompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResp.ok) {
      const t = await aiResp.text();
      console.error("img ai error", aiResp.status, t);
      await supabase.from("recipes").update({ image_status: "failed" }).eq("id", recipe_id);
      return new Response(JSON.stringify({ error: "image gen failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const dataUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!dataUrl) {
      await supabase.from("recipes").update({ image_status: "failed" }).eq("id", recipe_id);
      throw new Error("no image returned");
    }

    const { bytes, mime } = dataUrlToBytes(dataUrl);
    const ext = mime.split("/")[1] || "png";
    const path = `${recipe_id}.${ext}`;

    const { error: upErr } = await supabase.storage.from("recipe-images").upload(path, bytes, {
      contentType: mime,
      upsert: true,
    });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from("recipe-images").getPublicUrl(path);
    await supabase
      .from("recipes")
      .update({ image_url: pub.publicUrl, image_status: "ready" })
      .eq("id", recipe_id);

    return new Response(JSON.stringify({ image_url: pub.publicUrl }), {
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
