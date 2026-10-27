import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { FALLBACK_LISTINGS, Listing } from "@/lib/api";
import { autoCorrectQuery } from "@/lib/autocorrect";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchListingsPool(): Promise<Listing[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`${API_BASE}/listings/`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Graceful fallback to rich campus listings pool
  }
  return FALLBACK_LISTINGS;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQ = (searchParams.get("q") || "").trim();
  const isExact = searchParams.get("exact") === "1";

  if (!rawQ) {
    return NextResponse.json({ results: [], query: "" });
  }

  // Automatic spell correction
  const autoCorrect = isExact
    ? { hasCorrection: false, correctedQuery: rawQ, corrections: [], explanation: null }
    : autoCorrectQuery(rawQ);

  const q = autoCorrect.hasCorrection ? autoCorrect.correctedQuery : rawQ;

  const listings = await fetchListingsPool();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      // Prepare concise listing catalog for Gemini semantic analysis
      const catalogSummary = listings.map((l) => ({
        id: l.id,
        title: l.title,
        category: l.category,
        price: Number(l.price) || 0,
        description: l.description,
      }));

      const prompt = `You are the AI Search Engine for "The Corner", a university student marketplace.
A student typed the following search query: "${q}"

Here is the current catalog of available listings:
${JSON.stringify(catalogSummary, null, 2)}

Task:
1. Understand the user's semantic intent (meaning, synonyms, price constraints, target categories, use cases).
   For example: "something warm for winter" means warm clothing/jackets/heaters; "cheap calculator for engineering" means scientific calculator under low price.
2. Select and rank the listing IDs that match the user's intent from most relevant to least relevant.
3. If no listings match, return an empty list of matched_ids.
4. Provide a brief 1-sentence user-friendly explanation of what you searched for (e.g. "Showing winter clothing and jackets").

Respond ONLY in valid JSON with this exact structure:
{
  "explanation": "string",
  "category_filter": "string or null",
  "max_price": number or null,
  "matched_ids": [number]
}`;

      const response = await ai.interactions.create({
        model: "gemini-3.8-flash",
        input: prompt,
      });

      const outputText = response.output_text || "{}";
      const cleanJson = outputText.replace(/```json\n?|\n?```/g, "").trim();
      const parsed = JSON.parse(cleanJson);

      const matchedIds: number[] = Array.isArray(parsed.matched_ids) ? parsed.matched_ids : [];
      
      // Order listings according to Gemini relevance ranking
      const orderedListings: Listing[] = [];
      const listingMap = new Map(listings.map((item) => [item.id, item]));

      for (const id of matchedIds) {
        const item = listingMap.get(id);
        if (item) {
          orderedListings.push(item);
        }
      }

      return NextResponse.json({
        query: rawQ,
        effectiveQuery: q,
        autoCorrected: autoCorrect.hasCorrection,
        corrections: autoCorrect.corrections,
        results: orderedListings,
        explanation: autoCorrect.hasCorrection
          ? `${autoCorrect.explanation} • ${parsed.explanation || "Showing relevant listings"}`
          : parsed.explanation || null,
        intent: {
          category: parsed.category_filter || null,
          max_price: parsed.max_price || null,
        },
        mode: "gemini-nlp",
      });
    } catch (geminiError) {
      console.warn("Gemini NLP search failed, using fallback ranking:", geminiError);
    }
  }

  // Heuristic NLP fallback when no API key is provided
  const lowerQ = q.toLowerCase();
  
  // Extract price constraints (e.g. "under $250", "< 30", "below $15")
  const priceMatch = lowerQ.match(/(?:under|below|less than|<\s*|\$)\s*(\d+)/i);
  const maxPrice = priceMatch ? parseFloat(priceMatch[1]) : null;

  const words = lowerQ
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["the", "for", "and", "with", "under", "something"].includes(w));

  const scoredListings = listings
    .map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category.toLowerCase();
      const itemPrice = parseFloat(item.price) || 0;

      // Price filter check
      if (maxPrice !== null) {
        if (itemPrice <= maxPrice) score += 5;
        else score -= 10;
      }

      // Keyword matching
      for (const word of words) {
        if (titleLower.includes(word)) score += 10;
        if (catLower.includes(word)) score += 6;
        if (descLower.includes(word)) score += 3;
      }

      // Semantic concept expansions
      if (lowerQ.includes("warm") || lowerQ.includes("winter") || lowerQ.includes("cold")) {
        if (catLower === "clothing" || descLower.includes("fleece") || descLower.includes("jacket") || descLower.includes("bomber")) {
          score += 15;
        }
      }
      if (lowerQ.includes("calculator") || lowerQ.includes("engineering") || lowerQ.includes("math")) {
        if (titleLower.includes("calculator") || titleLower.includes("casio")) score += 15;
      }
      if (lowerQ.includes("laptop") || lowerQ.includes("computer") || lowerQ.includes("pc")) {
        if (titleLower.includes("thinkpad") || titleLower.includes("laptop")) score += 15;
      }
      if (lowerQ.includes("law") || lowerQ.includes("legal") || lowerQ.includes("madhuku")) {
        if (titleLower.includes("law") || descLower.includes("law")) score += 15;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);

  return NextResponse.json({
    query: rawQ,
    effectiveQuery: q,
    autoCorrected: autoCorrect.hasCorrection,
    corrections: autoCorrect.corrections,
    results: scoredListings,
    explanation: autoCorrect.hasCorrection
      ? `${autoCorrect.explanation} • ${maxPrice ? `Showing items under $${maxPrice}` : `Matching keywords`}`
      : maxPrice
      ? `Showing items under $${maxPrice}`
      : `Matching keywords for "${q}"`,
    mode: "heuristic-nlp",
  });
}
