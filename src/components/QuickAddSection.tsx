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
];

const QuickAddSection = ({ onAddIngredient, currentIngredients }: QuickAddSectionProps) => {
  const availableIngredients = commonIngredients.filter(
    (ing) => !currentIngredients.includes(ing)
  );

  if (availableIngredients.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground font-medium">Quick add:</p>
      <div className="flex flex-wrap gap-2">
        {availableIngredients.slice(0, 8).map((ingredient) => (
          <button
            key={ingredient}
            onClick={() => onAddIngredient(ingredient)}
            className="px-3 py-1.5 bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            + {ingredient}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickAddSection;
