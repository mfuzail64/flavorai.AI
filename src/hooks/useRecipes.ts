import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Recipe, SearchParams } from "@/types/recipe";

async function callSearch(params: SearchParams): Promise<Recipe[]> {
  const { data, error } = await supabase.functions.invoke("search-recipes", {
    body: params,
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return (data?.recipes ?? []) as Recipe[];
}

export function useRecipeSearch(params: SearchParams, enabled = true) {
  const query = useQuery({
    queryKey: ["recipes", params],
    queryFn: () => callSearch(params),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  // Subscribe to image updates for pending recipes
  useEffect(() => {
    const pending = (query.data ?? []).filter((r) => r.image_status !== "ready").map((r) => r.id);
    if (!pending.length) return;
    const channel = supabase
      .channel(`recipes-img-${pending.slice(0, 3).join("-")}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "recipes", filter: `id=in.(${pending.join(",")})` },
        () => {
          query.refetch();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [query.data, query]);

  return query;
}

export function useTrending(limit = 8) {
  return useQuery({
    queryKey: ["trending", limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("recommend-recipes", {
        body: { mode: "trending", limit },
      });
      if (error) throw error;
      return (data?.recipes ?? []) as Recipe[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSimilar(recipeId: string | undefined, limit = 6) {
  return useQuery({
    queryKey: ["similar", recipeId, limit],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("recommend-recipes", {
        body: { mode: "similar", recipe_id: recipeId, limit },
      });
      if (error) throw error;
      return (data?.recipes ?? []) as Recipe[];
    },
    enabled: !!recipeId,
    staleTime: 5 * 60 * 1000,
  });
}
