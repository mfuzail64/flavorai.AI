export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit?: string;
}

export interface RecipeNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  cuisine: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  image_url: string | null;
  image_status: "pending" | "ready" | "failed";
  tags: string[];
  ingredients: RecipeIngredient[];
  instructions: string[];
  nutrition: RecipeNutrition;
  source: string;
  created_at: string;
  matched_ingredients?: string[];
  missing_ingredients?: string[];
  match_score?: number;
}

export const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1200&auto=format&fit=crop";

export interface SearchParams {
  query?: string;
  ingredients?: string[];
  cuisine?: string;
  category?: string;
  diet?: string;
  maxCalories?: number;
  maxTime?: number;
  tag?: string;
  autofill?: boolean;
}
