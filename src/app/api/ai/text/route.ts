import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, parseAIResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description } = body;

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "description is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { error: "description must be 500 characters or less" },
        { status: 400 }
      );
    }

    const model = getGeminiModel();
    const result = await model.generateContent(description.trim());
    const text = result.response.text();
    const analysis = parseAIResponse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("AI text analysis error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze food description" },
      { status: 500 }
    );
  }
}
