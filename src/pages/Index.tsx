import { useEffect, useMemo, useRef, useState } from "react";
import { UtensilsCrossed, Sparkles, Flame, TrendingUp } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
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
import Footer from "@/components/Footer";
import { useRecipeSearch, useTrending } from "@/hooks/useRecipes";
import { toast } from "sonner";


const Index = () => {
  const { t } = useTranslation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const searchRef = useRef<HTMLDivElement>(null);

  const scrollToSearch = () =>
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });


  const handleAddIngredient = (ingredient: string) => {
    const normalized = ingredient.toLowerCase().trim();
    if (normalized && !ingredients.includes(normalized)) {
      setIngredients((prev) => [...prev, normalized]);
    }
    setIngredientQuery("");
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

  // Guard against repeated cards in the trending grid (same id or same title)
  const trendingUnique = useMemo(() => {
    const seen = new Set<string>();
    return (trending.data ?? []).filter((r) => {
      const key = (r.title ?? "").trim().toLowerCase() || r.id;
      if (seen.has(key) || seen.has(r.id)) return false;
      seen.add(key);
      seen.add(r.id);
      return true;
    });
  }, [trending.data]);

  useEffect(() => {
    if (error) toast.error((error as Error).message);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <LandingHero onSeeDemo={scrollToSearch} />

      {/* Ingredient search panel */}
      <section ref={searchRef} className="relative px-5 sm:px-6 py-6 md:py-10 scroll-mt-24">
        <div className="max-w-3xl mx-auto rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-5 sm:p-7 shadow-card">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Try it now — type what's in your kitchen</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <IngredientInput
              onAddIngredient={handleAddIngredient}
              value={ingredientQuery}
              onValueChange={setIngredientQuery}
            />

            {ingredients.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {ingredients.map((i) => (
                  <IngredientTag key={i} ingredient={i} onRemove={() => handleRemoveIngredient(i)} />
                ))}
              </div>
            )}

            <QuickAddSection
              onAddIngredient={handleAddIngredient}
              currentIngredients={ingredients}
              search={ingredientQuery}
            />
          </div>
        </div>
      </section>

      <FeatureGrid />


      {/* Filters + Results */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {enabled && (
            <SectionHeading
              icon={Flame}
              align="left"
              title={isLoading ? "Cooking up ideas…" : `${results?.length ?? 0} recipes`}
              action={<FilterBar value={filters} onChange={setFilters} />}
            />
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
          <SectionHeading
            icon={TrendingUp}
            align="left"
            title={t("home.trendingNow")}
            action={
              <Link
                to="/explore"
                className="text-sm font-medium text-primary hover:underline rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t("home.exploreAll")}
              </Link>
            }
          />

          {trending.isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : trendingUnique.length === 0 ? (
            <p className="text-muted-foreground">{t("home.noRecipesYet")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingUnique.slice(0, 8).map((r, i) => (
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-balance text-foreground">
            Start cooking smarter today
          </h2>
          <p className="mt-2 text-base text-muted-foreground text-balance">
            Free to start. No credit card. Personalized in seconds.
          </p>
          <Button asChild variant="hero" size="pill" className="mt-6">
            <Link to="/auth">Create your free account</Link>
          </Button>
        </div>
      </section>
      <Footer />

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
