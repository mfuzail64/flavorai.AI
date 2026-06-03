import { useEffect, useMemo, useRef, useState } from "react";
import { UtensilsCrossed, Sparkles, Flame, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import IngredientTag from "@/components/IngredientTag";
import QuickAddSection from "@/components/QuickAddSection";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import FilterBar, { type FilterState } from "@/components/FilterBar";
import LandingHero from "@/components/LandingHero";
import FeatureGrid from "@/components/FeatureGrid";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import { useRecipeSearch, useTrending } from "@/hooks/useRecipes";
import { toast } from "sonner";


const Index = () => {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({});
  const searchRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () =>
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });


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

      <LandingHero onSeeDemo={scrollToSearch} />

      {/* Ingredient search panel */}
      <section ref={searchRef} className="relative px-5 sm:px-6 pb-6 -mt-4 md:-mt-8 scroll-mt-24">
        <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-5 sm:p-7 shadow-card">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Try it now — type what's in your kitchen</span>
          </div>
          <div className="flex flex-col items-center gap-4">
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

      <FeatureGrid />


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
            <EmptyHint t={t} />
          ) : isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <RecipeCardSkeleton key={i} />
              ))}
            </div>
          ) : (results?.length ?? 0) === 0 ? (
            <NoResults t={t} />
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
              <TrendingUp className="w-5 h-5 text-primary" /> {t("home.trendingNow")}
            </h2>
            <Link to="/explore" className="text-sm text-primary hover:underline">
              {t("home.exploreAll")}
            </Link>
          </div>

          {trending.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : (trending.data?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground">{t("home.noRecipesYet")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trending.data!.slice(0, 8).map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Testimonials />
      <FAQ />

      {/* Final CTA */}
      <section className="px-5 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto rounded-3xl border border-border gradient-card p-8 md:p-12 text-center shadow-card">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-balance">
            Start cooking smarter today
          </h2>
          <p className="mt-2 text-muted-foreground text-balance">
            Free forever. No credit card. Personalized in seconds.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center justify-center mt-6 h-12 px-7 rounded-full gradient-primary text-primary-foreground font-medium shadow-glow hover:opacity-95 transition-opacity"
          >
            Start Free
          </Link>
        </div>
      </section>

        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          {t("home.footer")}
        </div>
      </footer>
    </div>
  );
};

const EmptyHint = ({ t }: { t: (k: string) => string }) => (
  <div className="text-center py-16">
    <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
      <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
    </div>
    <h2 className="text-2xl font-semibold text-foreground mb-2">{t("home.addToStart")}</h2>
    <p className="text-muted-foreground max-w-md mx-auto">{t("home.addToStartDesc")}</p>
  </div>
);

const NoResults = ({ t }: { t: (k: string) => string }) => (
  <div className="text-center py-16">
    <h2 className="text-2xl font-semibold text-foreground mb-2">{t("home.noMatches")}</h2>
    <p className="text-muted-foreground">{t("home.noMatchesDesc")}</p>
  </div>
);

export default Index;
