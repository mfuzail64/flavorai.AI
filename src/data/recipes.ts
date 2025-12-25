export interface Recipe {
  id: string;
  title: string;
  image: string;
  time: string;
  servings: number;
  ingredients: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Creamy Garlic Parmesan Chicken",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop",
    time: "35 min",
    servings: 4,
    ingredients: ["chicken", "garlic", "parmesan", "butter", "cream", "olive oil"],
    difficulty: "Medium",
  },
  {
    id: "2",
    title: "Classic Tomato Basil Pasta",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop",
    time: "25 min",
    servings: 4,
    ingredients: ["pasta", "tomato", "garlic", "basil", "olive oil", "parmesan"],
    difficulty: "Easy",
  },
  {
    id: "3",
    title: "Fluffy Scrambled Eggs with Cheese",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop",
    time: "10 min",
    servings: 2,
    ingredients: ["eggs", "butter", "cheese", "milk"],
    difficulty: "Easy",
  },
  {
    id: "4",
    title: "Honey Garlic Glazed Salmon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop",
    time: "25 min",
    servings: 2,
    ingredients: ["salmon", "garlic", "honey", "soy sauce", "lemon"],
    difficulty: "Medium",
  },
  {
    id: "5",
    title: "Crispy Roasted Potatoes",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82ber?w=800&auto=format&fit=crop",
    time: "45 min",
    servings: 4,
    ingredients: ["potato", "olive oil", "garlic", "rosemary"],
    difficulty: "Easy",
  },
  {
    id: "6",
    title: "Beef Stir Fry with Vegetables",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop",
    time: "20 min",
    servings: 4,
    ingredients: ["beef", "onion", "carrot", "garlic", "soy sauce", "rice"],
    difficulty: "Medium",
  },
  {
    id: "7",
    title: "Creamy Mushroom Risotto",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop",
    time: "40 min",
    servings: 4,
    ingredients: ["rice", "mushroom", "butter", "onion", "parmesan", "garlic"],
    difficulty: "Hard",
  },
  {
    id: "8",
    title: "Grilled Cheese Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop",
    time: "10 min",
    servings: 1,
    ingredients: ["bread", "cheese", "butter"],
    difficulty: "Easy",
  },
  {
    id: "9",
    title: "Lemon Herb Roasted Chicken",
    image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&auto=format&fit=crop",
    time: "60 min",
    servings: 6,
    ingredients: ["chicken", "lemon", "garlic", "butter", "rosemary", "thyme"],
    difficulty: "Medium",
  },
  {
    id: "10",
    title: "Vegetable Fried Rice",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop",
    time: "15 min",
    servings: 4,
    ingredients: ["rice", "eggs", "carrot", "onion", "garlic", "soy sauce"],
    difficulty: "Easy",
  },
  {
    id: "11",
    title: "Classic Beef Burger",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop",
    time: "20 min",
    servings: 4,
    ingredients: ["beef", "bread", "onion", "tomato", "cheese", "lettuce"],
    difficulty: "Easy",
  },
  {
    id: "12",
    title: "Creamy Mashed Potatoes",
    image: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=800&auto=format&fit=crop",
    time: "30 min",
    servings: 6,
    ingredients: ["potato", "butter", "milk", "garlic"],
    difficulty: "Easy",
  },
];

export function findRecipesByIngredients(userIngredients: string[]) {
  if (userIngredients.length === 0) return [];

  const results = recipes
    .map((recipe) => {
      const matchedIngredients = recipe.ingredients.filter((ing) =>
        userIngredients.some((userIng) => ing.includes(userIng) || userIng.includes(ing))
      );
      const missingIngredients = recipe.ingredients.filter(
        (ing) => !userIngredients.some((userIng) => ing.includes(userIng) || userIng.includes(ing))
      );

      return {
        ...recipe,
        matchedIngredients,
        missingIngredients,
        matchCount: matchedIngredients.length,
      };
    })
    .filter((recipe) => recipe.matchCount > 0)
    .sort((a, b) => {
      // Sort by match percentage, then by total matches
      const aPercent = a.matchCount / a.ingredients.length;
      const bPercent = b.matchCount / b.ingredients.length;
      if (bPercent !== aPercent) return bPercent - aPercent;
      return b.matchCount - a.matchCount;
    });

  return results;
}
