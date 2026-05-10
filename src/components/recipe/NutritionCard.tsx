import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { RecipeNutrition } from "@/types/recipe";
import { Flame, Beef, Wheat, Droplet, Leaf, Candy, Zap } from "lucide-react";

interface Props {
  nutrition: RecipeNutrition;
}

const items = [
  { key: "protein", labelKey: "recipe.protein", unit: "g", icon: Beef, color: "text-rose-500" },
  { key: "carbs",   labelKey: "recipe.carbs",   unit: "g", icon: Wheat, color: "text-amber-500" },
  { key: "fat",     labelKey: "recipe.fat",     unit: "g", icon: Droplet, color: "text-yellow-500" },
  { key: "fiber",   labelKey: "recipe.fiber",   unit: "g", icon: Leaf, color: "text-emerald-500" },
  { key: "sugar",   labelKey: "recipe.sugar",   unit: "g", icon: Candy, color: "text-pink-500" },
  { key: "sodium",  labelKey: "recipe.sodium",  unit: "mg", icon: Zap, color: "text-blue-500" },
] as const;

const NutritionCard = ({ nutrition }: Props) => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-card/70 backdrop-blur-md shadow-card p-6"
    >
      <h3 className="text-lg font-semibold text-card-foreground mb-4">{t("recipe.nutritionFacts")}</h3>

      <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 p-5 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("recipe.calories")}</p>
            <p className="text-2xl font-bold text-foreground leading-tight">{nutrition.calories}</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{t("recipe.perServing")}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {items.map(({ key, labelKey, unit, icon: Icon, color }) => (
          <div
            key={key}
            className="rounded-xl border border-border/60 bg-background/50 p-3 flex items-center gap-3"
          >
            <Icon className={`w-4 h-4 ${color}`} />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t(labelKey)}</p>
              <p className="text-sm font-semibold text-foreground">
                {(nutrition as unknown as Record<string, number>)[key]}
                <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NutritionCard;
