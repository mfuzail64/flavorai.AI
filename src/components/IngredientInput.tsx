import { KeyboardEvent } from "react";
import { Plus, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface IngredientInputProps {
  onAddIngredient: (ingredient: string) => void;
  value: string;
  onValueChange: (value: string) => void;
}

const IngredientInput = ({ onAddIngredient, value, onValueChange }: IngredientInputProps) => {
  const { t } = useTranslation();

  const handleSubmit = () => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed) {
      onAddIngredient(trimmed);
      onValueChange("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <label htmlFor="ingredient-search" className="block text-sm font-medium text-foreground mb-2">
        Search or add an ingredient
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="ingredient-search"
            type="text"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("home.addPlaceholder")}
            aria-describedby="ingredient-search-hint"
            className="w-full pl-12 pr-4 py-3.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus:border-primary transition-all shadow-card"
          />
        </div>
        <Button onClick={handleSubmit} variant="hero" size="xl" aria-label="Add ingredient">
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span className="hidden sm:inline">{t("home.add")}</span>
        </Button>
      </div>
      <p id="ingredient-search-hint" className="mt-2 text-sm text-muted-foreground">
        Type to filter the suggestions below, or press Add to use your own ingredient.
      </p>
    </div>
  );
};

export default IngredientInput;
