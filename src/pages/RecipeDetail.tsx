import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Heart,
  Share2,
  Bookmark,
  Timer,
} from "lucide-react";
import { toast } from "sonner";
import { getRecipeDetail, type RecipeDetail } from "@/data/recipeDetails";
import NutritionCard from "@/components/recipe/NutritionCard";
import IngredientList from "@/components/recipe/IngredientList";
import InstructionSteps from "@/components/recipe/InstructionSteps";
import RecipeDetailSkeleton from "@/components/recipe/RecipeDetailSkeleton";
import { Button } from "@/components/ui/button";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1200&auto=format&fit=crop";

const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [favorite, setFavorite] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Simulated async fetch (real Supabase wiring activates once Lovable Cloud is resumed)
    const t = setTimeout(() => {
      const data = id ? getRecipeDetail(id) : null;
      setRecipe(data);
      setImgSrc(data?.image ?? null);
      try {
        const favs = JSON.parse(localStorage.getItem("flavorai:favorites") ?? "[]");
        const saves = JSON.parse(localStorage.getItem("flavorai:saved") ?? "[]");
        if (id) {
          setFavorite(favs.includes(id));
          setSaved(saves.includes(id));
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
    }, 250);
    window.scrollTo({ top: 0 });
    return () => clearTimeout(t);
  }, [id]);

  const toggleLocal = (key: string, value: boolean) => {
    if (!id) return;
    try {
      const arr: string[] = JSON.parse(localStorage.getItem(key) ?? "[]");
      const next = value ? Array.from(new Set([...arr, id])) : arr.filter((x) => x !== id);
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleFavorite = () => {
    const next = !favorite;
    setFavorite(next);
    toggleLocal("flavorai:favorites", next);
    toast(next ? "Added to favorites" : "Removed from favorites");
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    toggleLocal("flavorai:saved", next);
    toast(next ? "Recipe saved" : "Removed from saved");
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = recipe?.title ?? "Check out this recipe on FlavorAI";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    } catch {
      toast("Could not share recipe");
    }
  };

  if (loading) return <RecipeDetailSkeleton />;

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-3">Recipe not found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the recipe you're looking for.
        </p>
        <Button onClick={() => navigate("/")}>Back to FlavorAI</Button>
      </div>
    );
  }

  const totalTime = recipe.prep_time + recipe.cook_time;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 bg-card/70 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <p className="hidden sm:block flex-1 text-center font-semibold truncate text-foreground">
            {recipe.title}
          </p>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleFavorite}
              aria-label="Toggle favorite"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  favorite ? "fill-primary text-primary" : "text-foreground"
                }`}
              />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleShare} aria-label="Share recipe">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <article className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card-hover mb-6"
        >
          <img
            src={imgSrc ?? FALLBACK_IMG}
            alt={recipe.title}
            loading="eager"
            decoding="async"
            onError={() => setImgSrc(FALLBACK_IMG)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur text-xs font-semibold text-foreground">
                {recipe.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur text-xs font-semibold text-foreground">
                {recipe.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                {recipe.difficulty}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground drop-shadow-sm">
              {recipe.title}
            </h1>
          </div>
        </motion.div>

        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mb-6">
          {recipe.description}
        </p>

        {/* Stat row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Prep", value: `${recipe.prep_time} min`, icon: Timer },
            { label: "Cook", value: `${recipe.cook_time} min`, icon: Clock },
            { label: "Total", value: `${totalTime} min`, icon: Clock },
            { label: "Servings", value: `${recipe.servings}`, icon: Users },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl bg-card border border-border p-3 flex items-center gap-3"
            >
              <div className="p-2 rounded-lg bg-accent/60">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {recipe.tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-secondary/15 text-secondary text-xs font-medium capitalize"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Two-col body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">
            <IngredientList ingredients={recipe.ingredients} />
            <InstructionSteps instructions={recipe.instructions} />
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-4">
              <NutritionCard nutrition={recipe.nutrition} />

              <div className="grid grid-cols-1 gap-2">
                <Button
                  size="lg"
                  variant={favorite ? "default" : "outline"}
                  onClick={handleFavorite}
                  className="w-full"
                >
                  <Heart className={favorite ? "fill-current" : ""} />
                  {favorite ? "Favorited" : "Add to Favorites"}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleShare}>
                    <Share2 />
                    Share
                  </Button>
                  <Button variant={saved ? "secondary" : "outline"} onClick={handleSave}>
                    <Bookmark className={saved ? "fill-current" : ""} />
                    {saved ? "Saved" : "Save"}
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card/60 p-4 flex items-center gap-3">
                <ChefHat className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Cook with confidence — adjust seasonings to your taste.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

export default RecipeDetailPage;
