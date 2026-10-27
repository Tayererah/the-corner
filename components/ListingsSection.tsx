"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Listing, getFavorites } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import ListingCard from "./ListingCard";
import PredictiveSearchBar from "./PredictiveSearchBar";
import { autoCorrectQuery } from "@/lib/autocorrect";
import { Search, SlidersHorizontal, RotateCcw, Sparkles } from "lucide-react";

interface ListingsSectionProps {
  initialListings: Listing[];
}

const CATEGORIES = ["All", "Textbooks", "Electronics", "Clothing", "Services"];
const LOCATIONS = ["All Locations", "Mashava Campus", "Main Campus", "Mucheke", "Herbert Chitepo"];
const SORTS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

export default function ListingsSection({ initialListings }: ListingsSectionProps) {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const cat = searchParams.get("cat");
    return cat && CATEGORIES.includes(cat) ? cat : "All";
  });
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [favoriteMap, setFavoriteMap] = useState<Map<number, number>>(new Map());

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    getFavorites()
      .then((favs) => {
        const map = new Map<number, number>();
        favs.forEach((f) => map.set(f.listing, f.id));
        setFavoriteMap(map);
      })
      .catch(() => {});
  }, []);

  // Listen for hash change events (e.g. user clicks /#textbooks or loads /#listings?q=...)
  useEffect(() => {
    const parseHashAndQuery = () => {
      const hash = window.location.hash;
      if (hash.includes("?")) {
        const queryString = hash.split("?")[1];
        const params = new URLSearchParams(queryString);
        const q = params.get("q");
        if (q) setSearchQuery(q);
        const cat = params.get("cat");
        if (cat && CATEGORIES.includes(cat)) setSelectedCategory(cat);
      } else {
        const cleanHash = hash.replace("#", "").toLowerCase();
        if (cleanHash === "textbooks") setSelectedCategory("Textbooks");
        else if (cleanHash === "electronics") setSelectedCategory("Electronics");
        else if (cleanHash === "clothing") setSelectedCategory("Clothing");
        else if (cleanHash === "services") setSelectedCategory("Services");
      }
    };
    parseHashAndQuery();
    window.addEventListener("hashchange", parseHashAndQuery);
    return () => window.removeEventListener("hashchange", parseHashAndQuery);
  }, []);

  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "All" && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }
        // Location filter
        if (
          selectedLocation !== "All Locations" &&
          !item.hall_location.toLowerCase().includes(selectedLocation.toLowerCase())
        ) {
          return false;
        }
        // Search query filter with smart multi-word matching and typo tolerance
        if (searchQuery.trim()) {
          const rawQ = searchQuery.toLowerCase().trim();
          const autoCorrect = autoCorrectQuery(rawQ);
          const effectiveQ = autoCorrect.hasCorrection ? autoCorrect.correctedQuery.toLowerCase() : rawQ;
          const fullText = `${item.title} ${item.description} ${item.category} ${item.hall_location} ${item.seller_username}`.toLowerCase();
          
          if (fullText.includes(rawQ) || fullText.includes(effectiveQ)) {
            return true;
          }

          const stopWords = new Set(["for", "the", "and", "a", "an", "in", "on", "with", "to", "of", "something"]);
          const tokens = `${rawQ} ${effectiveQ}`.split(/\s+/).filter((t) => t.length > 2 && !stopWords.has(t));

          if (tokens.length > 0) {
            const hasMatch = tokens.some((token) => fullText.includes(token));
            if (!hasMatch) return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (selectedSort === "price_asc") {
          return parseFloat(a.price) - parseFloat(b.price);
        }
        if (selectedSort === "price_desc") {
          return parseFloat(b.price) - parseFloat(a.price);
        }
        // Default newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialListings, selectedCategory, selectedLocation, searchQuery, selectedSort]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLocation("All Locations");
    setSelectedSort("newest");
  };

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedCategory !== "All" ||
    selectedLocation !== "All Locations" ||
    selectedSort !== "newest";

  return (
    <section id="listings" className="px-4 sm:px-6 md:px-[6vw] py-16 scroll-mt-24">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest text-[#F0631D] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus Live Feed</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-white uppercase">
            Fresh on The Corner
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Browse verified student deals and services across all GZU campuses.
          </p>
        </div>

        {/* Search input in Listings Bar with Predictive typing */}
        <div className="relative w-full lg:w-96">
          <PredictiveSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={(q) => setSearchQuery(q)}
            placeholder="Search listings, courses, dorm items..."
          />
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-[#F0631D] text-black font-bold shadow-[0_2px_14px_rgba(240,99,29,0.35)] scale-105"
                    : "bg-white/[0.05] hover:bg-white/[0.1] text-zinc-300 border border-white/10"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters: Location & Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Location Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white/[0.06] border border-white/15 hover:border-white/25 rounded-full px-4 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#F0631D] cursor-pointer pr-8"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#121418] text-white">
                  {loc}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white/[0.06] border border-white/15 hover:border-white/25 rounded-full px-4 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#F0631D] cursor-pointer pr-8"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value} className="bg-[#121418] text-white">
                  {sort.label}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Reset button if filtered */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              type="button"
              className="p-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-300 hover:text-white transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Active Tags */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6">
        <span>
          Showing <strong className="text-white">{filteredListings.length}</strong> of {initialListings.length} verified listings
        </span>
        {selectedCategory !== "All" && (
          <span className="text-[#F0631D]">
            Filter: {selectedCategory}
          </span>
        )}
      </div>

      {/* Grid of Listings or Empty State */}
      {filteredListings.length === 0 ? (
        <div className="rounded-[32px] border border-white/[0.08] bg-[#111317] p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#F0631D]/10 text-[#F0631D] flex items-center justify-center mx-auto mb-4 border border-[#F0631D]/20">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-sans font-bold text-lg text-white mb-1">
            No matching campus listings
          </h3>
          <p className="text-zinc-400 text-xs sm:text-sm mb-6">
            We couldn&rsquo;t find anything matching your search. Try changing your filters or be the first to post this item!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {searchQuery.trim() && (
              <Link
                href={`/search?q=${encodeURIComponent(searchQuery.trim())}`}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all flex items-center gap-1.5 shadow-[0_2px_12px_rgba(240,99,29,0.3)]"
              >
                <Sparkles className="w-3.5 h-3.5 fill-black" />
                <span>Search with AI</span>
              </Link>
            )}
            <button
              onClick={resetFilters}
              type="button"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 transition-all"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filteredListings.map((listing, i) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              index={i}
              initialSaved={favoriteMap.has(listing.id)}
              favoriteId={favoriteMap.get(listing.id)}
              onRemove={() => {
                setFavoriteMap((prev) => {
                  const next = new Map(prev);
                  next.delete(listing.id);
                  return next;
                });
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
