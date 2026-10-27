/**
 * The Corner — Predictive Typing & Autocomplete Engine
 * 
 * Provides:
 * 1. Inline Ghost Autocomplete (Tab-to-complete like GitHub Copilot / Google Search)
 * 2. Instant Query Predictions with intent categorization
 * 3. Quick Category and Live Listing matching
 */

import { autoCorrectQuery, AutoCorrectResult } from "./autocorrect";
import { Listing, FALLBACK_LISTINGS } from "./api";

export interface PredictiveSuggestion {
  id: string;
  text: string;
  category?: string;
  type: "query" | "category" | "correction" | "course";
  subtitle?: string;
  iconType?: "search" | "sparkles" | "tag" | "book" | "laptop";
}

export interface PredictiveResult {
  query: string;
  ghostCompletion: {
    fullText: string;
    suffix: string; // the string to render right after the cursor
  } | null;
  autoCorrect: AutoCorrectResult;
  suggestions: PredictiveSuggestion[];
  instantMatches: {
    id: number;
    title: string;
    price: string;
    category: string;
    image?: string;
  }[];
}

// High-frequency curated campus queries and intents
export const POPULAR_CAMPUS_QUERIES: { text: string; category: string; type: "query" | "course" }[] = [
  // Textbooks & Academics
  { text: "calculus 8th edition stewart", category: "Textbooks", type: "query" },
  { text: "commercial law in zimbabwe madhuku", category: "Textbooks", type: "query" },
  { text: "financial accounting 6th edition", category: "Textbooks", type: "query" },
  { text: "past exam questions and summaries", category: "Textbooks", type: "query" },
  { text: "math 201 linear algebra notes", category: "Textbooks", type: "course" },
  { text: "economics for south african students", category: "Textbooks", type: "query" },
  { text: "chemistry lab coat and goggles", category: "Textbooks", type: "query" },

  // Electronics
  { text: "cheap calculator for engineering", category: "Electronics", type: "query" },
  { text: "casio fx-991ex classwiz calculator", category: "Electronics", type: "query" },
  { text: "laptop under $250", category: "Electronics", type: "query" },
  { text: "lenovo thinkpad core i5", category: "Electronics", type: "query" },
  { text: "dorm room mini bar fridge", category: "Electronics", type: "query" },
  { text: "apple airpods pro noise cancelling", category: "Electronics", type: "query" },
  { text: "usb-c fast charger adapter cable", category: "Electronics", type: "query" },
  { text: "bluetooth rechargeable wireless mouse", category: "Electronics", type: "query" },
  { text: "dorm study desk led lamp", category: "Electronics", type: "query" },

  // Clothing
  { text: "something warm for winter", category: "Clothing", type: "query" },
  { text: "gzu varsity heritage bomber jacket", category: "Clothing", type: "query" },
  { text: "vintage oversized fleece hoodie", category: "Clothing", type: "query" },
  { text: "nike air force 1 white sneakers", category: "Clothing", type: "query" },
  { text: "chunky knit winter sweater", category: "Clothing", type: "query" },

  // Services
  { text: "statistics and probability tutoring", category: "Services", type: "query" },
  { text: "professional knotless hair braiding", category: "Services", type: "query" },
  { text: "room cleaning and hostel laundry", category: "Services", type: "query" },
  { text: "assignment proofreading and formatting", category: "Services", type: "query" },
  { text: "laptop screen repair and os install", category: "Services", type: "query" },
];

/**
 * Calculates the best inline ghost text (Tab-to-complete)
 */
export function getGhostCompletion(input: string): { fullText: string; suffix: string } | null {
  const clean = input.trim();
  if (clean.length < 2) return null;

  const lower = clean.toLowerCase();

  // 1. Check popular campus queries starting with the input
  for (const item of POPULAR_CAMPUS_QUERIES) {
    const itemLower = item.text.toLowerCase();
    if (itemLower.startsWith(lower) && itemLower !== lower) {
      return {
        fullText: item.text,
        suffix: item.text.slice(clean.length),
      };
    }
  }

  // 2. Check if a word within popular queries starts with the current last token
  const tokens = clean.split(/\s+/);
  const lastToken = tokens[tokens.length - 1].toLowerCase();

  if (lastToken.length >= 2) {
    for (const item of POPULAR_CAMPUS_QUERIES) {
      const phraseWords = item.text.toLowerCase().split(/\s+/);
      const matchIndex = phraseWords.findIndex((w) => w.startsWith(lastToken));
      if (matchIndex !== -1) {
        // Complete the remainder of this phrase
        const prefixWords = tokens.slice(0, tokens.length - 1);
        const completionWords = phraseWords.slice(matchIndex);
        
        // Merge
        const completionLastWord = completionWords[0].slice(lastToken.length);
        const restOfPhrase = completionWords.slice(1).join(" ");
        const suffix = completionLastWord + (restOfPhrase ? " " + restOfPhrase : "");

        const fullText = (prefixWords.length ? prefixWords.join(" ") + " " : "") +
          tokens[tokens.length - 1] + suffix;

        return {
          fullText,
          suffix,
        };
      }
    }
  }

  return null;
}

/**
 * Generates rich predictive typing suggestions for the search input
 */
export function getPredictiveTypingData(
  rawInput: string,
  listingsPool: Listing[] = FALLBACK_LISTINGS
): PredictiveResult {
  const query = rawInput;
  const trimmed = rawInput.trim();

  // If query is empty, return top trending campus suggestions
  if (!trimmed) {
    return {
      query: "",
      ghostCompletion: null,
      autoCorrect: {
        originalQuery: "",
        correctedQuery: "",
        hasCorrection: false,
        corrections: [],
        explanation: null,
      },
      suggestions: POPULAR_CAMPUS_QUERIES.slice(0, 5).map((q) => ({
        id: `pop-${q.text}`,
        text: q.text,
        category: q.category,
        type: q.type,
        subtitle: `Popular in ${q.category}`,
        iconType: q.category === "Textbooks" ? "book" : q.category === "Electronics" ? "laptop" : "sparkles",
      })),
      instantMatches: [],
    };
  }

  // 1. Ghost Completion
  const ghost = getGhostCompletion(trimmed);

  // 2. Spell check / Auto-correction
  const autoCorrect = autoCorrectQuery(trimmed);

  // 3. Formulate Suggestions List
  const suggestions: PredictiveSuggestion[] = [];
  const lowerQuery = trimmed.toLowerCase();

  // A. If typo detected, inject "Did you mean" as first priority suggestion
  if (autoCorrect.hasCorrection && autoCorrect.correctedQuery.toLowerCase() !== lowerQuery) {
    suggestions.push({
      id: "autocorrect-primary",
      text: autoCorrect.correctedQuery,
      type: "correction",
      subtitle: autoCorrect.explanation || "Corrected spelling",
      iconType: "sparkles",
    });
  }

  // B. Query matching from popular campus queries
  for (const item of POPULAR_CAMPUS_QUERIES) {
    const itemLower = item.text.toLowerCase();
    if (itemLower.includes(lowerQuery) || (autoCorrect.hasCorrection && itemLower.includes(autoCorrect.correctedQuery.toLowerCase()))) {
      if (!suggestions.some((s) => s.text.toLowerCase() === itemLower)) {
        suggestions.push({
          id: `query-${item.text}`,
          text: item.text,
          category: item.category,
          type: item.type,
          subtitle: `In ${item.category}`,
          iconType: "search",
        });
      }
    }
    if (suggestions.length >= 6) break;
  }

  // C. Category Suggestions (e.g. typing "elec" or "text")
  const categories = ["Textbooks", "Electronics", "Clothing", "Services"];
  for (const cat of categories) {
    if (cat.toLowerCase().startsWith(lowerQuery) || lowerQuery.includes(cat.toLowerCase())) {
      suggestions.push({
        id: `cat-${cat}`,
        text: `Browse all in ${cat}`,
        category: cat,
        type: "category",
        subtitle: "Jump to category catalog",
        iconType: "tag",
      });
    }
  }

  // 4. Instant Live Item Matches (Top 3)
  const effectiveQuery = autoCorrect.hasCorrection ? autoCorrect.correctedQuery.toLowerCase() : lowerQuery;
  const queryWords = effectiveQuery.split(/\s+/).filter((w) => w.length >= 2);

  const instantMatches = listingsPool
    .map((item) => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const catLower = item.category.toLowerCase();

      if (titleLower.startsWith(effectiveQuery)) score += 30;
      else if (titleLower.includes(effectiveQuery)) score += 20;

      for (const word of queryWords) {
        if (titleLower.includes(word)) score += 10;
        if (catLower.includes(word)) score += 5;
        if (descLower.includes(word)) score += 2;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ item }) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      image: item.images?.[0]?.image_url,
    }));

  return {
    query: rawInput,
    ghostCompletion: ghost,
    autoCorrect,
    suggestions: suggestions.slice(0, 6),
    instantMatches,
  };
}
