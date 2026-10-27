import { authFetch } from "./auth";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

export type Listing = {
  id: number;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: string;
  hall_location: string;
  seller_username: string;
  seller_phone?: string;
  status: string;
  created_at: string;
  images: { id: number; image_url: string; sort_order: number }[];
};

export const FALLBACK_LISTINGS: Listing[] = [
  {
    id: 1,
    title: "Casio fx-991EX ClassWiz Scientific Calculator",
    description: "High-spec scientific calculator essential for Engineering, Physics, and Statistics exams. Mint condition with original protective slide-on cover. Battery recently replaced.",
    category: "Electronics",
    condition: "Like New",
    price: "25",
    hall_location: "Mashava Campus",
    seller_username: "tinashe_m",
    seller_phone: "+263771234567",
    status: "active",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 101, image_url: "/images/cat-electronics.jpg", sort_order: 1 },
    ],
  },
  {
    id: 2,
    title: "Commercial Law in Zimbabwe (Lovemore Madhuku)",
    description: "Prescribed textbook for Commercial Law and LLB students. No missing pages, includes clean highlighting on key case studies and legal principles.",
    category: "Textbooks",
    condition: "Good",
    price: "18",
    hall_location: "Main Campus Quad",
    seller_username: "kudzai_law",
    seller_phone: "+263772345678",
    status: "active",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 102, image_url: "/images/hero-student.jpg", sort_order: 1 },
    ],
  },
  {
    id: 3,
    title: "GZU Varsity Heritage Bomber Jacket (Size M)",
    description: "Official navy and gold campus bomber jacket with embroidered crest. Worn twice during winter semester, pristine condition. Warm fleece lining.",
    category: "Clothing",
    condition: "Like New",
    price: "35",
    hall_location: "Mucheke Campus",
    seller_username: "nyasha_v",
    seller_phone: "+263773456789",
    status: "active",
    created_at: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 103, image_url: "/images/cat-clothing.jpg", sort_order: 1 },
    ],
  },
  {
    id: 4,
    title: "Fast Dorm Printing, Binding & Document Scanning",
    description: "Full laser printing service right inside campus halls. Double-sided notes, dissertation binding, and past exam packs delivered in 30 minutes.",
    category: "Services",
    condition: "Service",
    price: "2",
    hall_location: "Herbert Chitepo Hall",
    seller_username: "tatenda_prints",
    seller_phone: "+263774567890",
    status: "active",
    created_at: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 104, image_url: "/images/cat-services.jpg", sort_order: 1 },
    ],
  },
  {
    id: 5,
    title: "Lenovo ThinkPad T480 (Core i5, 16GB RAM, 512GB SSD)",
    description: "Reliable student workhorse laptop with dual batteries. Excellent battery health (6+ hours of typing/research), backlit keyboard, licensed Windows 11 Pro.",
    category: "Electronics",
    condition: "Good",
    price: "210",
    hall_location: "Mashava Campus",
    seller_username: "farai_cs",
    seller_phone: "+263775678901",
    status: "active",
    created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 105, image_url: "/images/cat-electronics.jpg", sort_order: 1 },
    ],
  },
  {
    id: 6,
    title: "Financial Accounting: An Introduction (6th Edition)",
    description: "Core textbook for B.Com Accounting & Finance. In mint condition, includes digital access code card intact and worked problem summaries.",
    category: "Textbooks",
    condition: "Brand New",
    price: "22",
    hall_location: "Main Campus Library",
    seller_username: "chipo_bcom",
    seller_phone: "+263776789012",
    status: "active",
    created_at: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 106, image_url: "/images/hero-student.jpg", sort_order: 1 },
    ],
  },
  {
    id: 7,
    title: "Room Mini Bar Fridge (90L Defy with Freezer Box)",
    description: "Silent compressor dorm fridge, fits perfectly under study desk. Keeps drinks icy cold and has a top freezer compartment for meal prep. Ready for immediate pickup.",
    category: "Electronics",
    condition: "Good",
    price: "95",
    hall_location: "Mashava Complex",
    seller_username: "simba_gzu",
    seller_phone: "+263777890123",
    status: "active",
    created_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 107, image_url: "/images/cat-electronics.jpg", sort_order: 1 },
    ],
  },
  {
    id: 8,
    title: "Professional Hair Braiding & Knotless Box Braids",
    description: "Skilled campus stylist offering neat knotless braids, twists, and loc maintenance at student-friendly rates. Book appointments between lectures.",
    category: "Services",
    condition: "Service",
    price: "15",
    hall_location: "Mucheke Hall Block B",
    seller_username: "ruva_beauty",
    seller_phone: "+263778901234",
    status: "active",
    created_at: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
    images: [
      { id: 108, image_url: "/images/cat-services.jpg", sort_order: 1 },
    ],
  },
];

export async function getListings(): Promise<Listing[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${API_BASE}/listings/`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return FALLBACK_LISTINGS;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_LISTINGS;
  } catch {
    // Graceful fallback to rich campus listings when backend is offline
    return FALLBACK_LISTINGS;
  }
}

export async function getListingById(id: number): Promise<Listing | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1800);

    const res = await fetch(`${API_BASE}/listings/${id}/`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return res.json();
    }
  } catch {
    // Continue to fallback lookup
  }

  const found = FALLBACK_LISTINGS.find((item) => item.id === id);
  return found || null;
}

export async function getListing(id: string): Promise<Listing> {
  const res = await fetch(`${API_BASE}/listings/${id}/`, { cache: "no-store" });
  if (!res.ok) throw new Error("Listing not found");
  return res.json();
}

export interface SearchResponse {
  results: Listing[];
  explanation?: string | null;
  query?: string;
  effectiveQuery?: string;
  autoCorrected?: boolean;
  corrections?: { original: string; replacement: string }[];
  mode?: string;
}

export async function searchListings(
  query: string,
  options?: { exact?: boolean }
): Promise<SearchResponse> {
  if (!query.trim()) return { results: [] };
  const exactParam = options?.exact ? "&exact=1" : "";
  try {
    // 1. Try Next.js Gemini NLP Route Handler with auto-correction
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}${exactParam}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return {
        results: data.results || [],
        explanation: data.explanation || null,
        query: data.query || query,
        effectiveQuery: data.effectiveQuery || query,
        autoCorrected: data.autoCorrected || false,
        corrections: data.corrections || [],
        mode: data.mode,
      };
    }
  } catch {
    // Fall back to external backend if needed
  }

  try {
    const res = await fetch(`${API_BASE}/search/?q=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      return { results: data.results || [] };
    }
  } catch {
    // Return empty on failure
  }

  return { results: [] };
}

export async function suggestCategory(
  text: string,
  signal?: AbortSignal
): Promise<string | null> {
  const query = text.trim();
  if (query.length < 3) return null;

  try {
    // 1. Try Next.js Gemini AI category suggestion route
    const res = await fetch(`/api/suggest-category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: query }),
      signal,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.suggested_category) {
        return data.suggested_category;
      }
    }
  } catch (err: unknown) {
    if ((err as Error)?.name === "AbortError") {
      return null;
    }
  }

  try {
    // Fallback to external backend
    const res = await fetch(`${API_BASE}/suggest-category/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: query }),
      signal,
    });

    if (res.ok) {
      const data = await res.json();
      return data.suggested_category || null;
    }
  } catch {
    // Return null on failure
  }

  return null;
}

export async function getMyListings(token?: string): Promise<Listing[]> {
  try {
    const res = await authFetch(`${API_BASE}/my-listings/`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        if (typeof window !== "undefined") {
          localStorage.setItem("the_corner_my_listings", JSON.stringify(data));
        }
        return data;
      }
    }
  } catch {
    // fallback to local storage
  }

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("the_corner_my_listings");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    // Default initial mock seller listings for seamless testing
    const initialSellerListings = FALLBACK_LISTINGS.slice(0, 3).map((item, idx) => ({
      ...item,
      id: idx === 0 ? 1 : idx === 1 ? 2 : 3,
      seller_username: "you",
      status: idx === 2 ? "sold" : "active",
    }));
    localStorage.setItem("the_corner_my_listings", JSON.stringify(initialSellerListings));
    return initialSellerListings;
  }

  return FALLBACK_LISTINGS.slice(0, 3);
}

export async function deleteListing(
  id: number,
  token?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await authFetch(`${API_BASE}/listings/${id}/`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok || res.status === 204) {
      // Synchronize client-side storage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("the_corner_my_listings");
        if (stored) {
          try {
            const list: Listing[] = JSON.parse(stored);
            const filtered = list.filter((item) => item.id !== id);
            localStorage.setItem("the_corner_my_listings", JSON.stringify(filtered));
          } catch {}
        }
      }
      return { success: true };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.detail || "Failed to delete listing" };
  } catch (err: unknown) {
    // Fallback: delete from local storage if backend offline
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("the_corner_my_listings");
      if (stored) {
        try {
          const list: Listing[] = JSON.parse(stored);
          const filtered = list.filter((item) => item.id !== id);
          localStorage.setItem("the_corner_my_listings", JSON.stringify(filtered));
          return { success: true };
        } catch {}
      }
    }
    return { success: false, error: (err as Error)?.message || "Network error" };
  }
}

export async function updateListingStatus(
  id: number,
  status: "active" | "sold" | "hidden",
  token?: string
): Promise<{ success: boolean; listing?: Listing; error?: string }> {
  try {
    const res = await authFetch(`${API_BASE}/listings/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("the_corner_my_listings");
        if (stored) {
          try {
            const list: Listing[] = JSON.parse(stored);
            const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
            localStorage.setItem("the_corner_my_listings", JSON.stringify(updated));
          } catch {}
        }
      }
      return { success: true, listing: data };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.detail || "Failed to update listing status" };
  } catch (err: unknown) {
    // Fallback: update in local storage if backend offline
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("the_corner_my_listings");
      if (stored) {
        try {
          const list: Listing[] = JSON.parse(stored);
          const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
          localStorage.setItem("the_corner_my_listings", JSON.stringify(updated));
          return { success: true };
        } catch {}
      }
    }
    return { success: false, error: (err as Error)?.message || "Network error" };
  }
}

export type FavoriteEntry = {
  id: number;
  listing: number;
  listing_detail: Listing;
  created_at: string;
};

export async function getFavorites(token?: string): Promise<FavoriteEntry[]> {
  try {
    const res = await authFetch(`${API_BASE}/favorites/`, {
      cache: "no-store",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function addFavorite(listingId: number, token?: string) {
  return authFetch(`${API_BASE}/favorites/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ listing: listingId }),
  });
}

export async function removeFavorite(favoriteId: number, token?: string) {
  return authFetch(`${API_BASE}/favorites/${favoriteId}/`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}
