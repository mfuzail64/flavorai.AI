import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuickAddSectionProps {
  onAddIngredient: (ingredient: string) => void;
  currentIngredients: string[];
}

interface IngredientCategory {
  name: string;
  ingredients: string[];
}

const ingredientCategories: IngredientCategory[] = [
  {
    name: "Proteins",
    ingredients: ["chicken", "beef", "pork", "turkey", "salmon", "shrimp", "bacon", "eggs"],
  },
  {
    name: "Vegetables",
    ingredients: ["tomato", "onion", "garlic", "carrot", "spinach", "broccoli", "bell pepper", "mushroom", "corn", "cucumber", "zucchini"],
  },
  {
    name: "Dairy & Cheese",
    ingredients: ["cheese", "milk", "butter", "cream", "parmesan"],
  },
  {
    name: "Grains & Starches",
    ingredients: ["rice", "pasta", "bread", "potato", "flour"],
  },
  {
    name: "Fruits",
    ingredients: ["lemon", "lime", "avocado"],
  },
  {
    name: "Herbs & Spices",
    ingredients: ["basil", "cilantro", "ginger"],
  },
  {
    name: "Pantry",
    ingredients: ["olive oil", "soy sauce", "honey", "sugar", "beans"],
  },
];

const QuickAddSection = ({ onAddIngredient, currentIngredients }: QuickAddSectionProps) => {
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Proteins", "Vegetables"]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryName)
        ? prev.filter((c) => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  const filteredCategories = ingredientCategories
    .map((category) => ({
      ...category,
      ingredients: category.ingredients.filter(
        (ing) =>
          !currentIngredients.includes(ing) &&
          ing.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((category) => category.ingredients.length > 0);

  if (filteredCategories.every((c) => c.ingredients.length === 0)) return null;

  return (
    <div className="space-y-4">
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

      <div className="space-y-3">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.name) || search.length > 0;

          return (
            <div key={category.name} className="space-y-2">
              <button
                onClick={() => toggleCategory(category.name)}
                className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {category.name}
                <span className="text-xs text-muted-foreground font-normal">
                  ({category.ingredients.length})
                </span>
              </button>

              {isExpanded && (
                <div className="flex flex-wrap gap-2 pl-6">
                  {category.ingredients.map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => onAddIngredient(ingredient)}
                      className="px-3 py-1.5 bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      + {ingredient}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredCategories.length === 0 && search && (
          <p className="text-sm text-muted-foreground italic">No matching ingredients</p>
        )}
      </div>
    </div>
  );
};

export default QuickAddSection;
