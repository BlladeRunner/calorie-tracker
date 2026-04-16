import {
  GoogleGenerativeAI,
  type GenerativeModel,
} from "@google/generative-ai";
import type { Food } from "@/db/foods";

export type AIFood = Omit<Food, "id">;

export interface AIAnalysisResult {
  foods: AIFood[];
}

const SYSTEM_PROMPT = `You are a nutrition analysis assistant. Analyze the food described or shown and return ONLY a JSON object with a "foods" array. Each element must have exactly these fields:
- "name": string (specific food name, e.g. "Grilled Chicken Breast")
- "calories": number (kcal, rounded to nearest integer)
- "protein": number (grams, one decimal place)
- "carbs": number (grams, one decimal place)
- "fat": number (grams, one decimal place)
- "servingSize": string (e.g. "100g", "1 cup", "1 medium")

Identify each distinct food item separately. Estimate reasonable portion sizes. Use standard USDA-style nutritional values. If you cannot identify a food, make your best estimate and note it in the name.

Example output:
{"foods":[{"name":"Grilled Chicken Breast","calories":165,"protein":31.0,"carbs":0.0,"fat":3.6,"servingSize":"100g"}]}`;

let model: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (model) return model;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  return model;
}

export function getGeminiModel(): GenerativeModel {
  return getModel();
}

export function parseAIResponse(raw: string): AIAnalysisResult {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  if (!parsed.foods || !Array.isArray(parsed.foods)) {
    throw new Error("Response missing 'foods' array");
  }

  const foods: AIFood[] = parsed.foods.map(
    (item: Record<string, unknown>) => ({
      name: String(item.name ?? "Unknown Food"),
      calories: Math.round(Number(item.calories) || 0),
      protein: Number(Number(item.protein || 0).toFixed(1)),
      carbs: Number(Number(item.carbs || 0).toFixed(1)),
      fat: Number(Number(item.fat || 0).toFixed(1)),
      servingSize: String(item.servingSize ?? "1 serving"),
    })
  );

  return { foods };
}
