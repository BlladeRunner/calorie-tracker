import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel, parseAIResponse } from "@/lib/gemini";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "image file is required (multipart form field 'image')" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported image type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image must be 5MB or smaller" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const model = getGeminiModel();
    const result = await model.generateContent([
      "Identify all foods in this image and provide nutritional information for each.",
      {
        inlineData: {
          mimeType: file.type,
          data: base64,
        },
      },
    ]);

    const text = result.response.text();
    const analysis = parseAIResponse(text);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("AI image analysis error:", error);

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze food image" },
      { status: 500 }
    );
  }
}
