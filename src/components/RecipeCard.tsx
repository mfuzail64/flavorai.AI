import { Clock, Users, Flame } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Recipe } from "@/types/recipe";
import RecipeImage from "@/components/recipe/RecipeImage";

interface Props {
  recipe: Recipe;
  index?: number;
}

const RecipeCard = ({ recipe, index = 0 }: Props) => {
  const matched = recipe.matched_ingredients?.length ?? 0;
  const missing = recipe.missing_ingredients?.length ?? 0;
  const total = matched + missing;
  const pct = total ? Math.round((matched / total) * 100) : null;
  const calories = recipe.nutrition?.calories;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 8) * 0.04, duration: 0.35 }}
    >
      <Link
        to={`/recipe/${recipe.slug}`}
        className="group block bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring h-full"
      >
        <div className="relative">
          <RecipeImage
            src={recipe.image_url}
            alt={recipe.title}
            category={recipe.category}
            cuisine={recipe.cuisine}
            status={recipe.image_status}
            aspect="square"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            imgClassName="group-hover:scale-105"
          />
          {pct !== null && (
            <div className="absolute top-3 right-3 bg-card/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-semibold text-secondary z-10">
              {pct}% match
            </div>
          )}
          <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide z-10">
            {recipe.cuisine}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg text-card-foreground mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{recipe.description}</p>

          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.total_time}m
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {recipe.servings}
            </span>
            {typeof calories === "number" && (
              <span className="inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {calories} kcal
              </span>
            )}
            <span className="ml-auto px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
              {recipe.difficulty}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
