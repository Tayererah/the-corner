"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ChevronRight,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
import { Listing, getFavorites } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";
import ListingCard from "@/components/ListingCard";
import { CategoryData, getAllCategories } from "@/lib/categories";

const LOCATIONS = [
  "All Locations",
  "Mashava Campus",
  "Main Campus Quad",
  "Main Campus Library",
  "Mucheke Campus",
  "Herbert Chitepo Hall",
];

const CONDITIONS = ["All", "Brand New", "Like New", "Good", "Fair", "Service"];

const SORTS = [
  { label: "Recommended", value: "recommended" },
  { label: "Newest Arrivals", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const PRICE_BRACKETS = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 – $25", min: 10, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50+", min: 50, max: Infinity },
];

interface CategoryViewProps {
  category: CategoryData;
  initialListings: Listing[];
}

export default function CategoryView({ category, initialListings }: CategoryViewProps) {
  const allCategories = getAllCategories();

  // Filter States
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedSort, setSelectedSort] = useState("recommended");
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);

  // Sync favorites
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

  // Filter logic
  const filteredListings = useMemo(() => {
    const currentSub = category.subcategories.find((s) => s.id === selectedSubcategory);
    const priceBracket = PRICE_BRACKETS[selectedPriceIdx];

    return initialListings
      .filter((item) => {
        // Base category match
        const itemCat = item.category.toLowerCase().trim();
        const targetCat = category.shortName.toLowerCase().trim();
        if (itemCat !== targetCat) {
          return false;
        }

        // Subcategory filter
        if (currentSub && currentSub.id !== "all") {
          if (currentSub.maxPrice && parseFloat(item.price) > currentSub.maxPrice) {
            return false;
          }
          if (currentSub.keywords && currentSub.keywords.length > 0) {
            const textToSearch = `${item.title} ${item.description}`.toLowerCase();
            const matchesKeyword = currentSub.keywords.some((k) =>
              textToSearch.includes(k.toLowerCase())
            );
            if (!matchesKeyword) return false;
          }
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchSeller = item.seller_username.toLowerCase().includes(q);
          const matchHall = item.hall_location.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchSeller && !matchHall) {
            return false;
          }
        }

        // Location filter
        if (
          selectedLocation !== "All Locations" &&
          !item.hall_location.toLowerCase().includes(selectedLocation.toLowerCase())
        ) {
          return false;
        }

        // Condition filter
        if (selectedCondition !== "All" && item.condition.toLowerCase() !== selectedCondition.toLowerCase()) {
          return false;
        }

        // Price bracket filter
        const price = parseFloat(item.price);
        if (price < priceBracket.min || price > priceBracket.max) {
          return false;
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
        if (selectedSort === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        // Default: recommended
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [
    initialListings,
    category,
    selectedSubcategory,
    searchQuery,
    selectedLocation,
    selectedCondition,
    selectedSort,
    selectedPriceIdx,
  ]);

  const resetAllFilters = () => {
    setSelectedSubcategory("all");
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setSelectedCondition("All");
    setSelectedSort("recommended");
    setSelectedPriceIdx(0);
  };

  const hasActiveFilters =
    selectedSubcategory !== "all" ||
    searchQuery.trim() !== "" ||
    selectedLocation !== "All Locations" ||
    selectedCondition !== "All" ||
    selectedSort !== "recommended" ||
    selectedPriceIdx !== 0;

  return (
    <div className="min-h-screen text-white bg-[#090a0c] pt-24 sm:pt-28 pb-20">
      
      {/* 1. SHEIN-Style Top Category Switcher Tabs */}
      <div className="border-b border-white/[0.08] bg-[#0c0e12]/90 backdrop-blur-xl sticky top-[68px] sm:top-[74px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-[6vw]">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-3 no-scrollbar scroll-smooth">
            {allCategories.map((cat) => {
              const isActive = cat.slug === category.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider shrink-0 transition-all duration-200 border ${
                    isActive
                      ? "bg-white text-black font-bold border-white shadow-[0_0_20px_rgba(255,255,255,0.25)] scale-105"
                      : "bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08] border-white/10"
                  }`}
                >
                  <span>{cat.shortName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isActive ? "bg-black/10 text-black font-bold" : "bg-white/10 text-zinc-300"
                    }`}
                  >
                    {cat.itemCountEstimate.split(" ")[0]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-[6vw]">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400 py-6">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <Link href="/#listings" className="hover:text-white transition-colors">
            Categories
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-[#F0631D] font-semibold">{category.name}</span>
        </nav>

        {/* 2. SHEIN-Style Hero / Banner Canvas */}
        <div className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden border border-white/[0.08] bg-[#111317] p-8 sm:p-12 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {/* Ambient Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${category.gradientBg} opacity-85`} />
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[140px] pointer-events-none"
            style={{ backgroundColor: category.glowColor }}
          />

          {/* Background Decorative Image Overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-full sm:w-1/2 opacity-25 sm:opacity-35 mix-blend-luminosity overflow-hidden pointer-events-none">
            <Image
              src={category.heroImage}
              alt={category.name}
              fill
              priority
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111317] via-[#111317]/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase mb-4 border backdrop-blur-md bg-white/[0.06] border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0631D] animate-pulse" />
              <span className="text-zinc-200">GZU Campus Verified Stashes</span>
              <span className="text-zinc-500">•</span>
              <span className="text-[#F0631D] font-bold">{category.itemCountEstimate}</span>
            </div>

            <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-none mb-4 drop-shadow-md">
              {category.name}
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-medium max-w-xl">
              {category.tagline}. {category.description}
            </p>

            {/* Promo Announcement Banner */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-3 text-xs text-zinc-300">
              <div className="p-1.5 rounded-lg bg-[#F0631D]/20 text-[#F0631D] shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>{category.promoNotice}</span>
            </div>
          </div>
        </div>

        {/* 3. SHEIN-Style Subcategory / Stash Quick Pill Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Filter by Sub-Stash
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {category.subcategories.length} quick tags
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {category.subcategories.map((sub) => {
              const isSelected = selectedSubcategory === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border cursor-pointer ${
                    isSelected
                      ? "bg-[#F0631D] text-black font-bold border-[#F0631D] shadow-[0_4px_16px_rgba(240,99,29,0.35)] scale-[1.02]"
                      : "bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border-white/10"
                  }`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SHEIN-Style Sticky Filter & Sort Bar */}
        <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#111317] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search in ${category.shortName}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#F0631D] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter Controls Group */}
          <div className="flex items-center gap-2.5 flex-wrap">
            
            {/* Campus Location Filter */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white focus:outline-none focus:border-[#F0631D] transition-all cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc} className="bg-[#121316] text-white">
                  {loc}
                </option>
              ))}
            </select>

            {/* Condition Filter */}
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white focus:outline-none focus:border-[#F0631D] transition-all cursor-pointer"
            >
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond} className="bg-[#121316] text-white">
                  Condition: {cond}
                </option>
              ))}
            </select>

            {/* Price Filter */}
            <select
              value={selectedPriceIdx}
              onChange={(e) => setSelectedPriceIdx(parseInt(e.target.value, 10))}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white focus:outline-none focus:border-[#F0631D] transition-all cursor-pointer"
            >
              {PRICE_BRACKETS.map((bracket, idx) => (
                <option key={bracket.label} value={idx} className="bg-[#121316] text-white">
                  {bracket.label}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300 hover:text-white focus:outline-none focus:border-[#F0631D] transition-all cursor-pointer"
            >
              {SORTS.map((sort) => (
                <option key={sort.value} value={sort.value} className="bg-[#121316] text-white">
                  Sort: {sort.label}
                </option>
              ))}
            </select>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-mono bg-white/[0.08] hover:bg-white/[0.15] text-zinc-300 hover:text-white border border-white/15 transition-all cursor-pointer"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

          </div>
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-6">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white">{filteredListings.length}</strong> items in{" "}
              <strong className="text-[#F0631D]">{category.name}</strong>
            </span>
            {hasActiveFilters && (
              <span className="px-2 py-0.5 rounded-full bg-[#F0631D]/10 text-[#F0631D] text-[10px]">
                Filtered
              </span>
            )}
          </div>
        </div>

        {/* 5. Product Grid or Empty State */}
        {filteredListings.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-[32px] border border-white/[0.08] bg-[#111317] text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#F0631D]/10 text-[#F0631D] flex items-center justify-center mx-auto mb-4 border border-[#F0631D]/20">
              <Search className="w-7 h-7" />
            </div>
            <h2 className="font-sans font-black text-xl text-white uppercase tracking-tight mb-2">
              No matching {category.shortName} listings
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
              We couldn&rsquo;t find anything matching your current filter set. Try resetting your filters or list the first one for fellow campus students!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/15 transition-all cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredListings.map((item, idx) => (
              <ListingCard
                key={item.id}
                listing={item}
                index={idx}
                initialSaved={favoriteMap.has(item.id)}
                favoriteId={favoriteMap.get(item.id)}
                onRemove={() => {
                  setFavoriteMap((prev) => {
                    const next = new Map(prev);
                    next.delete(item.id);
                    return next;
                  });
                }}
              />
            ))}
          </div>
        )}

        {/* 6. Campus Safe Hand-Off Guarantee Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-[28px] border border-white/[0.08] bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0631D]/10 text-[#F0631D] flex items-center justify-center border border-[#F0631D]/20 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-sm text-white">Campus Peer Safety Protocol</h3>
              <p className="text-zinc-400 text-xs mt-1 leading-relaxed">
                Meet sellers during daylight at verified campus zones: Great Hall, Mashava Security Gate, or Mucheke Quad. Inspect items before cash/EcoCash hand-over.
              </p>
            </div>
          </div>

          <Link
            href="/sell"
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all whitespace-nowrap shrink-0"
          >
            Sell your {category.shortName}
          </Link>
        </div>

      </div>

    </div>
  );
}
