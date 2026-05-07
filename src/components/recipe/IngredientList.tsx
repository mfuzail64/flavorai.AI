import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Props {
  ingredients: string[];
}

const IngredientList = ({ ingredients }: Props) => {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">Ingredients</h2>
      <ul className="space-y-2">
        {ingredients.map((ing, i) => {
          const isChecked = checked.has(i);
          return (
            <motion.li
              key={`${ing}-${i}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-border bg-card hover:bg-accent/40 transition-colors text-left"
              >
                <span
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isChecked ? "bg-primary border-primary" : "border-muted-foreground/40"
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 text-primary-foreground" />}
                </span>
                <span
                  className={`capitalize font-medium ${
                    isChecked ? "line-through text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {ing}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
};

export default IngredientList;
