import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import RecipeCardSkeleton from "@/components/RecipeCardSkeleton";
import { useRecipeSearch } from "@/hooks/useRecipes";
import { CUISINES, DIETS } from "@/components/FilterBar";
import { motion } from "framer-motion";

const COLLECTIONS = [
  { label: "Trending 2026", tag: "trending" },
  { label: "Viral", tag: "viral" },
  { label: "Quick <15 min", maxTime: 15 },
  { label: "Student meals", tag: "student" },
  { label: "Budget", tag: "budget" },
  { label: "High-Protein", diet: "High-Protein" },
  { label: "Keto", diet: "Keto" },
  { label: "Vegan", diet: "Vegan" },
  { label: "Vegetarian", diet: "Vegetarian" },
  { label: "Desserts", category: "Dessert" },
  { label: "Drinks", category: "Drink" },
  { label: "Street food", tag: "street-food" },
];

type Selection =
  | { kind: "cuisine"; value: string; label: string }
  | { kind: "collection"; query: any; label: string };

const Explore = () => {
  const [sel, setSel] = useState<Selection>({ kind: "cuisine", value: "Italian", label: "Italian" });

  const params =
    sel.kind === "cuisine"
      ? { cuisine: sel.value }
      : { ...sel.query };

  const { data, isLoading } = useRecipeSearch(params, true);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="px-6 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Explore</h1>
          <p className="text-muted-foreground">Browse recipes by cuisine, diet, or trending collections.</p>
        </div>
      </section>

      <section className="px-6 pb-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Cuisines</h3>
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
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Collections</h3>
            <div className="flex flex-wrap gap-2">
              {COLLECTIONS.map((col) => {
                const active = sel.kind === "collection" && sel.label === col.label;
                const { label, ...query } = col as any;
                return (
                  <button
                    key={col.label}
                    onClick={() => setSel({ kind: "collection", query, label: col.label })}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      active
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-card border border-border text-foreground hover:bg-accent"
                    }`}
                  >
                    {col.label}
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
            key={sel.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl md:text-2xl font-bold text-foreground mb-6"
          >
            {sel.label}
          </motion.h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <RecipeCardSkeleton key={i} />)}
            </div>
          ) : (data?.length ?? 0) === 0 ? (
            <p className="text-muted-foreground">No recipes yet for this selection.</p>
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
