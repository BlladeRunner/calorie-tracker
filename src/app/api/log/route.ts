import { NextRequest, NextResponse } from "next/server";
import { getLogByDate, addLogEntry, deleteLogEntry, findFoodById } from "@/db/store";
import type { LogEntryWithFood } from "@/lib/types";

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ error: "date parameter required" }, { status: 400 });
  }

  const entries = await getLogByDate(date);
  const entriesWithFood: LogEntryWithFood[] = (
    await Promise.all(
      entries.map(async (entry) => {
        const food = await findFoodById(entry.foodId);
        if (!food) return null;
        return { ...entry, food };
      })
    )
  ).filter((e): e is LogEntryWithFood => e !== null);

  return NextResponse.json(entriesWithFood);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { foodId, servings = 1, date, meal = "snack" } = body;

  if (!foodId || !date) {
    return NextResponse.json({ error: "foodId and date required" }, { status: 400 });
  }

  const food = await findFoodById(foodId);
  if (!food) {
    return NextResponse.json({ error: "food not found" }, { status: 404 });
  }

  const entry = await addLogEntry(foodId, servings, date, meal);
  return NextResponse.json({ ...entry, food });
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id parameter required" }, { status: 400 });
  }

  const deleted = await deleteLogEntry(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: "entry not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}