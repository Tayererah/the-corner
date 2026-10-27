"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import PredictiveSearchBar from "@/components/PredictiveSearchBar";
import { searchListings, Listing, SearchResponse } from "@/lib/api";

const EXAMPLES = [
  { label: "something warm for winter", type: "semantic" },
  { label: "cheap calculator for engineering", type: "semantic" },
  { label: "caculator for enginering", type: "typo", badge: "Try Typo Auto-Correct" },
  { label: "laptop under $250", type: "semantic" },
  { label: "macbok charger", type: "typo", badge: "Typo" },
  { label: "statitics tutring", type: "typo", badge: "Typo" },
];

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQ = params.get("q") || "";
  const isExactParam = params.get("exact") === "1";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Listing[]>([]);
  const [searchMeta, setSearchMeta] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function runSearch(q: string, exact: boolean = false) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    router.replace(`/search?q=${encodeURIComponent(q)}${exact ? "&exact=1" : ""}`);

    try {
      const data = await searchListings(q, { exact });
      setResults(data.results || []);
      setSearchMeta(data);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Execute initial search if ?q= is present
  useEffect(() => {
    if (!initialQ) return;

    let ignore = false;

    async function fetchInitialResults() {
      setLoading(true);
      setSearched(true);
      try {
        const data = await searchListings(initialQ, { exact: isExactParam });
        if (!ignore) {
          setResults(data.results || []);
          setSearchMeta(data);
        }
      } catch (err) {
        console.error("Search error:", err);
        if (!ignore) {
          setResults([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchInitialResults();

    return () => {
      ignore = true;
    };
  }, [initialQ, isExactParam]);

  return (
    <div style={{ background: "#0b0c0e" }} className="min-h-screen text-white px-4 sm:px-6 md:px-[6vw] pt-10 pb-24 font-sans">
      {/* Top Back Navigation */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span></span>
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 hidden sm:inline">
          
        </span>
      </div>

      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-[#F0631D] uppercase mb-4 shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Semantic AI & Predictive Autocomplete</span>
        </div>
        <h1 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tight mb-3">
          Find anything on campus<span className="text-[#F0631D]">.</span>
        </h1>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
          Type freely — features real-time <strong>ghost predictive completion</strong> (Tab ↹) and <strong>intelligent typo auto-correction</strong>.
        </p>
      </div>

      {/* Predictive Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <PredictiveSearchBar
          value={query}
          onChange={setQuery}
          onSearch={(q, exact) => runSearch(q, exact)}
          placeholder="Try typing 'calc', 'warm hoodie', 'stewart', or 'macbok'..."
          size="large"
          autoFocus={!initialQ}
        />
      </div>

      {/* Quick Example Chips with Typo Demonstrations */}
      <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center mb-10">
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => {
              setQuery(ex.label);
              runSearch(ex.label);
            }}
            className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs transition-all duration-200 ${
              ex.type === "typo"
                ? "border-[#F0631D]/40 bg-[#F0631D]/5 hover:bg-[#F0631D]/15 text-zinc-200"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white"
            }`}
          >
            <span>&ldquo;{ex.label}&rdquo;</span>
            {ex.badge && (
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[#F0631D]/20 text-[#F0631D] font-bold">
                {ex.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Auto-Correct Banner ("Showing results for ... Search instead for ...") */}
      {searchMeta?.autoCorrected && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-2xl bg-[#F0631D]/10 border border-[#F0631D]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2.5 text-zinc-200">
            <Sparkles className="w-4 h-4 text-[#F0631D] shrink-0" />
            <div>
              <span>Showing results for </span>
              <strong className="text-white font-bold underline decoration-[#F0631D] underline-offset-4">
                &ldquo;{searchMeta.effectiveQuery}&rdquo;
              </strong>
              {searchMeta.corrections && searchMeta.corrections.length > 0 && (
                <span className="text-zinc-400 text-[11px] ml-1.5 font-mono">
                  (auto-corrected from &ldquo;{searchMeta.query}&rdquo;)
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => runSearch(searchMeta.query || query, true)}
            className="text-[11px] font-mono text-[#F0631D] hover:text-[#ff7e42] underline underline-offset-2 shrink-0 transition-colors"
          >
            Search instead for &ldquo;{searchMeta.query}&rdquo;
          </button>
        </div>
      )}

      {/* Explanation Capsule */}
      {searchMeta?.explanation && (
        <div className="max-w-2xl mx-auto mb-8 px-4 py-2.5 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center gap-2 text-xs text-zinc-300 text-center">
          <Sparkles className="w-3.5 h-3.5 text-[#F0631D] shrink-0" />
          <span>{searchMeta.explanation}</span>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400">
            <RefreshCw className="w-4 h-4 animate-spin text-[#F0631D]" />
            <span>Analyzing campus listings with semantic engine...</span>
          </div>
        </div>
      )}

      {/* Zero Results State */}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-white mb-1">No listings found</h3>
          <p className="text-zinc-400 text-xs mb-6">
            We couldn&apos;t find any items matching your request. Try broadening your terms or removing price limits.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setSearched(false);
              setResults([]);
            }}
            className="px-4 py-2 rounded-full border border-white/10 text-xs font-mono text-zinc-300 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!loading && results.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.08]">
            <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
              Found <span className="text-[#F0631D] font-bold">{results.length}</span> campus listing{results.length === 1 ? "" : "s"}
            </p>
            {searchMeta?.mode && (
              <span className="text-[10px] font-mono text-zinc-500 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                Engine: {searchMeta.mode}
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {results.map((listing, i) => (
              <ListingCard key={listing.id} listing={listing} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen text-white pt-28 text-center font-mono text-xs">
          Loading search engine...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}