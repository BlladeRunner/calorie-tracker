export interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export const FOODS: Food[] = [
  { id: 1, name: "Chicken Breast", calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: "100g" },
  { id: 2, name: "White Rice", calories: 206, protein: 4.3, carbs: 45, fat: 0.4, servingSize: "1 cup cooked" },
  { id: 3, name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: "2 large" },
  { id: 4, name: "Banana", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, servingSize: "1 medium" },
  { id: 5, name: "Oatmeal", calories: 154, protein: 5.3, carbs: 27, fat: 2.6, servingSize: "1 cup cooked" },
  { id: 6, name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: "100g" },
  { id: 7, name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6, servingSize: "1 cup" },
  { id: 8, name: "Sweet Potato", calories: 103, protein: 2.3, carbs: 24, fat: 0.1, servingSize: "1 medium" },
  { id: 9, name: "Avocado", calories: 240, protein: 3, carbs: 13, fat: 22, servingSize: "1 whole" },
  { id: 10, name: "Almonds", calories: 164, protein: 6, carbs: 6, fat: 14, servingSize: "1 oz (23 nuts)" },
  { id: 11, name: "Greek Yogurt", calories: 100, protein: 17, carbs: 6, fat: 0.7, servingSize: "170g" },
  { id: 12, name: "Whole Milk", calories: 149, protein: 8, carbs: 12, fat: 8, servingSize: "1 cup" },
  { id: 13, name: "Whole Wheat Bread", calories: 128, protein: 5, carbs: 24, fat: 2, servingSize: "2 slices" },
  { id: 14, name: "Pasta", calories: 220, protein: 8, carbs: 43, fat: 1.3, servingSize: "1 cup cooked" },
  { id: 15, name: "Apple", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, servingSize: "1 medium" },
  { id: 16, name: "Steak (Sirloin)", calories: 271, protein: 26, carbs: 0, fat: 18, servingSize: "100g" },
  { id: 17, name: "Tofu", calories: 144, protein: 17, carbs: 3.5, fat: 8.7, servingSize: "1/2 block" },
  { id: 18, name: "Peanut Butter", calories: 188, protein: 7, carbs: 6, fat: 16, servingSize: "2 tbsp" },
  { id: 19, name: "Orange", calories: 62, protein: 1.2, carbs: 15, fat: 0.2, servingSize: "1 medium" },
  { id: 20, name: "Cheddar Cheese", calories: 113, protein: 7, carbs: 0.4, fat: 9.3, servingSize: "1 oz" },
  { id: 21, name: "Tuna (Canned)", calories: 191, protein: 42, carbs: 0, fat: 1.4, servingSize: "1 can" },
  { id: 22, name: "Quinoa", calories: 222, protein: 8, carbs: 39, fat: 3.6, servingSize: "1 cup cooked" },
  { id: 23, name: "Lentils", calories: 230, protein: 18, carbs: 40, fat: 0.8, servingSize: "1 cup cooked" },
  { id: 24, name: "Olive Oil", calories: 119, protein: 0, carbs: 0, fat: 14, servingSize: "1 tbsp" },
  { id: 25, name: "Protein Shake", calories: 120, protein: 24, carbs: 3, fat: 1.5, servingSize: "1 scoop + water" },
  { id: 26, name: "Brown Rice", calories: 216, protein: 5, carbs: 45, fat: 1.8, servingSize: "1 cup cooked" },
  { id: 27, name: "Spinach", calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, servingSize: "1 cup raw" },
  { id: 28, name: "Turkey Breast", calories: 135, protein: 30, carbs: 0, fat: 1, servingSize: "100g" },
  { id: 29, name: "Black Beans", calories: 227, protein: 15, carbs: 41, fat: 0.9, servingSize: "1 cup cooked" },
  { id: 30, name: "Cottage Cheese", calories: 206, protein: 28, carbs: 6, fat: 9, servingSize: "1 cup" },
];
