import { X } from "lucide-react";

interface IngredientTagProps {
  ingredient: string;
  onRemove: () => void;
}

const IngredientTag = ({ ingredient, onRemove }: IngredientTagProps) => {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm font-medium animate-scale-in transition-all duration-200 hover:bg-primary hover:text-primary-foreground group">
      {ingredient}
      <button
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-primary-foreground/20 transition-colors"
        aria-label={`Remove ${ingredient}`}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </span>
  );
};

export default IngredientTag;
