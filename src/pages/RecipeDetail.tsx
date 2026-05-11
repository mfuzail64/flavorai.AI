import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, ChefHat, Heart, Share2, Timer } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import NutritionCard from "@/components/recipe/NutritionCard";
import IngredientList from "@/components/recipe/IngredientList";
import InstructionSteps from "@/components/recipe/InstructionSteps";
import RecipeDetailSkeleton from "@/components/recipe/RecipeDetailSkeleton";
import RecipeImage from "@/components/recipe/RecipeImage";
import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useRecipeDetail } from "@/hooks/useRecipeDetail";
import { useSimilar } from "@/hooks/useRecipes";
import { useFavorites } from "@/hooks/useFavorites";

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: recipe, isLoading } = useRecipeDetail(id);
  const { data: similar } = useSimilar(recipe?.id);
  const { isFavorite, toggle } = useFavorites();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    const title = recipe?.title ?? "FlavorAI";
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* cancelled */ }
    }
    try { await navigator.clipboard.writeText(url); toast(t("recipe.linkCopied")); }
    catch { toast(t("recipe.couldNotShare")); }
  };

  if (isLoading) return (<><Header /><RecipeDetailSkeleton /></>);

  if (!recipe) {
    return (
      <>
        <Header />
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-3">{t("recipe.notFound")}</h1>
          <p className="text-muted-foreground mb-8">{t("recipe.notFoundDesc")}</p>
          <Button onClick={() => navigate("/")}>{t("recipe.backToHome")}</Button>
        </div>
      </>
    );
  }

  const fav = isFavorite(recipe.id);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="sticky top-[68px] z-40 bg-card/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-12 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> {t("common.back")}
          </Link>
          <p className="hidden sm:block flex-1 text-center font-semibold truncate text-foreground">
            {recipe.title}
          </p>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" onClick={() => toggle.mutate(recipe.id)} aria-label={t("recipe.addToFavorites")}>
              <Heart className={`w-5 h-5 transition-colors ${fav ? "fill-primary text-primary" : "text-foreground"}`} />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleShare} aria-label={t("common.share")}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <article className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden shadow-card-hover mb-6"
        >
          <RecipeImage
            src={recipe.image_url}
            alt={recipe.title}
            category={recipe.category}
            cuisine={recipe.cuisine}
            status={recipe.image_status}
            aspect="wide"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur text-xs font-semibold text-foreground">{recipe.cuisine}</span>
              <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur text-xs font-semibold text-foreground">{recipe.category}</span>
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">{recipe.difficulty}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground drop-shadow-sm">{recipe.title}</h1>
          </div>
        </motion.div>

        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mb-6">{recipe.description}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: t("recipe.prep"), value: `${recipe.prep_time} ${t("recipe.minutes")}`, icon: Timer },
            { label: t("recipe.cook"), value: `${recipe.cook_time} ${t("recipe.minutes")}`, icon: Clock },
            { label: t("recipe.total"), value: `${recipe.total_time} ${t("recipe.minutes")}`, icon: Clock },
            { label: t("recipe.servings"), value: `${recipe.servings}`, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl bg-card border border-border p-3 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/60"><Icon className="w-4 h-4 text-primary" /></div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {recipe.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {recipe.tags.map((tg) => (
              <span key={tg} className="px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-medium capitalize">#{tg}</span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <IngredientList ingredients={recipe.ingredients} />
            <InstructionSteps instructions={recipe.instructions} />
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-4">
              <NutritionCard nutrition={recipe.nutrition} />
              <Button
                size="lg"
                variant={fav ? "default" : "outline"}
                onClick={() => toggle.mutate(recipe.id)}
                className="w-full"
              >
                <Heart className={fav ? "fill-current" : ""} />
                {fav ? t("recipe.favorited") : t("recipe.addToFavorites")}
              </Button>
              <div className="rounded-xl border border-border bg-card/60 p-4 flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">{t("recipe.cookHint")}</p>
              </div>
            </div>
          </aside>
        </div>

        {(similar?.length ?? 0) > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("recipe.youMightAlsoLike")}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similar!.slice(0, 4).map((r, i) => (
                <RecipeCard key={r.id} recipe={r} index={i} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default RecipeDetailPage;
