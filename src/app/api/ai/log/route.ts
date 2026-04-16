import { NextRequest, NextResponse } from "next/server";
import { addCustomFood, addLogEntry } from "@/db/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { food, servings = 1, date, meal = "snack" } = body;

    if (!food || !date) {
      return NextResponse.json(
        { error: "food and date are required" },
        { status: 400 }
      );
    }

    if (!food.name || food.calories == null) {
      return NextResponse.json(
        { error: "food must have at least name and calories" },
        { status: 400 }
      );
    }

    const savedFood = await addCustomFood({
      name: String(food.name),
      calories: Number(food.calories) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      servingSize: String(food.servingSize ?? "1 serving"),
    });

    const entry = await addLogEntry(savedFood.id, servings, date, meal);
    return NextResponse.json({ ...entry, food: savedFood });
  } catch (error) {
    console.error("AI log error:", error);
    return NextResponse.json(
      { error: "Failed to log AI food" },
      { status: 500 }
    );
  }
}