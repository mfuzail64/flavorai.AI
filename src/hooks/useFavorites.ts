import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "sonner";

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user) return [] as string[];
      const { data, error } = await supabase
        .from("user_favorites")
        .select("recipe_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.recipe_id as string);
    },
    enabled: !!user,
  });

  const toggle = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!user) throw new Error("Sign in to save favorites");
      const ids = list.data ?? [];
      if (ids.includes(recipeId)) {
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("recipe_id", recipeId);
        if (error) throw error;
        return { added: false };
      } else {
        const { error } = await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, recipe_id: recipeId });
        if (error) throw error;
        return { added: true };
      }
    },
    onSuccess: ({ added }) => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      toast(added ? "Added to favorites" : "Removed from favorites");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return {
    favoriteIds: list.data ?? [],
    isFavorite: (id: string) => (list.data ?? []).includes(id),
    toggle,
  };
}
