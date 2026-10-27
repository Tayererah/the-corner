import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const CATEGORIES = ["Electronics", "Textbooks", "Clothing", "Services", "Housing", "General"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = (body.text || "").trim();

    if (!text || text.length < 3) {
      return NextResponse.json({ suggested_category: null });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Classify this marketplace listing title/description into exactly one category from: ${CATEGORIES.join(", ")}.
Item description: "${text}"
Respond with ONLY the exact category name.`;

        const response = await ai.interactions.create({
          model: "gemini-3.8-flash",
          input: prompt,
        });

        const rawCategory = (response.output_text || "").trim();
        const matched = CATEGORIES.find(
          (c) => c.toLowerCase() === rawCategory.toLowerCase()
        );

        if (matched) {
          return NextResponse.json({ suggested_category: matched });
        }
      } catch (geminiError) {
        console.warn("Gemini category suggestion failed, using fallback:", geminiError);
      }
    }

    // Heuristic fallback if Gemini API key is not provided or fails
    const lower = text.toLowerCase();
    if (/(laptop|phone|charger|calc|fridge|gadget|screen|macbook|thinkpad|casio|audio|headphone|earbud)/i.test(lower)) {
      return NextResponse.json({ suggested_category: "Electronics" });
    }
    if (/(book|textbook|notes|law|accounting|madhuku|exam|paper|study|bcom|module)/i.test(lower)) {
      return NextResponse.json({ suggested_category: "Textbooks" });
    }
    if (/(jacket|hoodie|shirt|shoes|kicks|bomber|dress|pants|clothes|wear|sweater|size)/i.test(lower)) {
      return NextResponse.json({ suggested_category: "Clothing" });
    }
    if (/(print|hair|braid|tutor|repair|clean|service|lesson|binding|scan)/i.test(lower)) {
      return NextResponse.json({ suggested_category: "Services" });
    }
    if (/(room|rent|apartment|hostel|dorm|lodge)/i.test(lower)) {
      return NextResponse.json({ suggested_category: "Housing" });
    }

    return NextResponse.json({ suggested_category: "General" });
  } catch (error) {
    console.error("Error in /api/suggest-category:", error);
    return NextResponse.json({ error: "Failed to suggest category" }, { status: 500 });
  }
}
