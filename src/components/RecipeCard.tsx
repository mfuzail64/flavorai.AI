import { Clock, Users, ChefHat } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  servings: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

const RecipeCard = ({ recipe, index }: RecipeCardProps) => {
  const matchPercentage = Math.round(
    (recipe.matchedIngredients.length /
      (recipe.matchedIngredients.length + recipe.missingIngredients.length)) *
      100
  );

  return (
    <article
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-secondary">
          {matchPercentage}% match
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        
        <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.time}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {recipe.servings}
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            {recipe.difficulty}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {recipe.matchedIngredients.slice(0, 3).map((ing) => (
              <span
                key={ing}
                className="px-2 py-0.5 bg-secondary/10 text-secondary text-xs rounded-full font-medium"
              >
                ✓ {ing}
              </span>
            ))}
          </div>
          
          {recipe.missingIngredients.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Missing: {recipe.missingIngredients.slice(0, 2).join(", ")}
              {recipe.missingIngredients.length > 2 &&
                ` +${recipe.missingIngredients.length - 2} more`}
            </p>
          )}
        </div>
      </div>
    </article>
  );
};

export default RecipeCard;
