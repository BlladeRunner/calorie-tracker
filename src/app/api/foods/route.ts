export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import { FOODS } from "@/db/foods";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() ?? "";

  if (!q) {
    return NextResponse.json(FOODS);
  }

  const filtered = FOODS.filter((food) =>
    food.name.toLowerCase().includes(q)
  );

  return NextResponse.json(filtered);
}
