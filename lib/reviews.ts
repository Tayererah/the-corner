export interface Review {
  id: string;
  seller_username: string;
  listing_id?: number;
  author_name: string;
  rating: number; // 1 to 5
  comment: string;
  tags?: string[];
  sentiment?: "positive" | "neutral" | "negative";
  created_at: string;
}

export interface ReviewInsights {
  seller_username: string;
  average_rating: number;
  total_reviews: number;
  ai_summary: string;
  highlights: string[];
  sentiment_score: number; // e.g., 95% positive
  trust_level: "Verified Elite" | "Top Student Seller" | "Trusted Peer" | "New Seller";
}

export const INITIAL_REVIEWS: Record<string, Review[]> = {
  tinashe_m: [
    {
      id: "rev-1",
      seller_username: "tinashe_m",
      listing_id: 1,
      author_name: "Tendai K.",
      rating: 5,
      comment: "Met at Mashava campus library quad. Calculator was in mint condition with fresh batteries as described. Super smooth trade!",
      tags: ["Mint Condition", "Fast Meetup", "Honest Seller"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rev-2",
      seller_username: "tinashe_m",
      listing_id: 1,
      author_name: "Blessing M.",
      rating: 5,
      comment: "Replied on WhatsApp in under 5 minutes and waited for me to test the calculator keys. 100% recommended for engineering gear.",
      tags: ["Fast Replies", "Punctual", "Legit"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rev-3",
      seller_username: "tinashe_m",
      listing_id: 1,
      author_name: "Panashe G.",
      rating: 4,
      comment: "Good seller. Arrived a couple of minutes late due to lectures, but the item was exactly what was shown in photos.",
      tags: ["Accurate Photos", "Fair Price"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  kudzai_law: [
    {
      id: "rev-4",
      seller_username: "kudzai_law",
      listing_id: 2,
      author_name: "Tariro C.",
      rating: 5,
      comment: "The Madhuku Law textbook was super clean with neat summaries. Saved me over $30 compared to new bookstore copies.",
      tags: ["Clean Book", "Great Deal", "Great Notes"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "rev-5",
      seller_username: "kudzai_law",
      listing_id: 2,
      author_name: "Simba N.",
      rating: 5,
      comment: "Easy pickup outside the Law Faculty. Kudzai even shared his past exam study pointers. A+ peer!",
      tags: ["Helpful Advice", "Easy Pickup", "Fast Responder"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  nyasha_v: [
    {
      id: "rev-6",
      seller_username: "nyasha_v",
      listing_id: 3,
      author_name: "Ruvimbo D.",
      rating: 5,
      comment: "Varsity bomber jacket was fresh, smelled clean and fits true to size M. Very polite student seller.",
      tags: ["Clean Item", "True to Size", "Friendly"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  tatenda_prints: [
    {
      id: "rev-7",
      seller_username: "tatenda_prints",
      listing_id: 4,
      author_name: "Farai T.",
      rating: 5,
      comment: "Printed my whole 60-page dissertation with neat spiral binding in 20 minutes right at Chitepo Hall. Lifesaver before deadline.",
      tags: ["Ultra Fast", "Top Quality Print", "On-Campus Delivery"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  farai_cs: [
    {
      id: "rev-8",
      seller_username: "farai_cs",
      listing_id: 5,
      author_name: "Kuda B.",
      rating: 5,
      comment: "ThinkPad battery health is solid 6 hours as promised. Ran diagnostics together before paying. Very transparent.",
      tags: ["Transparent", "Tested Working", "Tech Pro"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  chipo_books: [
    {
      id: "rev-9",
      seller_username: "chipo_books",
      listing_id: 2,
      author_name: "Ruva S.",
      rating: 4,
      comment: "Good condition for accounting textbook, minor pen notes in chapter 3 but very usable. Met right after commerce lecture.",
      tags: ["Fair Price", "Good Condition", "Lecture Meetup"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  tariro_tech: [
    {
      id: "rev-10",
      seller_username: "tariro_tech",
      listing_id: 5,
      author_name: "Kelvin M.",
      rating: 3,
      comment: "Phone screen replacement works fine and touch is responsive, though meetup was delayed by 25 minutes at Chitepo Hall.",
      tags: ["Working Item", "Delayed Meetup"],
      sentiment: "neutral",
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
  munashe_dorm: [
    {
      id: "rev-11",
      seller_username: "munashe_dorm",
      listing_id: 1,
      author_name: "Anesu Z.",
      rating: 5,
      comment: "Study desk lamp works well and came with an extra LED bulb. Safe meetup near student administration quad.",
      tags: ["Safe Meetup", "Tested Working", "Bonus Item"],
      sentiment: "positive",
      created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

export interface CampusReviewsSummary {
  total_reviews: number;
  average_rating: number;
  sentiment_score: number;
  sentiment_counts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentiment_percentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  aspects: {
    name: string;
    score: number;
    description: string;
    status: string;
  }[];
  ai_executive_summary: string;
  top_tags: { tag: string; count: number }[];
  seller_summaries: {
    seller_username: string;
    review_count: number;
    average_rating: number;
    sentiment_score: number;
    trust_level: "Verified Elite" | "Top Student Seller" | "Trusted Peer" | "New Seller";
    recent_comment: string;
  }[];
  all_reviews: Review[];
}

export function computeLocalCampusSummary(): CampusReviewsSummary {
  const allReviews: Review[] = Object.values(INITIAL_REVIEWS).flat();
  const total = allReviews.length;

  let pos = 0;
  let neu = 0;
  let neg = 0;
  let sumRating = 0;
  const tagCounts: Record<string, number> = {};

  for (const r of allReviews) {
    sumRating += r.rating;
    const sent = r.sentiment || (r.rating >= 4 ? "positive" : r.rating === 3 ? "neutral" : "negative");
    if (sent === "positive") pos++;
    else if (sent === "neutral") neu++;
    else neg++;

    if (r.tags) {
      for (const t of r.tags) {
        tagCounts[t] = (tagCounts[t] || 0) + 1;
      }
    }
  }

  const avgRating = total > 0 ? Number((sumRating / total).toFixed(2)) : 5.0;
  const posPct = total > 0 ? Math.round((pos / total) * 100) : 100;
  const neuPct = total > 0 ? Math.round((neu / total) * 100) : 0;
  const negPct = total > 0 ? Math.round((neg / total) * 100) : 0;

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const sellerSummaries = Object.entries(INITIAL_REVIEWS).map(([seller, revs]) => {
    const sTotal = revs.length;
    const sAvg = sTotal > 0 ? Number((revs.reduce((a, b) => a + b.rating, 0) / sTotal).toFixed(1)) : 5.0;
    const sPos = revs.filter((r) => (r.sentiment || "positive") === "positive").length;
    const sScore = sTotal > 0 ? Math.round((sPos / sTotal) * 100) : 100;
    const trust: "Verified Elite" | "Top Student Seller" | "Trusted Peer" | "New Seller" =
      sTotal >= 3 ? "Verified Elite" : sTotal >= 2 ? "Top Student Seller" : sTotal >= 1 ? "Trusted Peer" : "New Seller";

    return {
      seller_username: seller,
      review_count: sTotal,
      average_rating: sAvg,
      sentiment_score: sScore,
      trust_level: trust,
      recent_comment: revs[0]?.comment || "Active campus seller.",
    };
  });

  return {
    total_reviews: total,
    average_rating: avgRating,
    sentiment_score: posPct,
    sentiment_counts: { positive: pos, neutral: neu, negative: neg },
    sentiment_percentages: { positive: posPct, neutral: neuPct, negative: negPct },
    aspects: [
      {
        name: "Punctuality & Meetup Zones",
        score: 98,
        description: "Students adhere to library quad and campus hall designated exchange points.",
        status: "Exceptional",
      },
      {
        name: "Item Accuracy & Condition",
        score: 95,
        description: "Textbook notes, calculator batteries, and electronics match uploaded listings.",
        status: "High Fidelity",
      },
      {
        name: "Student Pricing & Fairness",
        score: 97,
        description: "Significant discounts compared to retail bookshops and commercial stores.",
        status: "High Value",
      },
      {
        name: "WhatsApp Communication Speed",
        score: 94,
        description: "Average first response time within 5-15 minutes between lectures.",
        status: "Prompt",
      },
    ],
    ai_executive_summary:
      "Campus-wide sentiment is overwhelmingly positive (91% satisfaction). Reviews highlight rapid WhatsApp response times, transparent item condition checks (such as running laptop diagnostics prior to cash exchange), and safe on-campus handover zones at Mashava, Mucheke, and Main Quad.",
    top_tags: topTags,
    seller_summaries: sellerSummaries,
    all_reviews: allReviews,
  };
}

export async function fetchCampusReviewsSummary(): Promise<CampusReviewsSummary> {
  try {
    const res = await fetch(`/api/reviews?seller=all`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data.summary) {
        return data.summary;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch campus reviews summary from API, using fallback:", err);
  }
  return computeLocalCampusSummary();
}

export async function fetchSellerReviews(sellerUsername: string): Promise<{
  reviews: Review[];
  insights: ReviewInsights;
}> {
  try {
    const res = await fetch(`/api/reviews?seller=${encodeURIComponent(sellerUsername)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn("Failed to fetch reviews from API, using fallback:", err);
  }

  // Fallback calculations
  const sellerReviews = INITIAL_REVIEWS[sellerUsername] || [];
  const total = sellerReviews.length;
  const avg = total > 0 ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / total : 5.0;

  return {
    reviews: sellerReviews,
    insights: {
      seller_username: sellerUsername,
      average_rating: Number(avg.toFixed(1)),
      total_reviews: total,
      ai_summary:
        total > 0
          ? `Verified peer reviews highlight prompt communication, fair student pricing, and safe on-campus meetups.`
          : `New verified student seller on campus. Transactions are protected by Campus Safe Trade Protocol.`,
      highlights: ["Punctual Meetups", "Accurate Listing Details", "Fast WhatsApp Replies"],
      sentiment_score: 98,
      trust_level: total > 2 ? "Top Student Seller" : total > 0 ? "Trusted Peer" : "New Seller",
    },
  };
}

export async function postReview(payload: {
  seller_username: string;
  author_name: string;
  rating: number;
  comment: string;
  listing_id?: number;
  tags?: string[];
}): Promise<{ success: boolean; review?: Review; error?: string }> {
  try {
    const res = await fetch(`/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || "Failed to submit review" };
    }
    return { success: true, review: data.review };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Network error" };
  }
}
