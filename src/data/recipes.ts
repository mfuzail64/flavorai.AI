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
  {
    id: "13",
    title: "Garlic Butter Shrimp",
    image: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?w=800&auto=format&fit=crop",
    time: "15 min",
    servings: 4,
    ingredients: ["shrimp", "garlic", "butter", "lemon", "parsley"],
    difficulty: "Easy",
  },
  {
    id: "14",
    title: "Bacon and Eggs Breakfast",
    image: "https://images.unsplash.com/photo-1528607929212-2636ec44253e?w=800&auto=format&fit=crop",
    time: "15 min",
    servings: 2,
    ingredients: ["bacon", "eggs", "butter", "bread"],
    difficulty: "Easy",
  },
  {
    id: "15",
    title: "Spinach and Mushroom Omelette",
    image: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop",
    time: "12 min",
    servings: 1,
    ingredients: ["eggs", "spinach", "mushroom", "cheese", "butter"],
    difficulty: "Easy",
  },
  {
    id: "16",
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&auto=format&fit=crop",
    time: "10 min",
    servings: 2,
    ingredients: ["avocado", "bread", "lemon", "olive oil"],
    difficulty: "Easy",
  },
  {
    id: "17",
    title: "Broccoli Cheddar Soup",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop",
    time: "35 min",
    servings: 6,
    ingredients: ["broccoli", "cheese", "butter", "onion", "milk", "garlic"],
    difficulty: "Medium",
  },
  {
    id: "18",
    title: "Honey Ginger Chicken",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&auto=format&fit=crop",
    time: "30 min",
    servings: 4,
    ingredients: ["chicken", "honey", "ginger", "garlic", "soy sauce"],
    difficulty: "Medium",
  },
  {
    id: "19",
    title: "Stuffed Bell Peppers",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop",
    time: "45 min",
    servings: 4,
    ingredients: ["bell pepper", "beef", "rice", "tomato", "onion", "cheese"],
    difficulty: "Medium",
  },
  {
    id: "20",
    title: "Shrimp Tacos",
    image: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&auto=format&fit=crop",
    time: "25 min",
    servings: 4,
    ingredients: ["shrimp", "lime", "cilantro", "avocado", "onion"],
    difficulty: "Easy",
  },
  {
    id: "21",
    title: "Zucchini Noodles with Pesto",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop",
    time: "20 min",
    servings: 2,
    ingredients: ["zucchini", "basil", "parmesan", "garlic", "olive oil"],
    difficulty: "Easy",
  },
  {
    id: "22",
    title: "Corn and Black Bean Salad",
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop",
    time: "15 min",
    servings: 6,
    ingredients: ["corn", "beans", "lime", "cilantro", "onion", "bell pepper"],
    difficulty: "Easy",
  },
  {
    id: "23",
    title: "Pork Stir Fry",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop",
    time: "25 min",
    servings: 4,
    ingredients: ["pork", "broccoli", "soy sauce", "garlic", "ginger", "rice"],
    difficulty: "Medium",
  },
  {
    id: "24",
    title: "Turkey Club Sandwich",
    image: "https://images.unsplash.com/photo-1567234669003-dce7a7a88821?w=800&auto=format&fit=crop",
    time: "15 min",
    servings: 2,
    ingredients: ["turkey", "bacon", "bread", "tomato", "lettuce"],
    difficulty: "Easy",
  },
  {
    id: "25",
    title: "Cucumber Avocado Salad",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
    time: "10 min",
    servings: 4,
    ingredients: ["cucumber", "avocado", "lime", "cilantro", "onion"],
    difficulty: "Easy",
  },
  {
    id: "26",
    title: "Creamy Tuscan Salmon",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop",
    time: "30 min",
    servings: 4,
    ingredients: ["salmon", "cream", "spinach", "garlic", "tomato", "parmesan"],
    difficulty: "Medium",
  },
  {
    id: "27",
    title: "Mushroom Bacon Pasta",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop",
    time: "25 min",
    servings: 4,
    ingredients: ["pasta", "mushroom", "bacon", "cream", "parmesan", "garlic"],
    difficulty: "Medium",
  },
  {
    id: "28",
    title: "Honey Lime Shrimp",
    image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop",
    time: "20 min",
    servings: 4,
    ingredients: ["shrimp", "honey", "lime", "garlic", "ginger", "soy sauce"],
    difficulty: "Easy",
  },
  {
    id: "29",
    title: "Cheesy Broccoli Rice",
    image: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&auto=format&fit=crop",
    time: "25 min",
    servings: 6,
    ingredients: ["rice", "broccoli", "cheese", "butter", "milk"],
    difficulty: "Easy",
  },
  {
    id: "30",
    title: "Flour Tortilla Quesadillas",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800&auto=format&fit=crop",
    time: "15 min",
    servings: 4,
    ingredients: ["flour", "cheese", "chicken", "bell pepper", "onion"],
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
