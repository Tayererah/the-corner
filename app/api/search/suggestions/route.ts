import { NextRequest, NextResponse } from "next/server";
import { getPredictiveTypingData } from "@/lib/predictiveTyping";
import { FALLBACK_LISTINGS, Listing } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchListingsPool(): Promise<Listing[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
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
    // Fall back to built-in campus catalog
  }
  return FALLBACK_LISTINGS;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const listings = await fetchListingsPool();
  const predictiveResult = getPredictiveTypingData(q, listings);

  return NextResponse.json(predictiveResult, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
    },
  });
}
