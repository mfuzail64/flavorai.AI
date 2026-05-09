import { useEffect, useMemo, useState } from "react";
import { UtensilsCrossed, Sparkles, Flame, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import IngredientTag from "@/components/IngredientTag";
import QuickAddSection from "@/components/QuickAddSection";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import FilterBar, { type FilterState } from "@/components/FilterBar";
import { useRecipeSearch, useTrending } from "@/hooks/useRecipes";
import { toast } from "sonner";

const Index = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({});

  const handleAddIngredient = (ingredient: string) => {
    const normalized = ingredient.toLowerCase().trim();
    if (normalized && !ingredients.includes(normalized)) {
      setIngredients((prev) => [...prev, normalized]);
    }
  };

  const handleRemoveIngredient = (i: string) =>
    setIngredients((prev) => prev.filter((x) => x !== i));

  const params = useMemo(
    () => ({
      ingredients,
      cuisine: filters.cuisine,
      diet: filters.diet,
      maxTime: filters.maxTime,
      maxCalories: filters.maxCalories,
    }),
    [ingredients, filters],
  );

  const hasAnyFilter = !!(filters.cuisine || filters.diet || filters.maxTime || filters.maxCalories);
  const enabled = ingredients.length > 0 || hasAnyFilter;
  const { data: results, isLoading, error } = useRecipeSearch(params, enabled);
  const trending = useTrending(8);

  useEffect(() => {
    if (error) toast.error((error as Error).message);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative py-14 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Powered by AI · Infinite recipes
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Cook anything from <span className="text-primary">what you have</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Type your ingredients and we'll generate restaurant-quality recipes — instant, accurate, with full nutrition.
          </p>

          <div className="flex flex-col items-center gap-5">
            <IngredientInput onAddIngredient={handleAddIngredient} />

            {ingredients.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {ingredients.map((i) => (
                  <IngredientTag key={i} ingredient={i} onRemove={() => handleRemoveIngredient(i)} />
                ))}
              </div>
            )}

            <QuickAddSection onAddIngredient={handleAddIngredient} currentIngredients={ingredients} />
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {enabled && (
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground inline-flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                {isLoading ? "Cooking up ideas…" : `${results?.length ?? 0} recipes`}
              </h2>
              <FilterBar value={filters} onChange={setFilters} />
            </div>
          )}

          {!enabled ? (
            <EmptyHint />
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : (results?.length ?? 0) === 0 ? (
            <NoResults />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results!.map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending */}
      <section className="py-10 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground inline-flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Trending now
            </h2>
            <Link to="/explore" className="text-sm text-primary hover:underline">
              Explore all →
            </Link>
          </div>

          {trending.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : (trending.data?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground">No recipes yet — search above to seed the database.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.data!.slice(0, 8).map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border mt-6">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          FlavorAI · cook anything · powered by AI
        </div>
      </footer>
    </div>
  );
};

const EmptyHint = () => (
  <div className="text-center py-16">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
      <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
    </div>
    <h2 className="text-2xl font-semibold text-foreground mb-2">Add ingredients to start</h2>
    <p className="text-muted-foreground max-w-md mx-auto">
      Type ingredients you have at home or pick a filter — FlavorAI will generate the perfect recipe.
    </p>
  </div>
);

const NoResults = () => (
  <div className="text-center py-16">
    <h2 className="text-2xl font-semibold text-foreground mb-2">No matches</h2>
    <p className="text-muted-foreground">Try fewer ingredients or different filters.</p>
  </div>
);

export default Index;
