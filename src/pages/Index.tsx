import { useState, useMemo } from "react";
import { UtensilsCrossed, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import IngredientInput from "@/components/IngredientInput";
import IngredientTag from "@/components/IngredientTag";
import QuickAddSection from "@/components/QuickAddSection";
import RecipeCard from "@/components/RecipeCard";
import { findRecipesByIngredients } from "@/data/recipes";

const Index = () => {
  const [ingredients, setIngredients] = useState<string[]>([]);

  const handleAddIngredient = (ingredient: string) => {
    const normalized = ingredient.toLowerCase().trim();
    if (normalized && !ingredients.includes(normalized)) {
      setIngredients((prev) => [...prev, normalized]);
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients((prev) => prev.filter((i) => i !== ingredient));
  };

  const matchedRecipes = useMemo(
    () => findRecipesByIngredients(ingredients),
    [ingredients]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/50 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent rounded-full text-accent-foreground text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Find recipes with what you have
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
            Turn Your Ingredients Into{" "}
            <span className="text-primary">Delicious Meals</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "200ms" }}>
            Add the ingredients you have at home and discover amazing recipes you can make right now.
          </p>
          
          <div className="flex flex-col items-center gap-6 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <IngredientInput onAddIngredient={handleAddIngredient} />
            
            {ingredients.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
                {ingredients.map((ingredient) => (
                  <IngredientTag
                    key={ingredient}
                    ingredient={ingredient}
                    onRemove={() => handleRemoveIngredient(ingredient)}
                  />
                ))}
              </div>
            )}
            
            <QuickAddSection
              onAddIngredient={handleAddIngredient}
              currentIngredients={ingredients}
            />
          </div>
        </div>
      </section>
      
      {/* Results Section */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {ingredients.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Add some ingredients to get started
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Type ingredients you have at home and we'll show you delicious recipes you can make.
              </p>
            </div>
          ) : matchedRecipes.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-full mb-6">
                <UtensilsCrossed className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                No recipes found
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Try adding more ingredients or different ones to find matching recipes.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Found {matchedRecipes.length} Recipe{matchedRecipes.length !== 1 && "s"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  Sorted by best match
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {matchedRecipes.map((recipe, index) => (
                  <RecipeCard key={recipe.id} recipe={recipe} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border mt-12">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground text-sm">
          <p>Discover delicious recipes with ingredients you already have.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
