import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import { useRecipeSearch } from "@/hooks/useRecipes";
import { CUISINES } from "@/components/FilterBar";
import { motion } from "framer-motion";

type Selection =
  | { kind: "cuisine"; value: string; label: string }
  | { kind: "collection"; query: any; labelKey: string };

const Explore = () => {
  const { t } = useTranslation();
  const [sel, setSel] = useState<Selection>({ kind: "cuisine", value: "Italian", label: "Italian" });

  const COLLECTIONS = [
    { labelKey: "collections.trending2026", tag: "trending" },
    { labelKey: "collections.viral", tag: "viral" },
    { labelKey: "collections.quick15", maxTime: 15 },
    { labelKey: "collections.student", tag: "student" },
    { labelKey: "collections.budget", tag: "budget" },
    { labelKey: "collections.highProtein", diet: "High-Protein" },
    { labelKey: "collections.keto", diet: "Keto" },
    { labelKey: "collections.vegan", diet: "Vegan" },
    { labelKey: "collections.vegetarian", diet: "Vegetarian" },
    { labelKey: "collections.desserts", category: "Dessert" },
    { labelKey: "collections.drinks", category: "Drink" },
    { labelKey: "collections.streetFood", tag: "street-food" },
  ];

  const params =
    sel.kind === "cuisine"
      ? { cuisine: sel.value }
      : { ...sel.query };

  const { data, isLoading } = useRecipeSearch(params, true);
  const headerLabel = sel.kind === "cuisine" ? sel.label : t(sel.labelKey);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t("explore.title")}</h1>
          <p className="text-muted-foreground">{t("explore.subtitle")}</p>
        </div>
      </section>

      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{t("explore.cuisines")}</h3>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map((c) => {
                const active = sel.kind === "cuisine" && sel.value === c;
                return (
                  <button
                    key={c}
                    onClick={() => setSel({ kind: "cuisine", value: c, label: c })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">{t("explore.collections")}</h3>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((col) => {
                const active = sel.kind === "collection" && (sel as any).labelKey === col.labelKey;
                const { labelKey, ...query } = col as any;
                return (
                  <button
                    key={col.labelKey}
                    onClick={() => setSel({ kind: "collection", query, labelKey })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {t(col.labelKey)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            key={headerLabel}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold text-foreground mb-6"
          >
            {headerLabel}
          </motion.h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : (data?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground">{t("explore.noRecipes")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data!.map((r, i) => <RecipeCard key={r.id} recipe={r} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Explore;
