import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Recipe } from "@/types/recipe";

async function fetchRecipe(idOrSlug: string): Promise<Recipe | null> {
  // Try by id first (uuid), then by slug
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);
  const filter = isUuid ? "id" : "slug";
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq(filter, idOrSlug)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as Recipe | null;
}

export function useRecipeDetail(idOrSlug: string | undefined) {
  const query = useQuery({
    queryKey: ["recipe", idOrSlug],
    queryFn: () => fetchRecipe(idOrSlug!),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
  });

  // record view
  useEffect(() => {
    if (!query.data) return;
    supabase.auth.getUser().then(({ data: u }) => {
      supabase.from("recipe_views").insert({
        recipe_id: query.data!.id,
        user_id: u.user?.id ?? null,
      });
    });
  }, [query.data]);

  // realtime image update
  useEffect(() => {
    if (!query.data || query.data.image_status === "ready") return;
    const id = query.data.id;
    const ch = supabase
      .channel(`recipe-detail-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "recipes", filter: `id=eq.${id}` },
        () => query.refetch(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [query.data, query]);

  return query;
}
