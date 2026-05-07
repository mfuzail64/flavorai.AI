import { recipes, type Recipe } from "./recipes";

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface RecipeDetail extends Recipe {
  description: string;
  cuisine: string;
  category: string;
  prep_time: number;
  cook_time: number;
  instructions: string[];
  nutrition: RecipeNutrition;
  tags: string[];
}

const CUISINE_BY_KEYWORD: Array<[RegExp, string]> = [
  [/pasta|risotto|parmesan|pesto/i, "Italian"],
  [/taco|quesadilla|tortilla|cilantro|lime/i, "Mexican"],
  [/soy sauce|ginger|stir fry|fried rice/i, "Asian"],
  [/curry|garam|tikka/i, "Indian"],
  [/burger|bacon|club/i, "American"],
  [/salmon|shrimp|seafood/i, "Mediterranean"],
];

const CATEGORY_BY_KEYWORD: Array<[RegExp, string]> = [
  [/breakfast|eggs|bacon|toast|omelette|scrambled/i, "Breakfast"],
  [/salad|soup/i, "Light"],
  [/sandwich|burger|taco|quesadilla/i, "Lunch"],
  [/dessert|cake|cookie/i, "Dessert"],
];

function pickFromMap(text: string, map: Array<[RegExp, string]>, fallback: string) {
  for (const [re, val] of map) if (re.test(text)) return val;
  return fallback;
}

function parseTimeMin(t: string): number {
  const m = t.match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 30;
}

function estimateNutrition(recipe: Recipe): RecipeNutrition {
  const ings = recipe.ingredients.join(" ").toLowerCase();
  let calories = 320;
  let protein = 12;
  let carbs = 30;
  let fat = 12;
  if (/chicken|beef|pork|salmon|shrimp|turkey/.test(ings)) {
    protein += 22;
    calories += 120;
    fat += 6;
  }
  if (/pasta|rice|bread|potato|tortilla|flour/.test(ings)) {
    carbs += 28;
    calories += 90;
  }
  if (/cheese|butter|cream|parmesan|milk/.test(ings)) {
    fat += 10;
    calories += 80;
  }
  if (/avocado|olive oil|nuts/.test(ings)) {
    fat += 8;
    calories += 60;
  }
  return {
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    fiber: 4 + Math.round(recipe.ingredients.length / 2),
    sugar: 5,
    sodium: 480,
  };
}

function buildInstructions(recipe: Recipe): string[] {
  const ing = recipe.ingredients;
  const list = ing.join(", ");
  return [
    `Gather and prep all ingredients: ${list}.`,
    `Heat a pan over medium heat and add a splash of ${ing.includes("olive oil") ? "olive oil" : "butter or oil"}.`,
    ing.find((i) => /chicken|beef|pork|salmon|shrimp|turkey|bacon/.test(i))
      ? `Cook the ${ing.find((i) => /chicken|beef|pork|salmon|shrimp|turkey|bacon/.test(i))} until golden and cooked through, about 6–8 minutes.`
      : `Sauté the aromatics until fragrant, about 2 minutes.`,
    `Add the remaining ingredients and stir to combine, seasoning with salt and pepper to taste.`,
    `Simmer for a few minutes until everything is tender and the flavors meld.`,
    `Plate up, garnish, and serve while hot. Enjoy your ${recipe.title}!`,
  ];
}

function buildDescription(recipe: Recipe): string {
  return `A delicious ${recipe.difficulty.toLowerCase()} ${recipe.title.toLowerCase()} recipe ready in ${recipe.time}, perfect for ${recipe.servings} ${recipe.servings === 1 ? "person" : "people"}. Made with simple, wholesome ingredients you likely already have on hand.`;
}

export function getRecipeDetail(id: string): RecipeDetail | null {
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) return null;
  const text = `${recipe.title} ${recipe.ingredients.join(" ")}`;
  const cookTime = parseTimeMin(recipe.time);
  const prepTime = Math.max(5, Math.round(cookTime * 0.4));
  return {
    ...recipe,
    description: buildDescription(recipe),
    cuisine: pickFromMap(text, CUISINE_BY_KEYWORD, "World"),
    category: pickFromMap(text, CATEGORY_BY_KEYWORD, "Main Course"),
    prep_time: prepTime,
    cook_time: cookTime,
    instructions: buildInstructions(recipe),
    nutrition: estimateNutrition(recipe),
    tags: [recipe.difficulty, ...recipe.ingredients.slice(0, 3)],
  };
}
