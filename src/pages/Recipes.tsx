import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Recipe } from "@/types/recipe";

const PAGE_SIZE = 20;

const Recipes = () => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["recipes-page", submitted, page],
    queryFn: async () => {
      let q = supabase.from("recipes").select("*", { count: "exact" });
      if (submitted) {
        q = q.ilike("title", `%${submitted}%`);
      }
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await q
        .order("created_at", { ascending: false })
        .range(from, to);
      if (error) throw error;
      return { recipes: (data ?? []) as unknown as Recipe[], count: count ?? 0 };
    },
    staleTime: 60 * 1000,
  });

  const recipes = data?.recipes ?? [];
  const total = data?.count ?? 0;
  const hasMore = (page + 1) * PAGE_SIZE < total;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setSubmitted(query.trim());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="px-6 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {t("recipes.title", "All recipes")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("recipes.subtitle", "Browse the entire FlavorAI recipe library.")}
          </p>
          <form onSubmit={onSubmit} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("recipes.searchPlaceholder", "Search recipes…")}
                className="pl-9 h-11 rounded-full"
              />
            </div>
            <Button type="submit" className="rounded-full h-11 px-6">
              {t("common.search")}
            </Button>
          </form>
        </div>
      </section>

      <section className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {isLoading && page === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : recipes.length === 0 ? (
            <p className="text-muted-foreground text-center py-16">
              {t("recipes.empty", "No recipes match your search.")}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recipes.map((r, i) => (
                  <RecipeCard key={r.id} recipe={r} index={i} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                    variant="outline"
                    className="rounded-full px-8"
                  >
                    {isFetching
                      ? t("common.loading")
                      : t("recipes.loadMore", "Load more")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Recipes;
