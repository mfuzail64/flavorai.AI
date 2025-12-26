import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuickAddSectionProps {
  onAddIngredient: (ingredient: string) => void;
  currentIngredients: string[];
}

const commonIngredients = [
  "chicken",
  "eggs",
  "rice",
  "pasta",
  "tomato",
  "onion",
  "garlic",
  "cheese",
  "milk",
  "butter",
  "olive oil",
  "potato",
  "carrot",
  "beef",
  "bread",
  "lemon",
  "salmon",
  "shrimp",
  "bacon",
  "spinach",
  "broccoli",
  "bell pepper",
  "mushroom",
  "avocado",
  "beans",
  "corn",
  "flour",
  "sugar",
  "honey",
  "ginger",
  "soy sauce",
  "cream",
  "parmesan",
  "basil",
  "cilantro",
  "lime",
  "cucumber",
  "zucchini",
  "pork",
  "turkey",
];

const QuickAddSection = ({ onAddIngredient, currentIngredients }: QuickAddSectionProps) => {
  const [search, setSearch] = useState("");

  const availableIngredients = commonIngredients.filter(
    (ing) => !currentIngredients.includes(ing)
  );

  const filteredIngredients = availableIngredients.filter((ing) =>
    ing.toLowerCase().includes(search.toLowerCase())
  );

  if (availableIngredients.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground font-medium">Quick add:</p>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {filteredIngredients.slice(0, 12).map((ingredient) => (
          <button
            key={ingredient}
            onClick={() => onAddIngredient(ingredient)}
            className="px-3 py-1.5 bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            + {ingredient}
          </button>
        ))}
        {filteredIngredients.length === 0 && search && (
          <p className="text-sm text-muted-foreground italic">No matching ingredients</p>
        )}
      </div>
    </div>
  );
};

export default QuickAddSection;
