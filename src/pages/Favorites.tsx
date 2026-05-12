import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFavorites } from "@/hooks/useFavorites";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import type { Recipe } from "@/types/recipe";

const Favorites = () => {
  const { t } = useTranslation();
  const { favoriteIds } = useFavorites();

  const { data, isLoading } = useQuery({
    queryKey: ["favorite-recipes", favoriteIds],
    queryFn: async () => {
      if (!favoriteIds.length) return [] as Recipe[];
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .in("id", favoriteIds);
      if (error) throw error;
      return (data ?? []) as unknown as Recipe[];
    },
    enabled: true,
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="px-6 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("favorites.title", "Your favorites")}
          </h1>
          <p className="text-muted-foreground">
            {t("favorites.subtitle", "Recipes you've saved for later.")}
          </p>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : (data?.length ?? 0) === 0 ? (
            <div className="max-w-md mx-auto text-center py-16 space-y-5">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("favorites.emptyTitle", "No favorites yet")}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t("favorites.emptyDesc", "Tap the heart on any recipe to save it here.")}
                </p>
              </div>
              <Button asChild>
                <Link to="/explore">{t("favorites.browseCta", "Browse recipes")}</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data!.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Favorites;
