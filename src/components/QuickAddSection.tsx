import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface QuickAddSectionProps {
  onAddIngredient: (ingredient: string) => void;
  currentIngredients: string[];
  /** Search text typed in the single ingredient field above */
  search?: string;
}

interface IngredientCategory {
  name: string;
  ingredients: string[];
}

const VISIBLE_PER_CATEGORY = 8;

const ingredientCategories: IngredientCategory[] = [
  {
    name: "Proteins",
    ingredients: ["chicken", "beef", "pork", "turkey", "salmon", "shrimp", "bacon", "eggs", "lamb", "duck", "tuna", "cod", "tilapia", "crab", "lobster", "sausage", "ham", "tofu", "tempeh"],
  },
  {
    name: "Vegetables",
    ingredients: ["tomato", "onion", "garlic", "carrot", "spinach", "broccoli", "bell pepper", "mushroom", "corn", "cucumber", "zucchini", "celery", "cabbage", "kale", "lettuce", "asparagus", "green beans", "peas", "eggplant", "cauliflower", "artichoke", "leek", "radish", "beet", "squash", "sweet potato"],
  },
  {
    name: "Dairy & Cheese",
    ingredients: ["cheese", "milk", "butter", "cream", "parmesan", "mozzarella", "cheddar", "feta", "goat cheese", "cream cheese", "yogurt", "sour cream", "ricotta", "brie", "swiss cheese"],
  },
  {
    name: "Grains & Starches",
    ingredients: ["rice", "pasta", "bread", "potato", "flour", "quinoa", "oats", "couscous", "barley", "cornmeal", "tortilla", "noodles", "breadcrumbs", "polenta", "bulgur"],
  },
  {
    name: "Fruits",
    ingredients: ["lemon", "lime", "avocado", "apple", "banana", "orange", "strawberry", "blueberry", "mango", "pineapple", "grape", "peach", "pear", "raspberry", "coconut", "watermelon", "cherry"],
  },
  {
    name: "Herbs & Spices",
    ingredients: ["basil", "cilantro", "ginger", "oregano", "thyme", "rosemary", "parsley", "mint", "dill", "cumin", "paprika", "turmeric", "cinnamon", "cayenne", "chili flakes", "bay leaf", "sage", "tarragon"],
  },
  {
    name: "Pantry",
    ingredients: ["olive oil", "soy sauce", "honey", "sugar", "beans", "salt", "pepper", "vinegar", "mustard", "mayo", "ketchup", "hot sauce", "worcestershire", "sesame oil", "coconut oil", "maple syrup", "peanut butter", "almonds", "walnuts", "chickpeas", "lentils"],
  },
];

const QuickAddSection = ({ onAddIngredient, currentIngredients, search = "" }: QuickAddSectionProps) => {
  // Only the first category is open by default — avoids a wall of buttons
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["Proteins"]);
  const [showAll, setShowAll] = useState<string[]>([]);

  const term = search.trim().toLowerCase();

  const toggle = (list: string[], set: (v: string[]) => void, name: string) =>
    set(list.includes(name) ? list.filter((c) => c !== name) : [...list, name]);

  const filteredCategories = ingredientCategories
    .map((category) => ({
      ...category,
      ingredients: category.ingredients.filter(
        (ing) => !currentIngredients.includes(ing) && ing.includes(term),
      ),
    }))
    .filter((category) => category.ingredients.length > 0);

  if (filteredCategories.length === 0) {
    return term ? (
      <p className="text-sm text-muted-foreground">
        No suggestions match “{search}” — press Add to use it anyway.
      </p>
    ) : null;
  }

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-medium text-foreground">Or browse common ingredients</h3>

      <div className="space-y-3">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategories.includes(category.name) || term.length > 0;
          const isShowingAll = showAll.includes(category.name) || term.length > 0;
          const visible = isShowingAll
            ? category.ingredients
            : category.ingredients.slice(0, VISIBLE_PER_CATEGORY);
          const hidden = category.ingredients.length - visible.length;
          const panelId = `quick-add-${category.name.replace(/[^a-z]/gi, "-").toLowerCase()}`;

          return (
            <div key={category.name} className="space-y-2">
              <button
                type="button"
                onClick={() => toggle(expandedCategories, setExpandedCategories, category.name)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="flex items-center gap-2 rounded-md text-sm font-medium text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                )}
                {category.name}
                <span className="text-sm font-normal text-muted-foreground">
                  ({category.ingredients.length})
                </span>
              </button>

              <div id={panelId} hidden={!isExpanded}>
                <div className="flex flex-wrap gap-2 pl-6">
                  {visible.map((ingredient) => (
                    <button
                      type="button"
                      key={ingredient}
                      onClick={() => onAddIngredient(ingredient)}
                      aria-label={`Add ${ingredient}`}
                      className="px-3 py-1.5 bg-muted hover:bg-accent text-foreground hover:text-accent-foreground rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      + {ingredient}
                    </button>
                  ))}

                  {hidden > 0 && (
                    <button
                      type="button"
                      onClick={() => toggle(showAll, setShowAll, category.name)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                      Show {hidden} more {category.name.toLowerCase()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickAddSection;
