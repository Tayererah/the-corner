"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  X,
  BookOpen,
  Laptop,
  Shirt,
  Wrench,
  Tag,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import {
  getPredictiveTypingData,
  PredictiveResult,
  PredictiveSuggestion
} from "@/lib/predictiveTyping";
import { Listing } from "@/lib/api";

interface PredictiveSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onSearch: (q: string, isExact?: boolean) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  size?: "default" | "large";
}

export default function PredictiveSearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search campus listings (e.g., cheap calculator, warm hoodie, tutoring)...",
  autoFocus = false,
  className = "",
  size = "default",
}: PredictiveSearchBarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Compute predictive suggestions & ghost completion
  const predictiveData: PredictiveResult = useMemo(() => {
    return getPredictiveTypingData(value);
  }, [value]);

  const { ghostCompletion, autoCorrect, suggestions, instantMatches } = predictiveData;

  // Flatten selectable items for keyboard arrow navigation
  const selectableItems = useMemo(() => {
    const items: Array<{
      type: "suggestion" | "match";
      text: string;
      data: any;
    }> = [];

    suggestions.forEach((s) => {
      items.push({ type: "suggestion", text: s.text, data: s });
    });

    instantMatches.forEach((m) => {
      items.push({ type: "match", text: m.title, data: m });
    });

    return items;
  }, [suggestions, instantMatches]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation & ghost completion acceptance
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 1. Tab or Right Arrow to accept ghost completion
    if ((e.key === "Tab" || e.key === "ArrowRight") && ghostCompletion) {
      // Check if cursor is near end
      const cursor = inputRef.current?.selectionStart || 0;
      if (e.key === "Tab" || cursor >= value.length) {
        e.preventDefault();
        onChange(ghostCompletion.fullText);
        setSelectedIndex(-1);
        return;
      }
    }

    // 2. Escape to dismiss
    if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    // 3. Arrow navigation
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) =>
        prev < selectableItems.length - 1 ? prev + 1 : 0
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : selectableItems.length - 1
      );
      return;
    }

    // 4. Enter to submit or execute
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < selectableItems.length) {
        const selected = selectableItems[selectedIndex];
        if (selected.type === "suggestion") {
          const sugg = selected.data as PredictiveSuggestion;
          if (sugg.type === "category" && sugg.category) {
            router.push(`/category/${sugg.category.toLowerCase()}`);
            setIsOpen(false);
            return;
          }
          onChange(sugg.text);
          onSearch(sugg.text);
          setIsOpen(false);
        } else if (selected.type === "match") {
          router.push(`/listings/${selected.data.id}`);
          setIsOpen(false);
        }
      } else {
        // Direct search
        if (value.trim()) {
          onSearch(value.trim());
          setIsOpen(false);
        }
      }
    }
  }

  function handleSelectSuggestion(sugg: PredictiveSuggestion) {
    if (sugg.type === "category" && sugg.category) {
      router.push(`/category/${sugg.category.toLowerCase()}`);
      setIsOpen(false);
      return;
    }
    onChange(sugg.text);
    onSearch(sugg.text);
    setIsOpen(false);
  }

  function getCategoryIcon(cat?: string) {
    switch (cat?.toLowerCase()) {
      case "textbooks":
        return <BookOpen className="w-3.5 h-3.5 text-blue-400" />;
      case "electronics":
        return <Laptop className="w-3.5 h-3.5 text-emerald-400" />;
      case "clothing":
        return <Shirt className="w-3.5 h-3.5 text-purple-400" />;
      case "services":
        return <Wrench className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Tag className="w-3.5 h-3.5 text-zinc-400" />;
    }
  }

  const isLarge = size === "large";

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box with Ghost Text Overlay */}
      <div
        className={`relative flex items-center gap-3 w-full rounded-2xl border transition-all duration-200 ${
          isOpen
            ? "border-[#F0631D] shadow-[0_0_24px_rgba(240,99,29,0.22)] bg-[#121316]"
            : "border-white/10 hover:border-white/20 bg-[#121316]/90"
        } ${isLarge ? "px-5 py-2.5 sm:py-3" : "px-4 py-2"}`}
      >
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />

        {/* Text Container with Ghost Completion Underlay */}
        <div className="relative flex-1 flex items-center">
          {/* Ghost Completion Layer */}
          {ghostCompletion && (
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none flex items-center select-none overflow-hidden whitespace-pre text-sm font-sans"
              style={{
                fontSize: isLarge ? "15px" : "14px",
                lineHeight: "1.5",
              }}
            >
              {/* Invisible typed portion so suffix aligns right next to cursor */}
              <span className="opacity-0">{value}</span>
              {/* Visible ghost predictive suffix */}
              <span className="text-zinc-500 font-medium">
                {ghostCompletion.suffix}
              </span>
            </div>
          )}

          {/* Actual User Input */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            autoFocus={autoFocus}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              onChange(e.target.value);
              setIsOpen(true);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full bg-transparent text-white outline-none placeholder-zinc-500 font-sans z-10 ${
              isLarge ? "text-base py-1" : "text-sm py-0.5"
            }`}
          />
        </div>

        {/* Right Action Icons / Ghost Tab Key Hint */}
        <div className="flex items-center gap-2 shrink-0 z-10">
          {/* Ghost Completion Hint Pill */}
          {ghostCompletion && (
            <button
              type="button"
              onClick={() => {
                onChange(ghostCompletion.fullText);
                inputRef.current?.focus();
              }}
              className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white/[0.08] text-[#F0631D] border border-[#F0631D]/30 hover:bg-[#F0631D]/15 transition-colors"
              title="Press Tab to complete"
            >
              <span>Tab ↹</span>
            </button>
          )}

          {/* Clear Button */}
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Search Action Button */}
          <button
            type="button"
            onClick={() => {
              if (value.trim()) {
                onSearch(value.trim());
                setIsOpen(false);
              }
            }}
            className="inline-flex items-center justify-center p-2 rounded-xl text-black bg-[#F0631D] hover:bg-[#ff722a] transition-transform active:scale-95 shadow-[0_2px_12px_rgba(240,99,29,0.3)]"
            aria-label="Submit search"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Auto-Correct Inline Chip (Shown right beneath input if typo detected) */}
      {autoCorrect.hasCorrection && value.trim().length > 2 && (
        <div className="mt-2 flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-[#F0631D]/10 border border-[#F0631D]/30 text-xs text-zinc-300 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F0631D] shrink-0" />
            <span>
              Did you mean{" "}
              <button
                type="button"
                onClick={() => {
                  onChange(autoCorrect.correctedQuery);
                  onSearch(autoCorrect.correctedQuery);
                }}
                className="font-bold text-[#F0631D] underline underline-offset-2 hover:text-[#ff7e42] transition-colors"
              >
                {autoCorrect.correctedQuery}
              </button>
              ?
            </span>
          </div>
          <button
            type="button"
            onClick={() => onSearch(value.trim(), true)}
            className="text-[11px] font-mono text-zinc-400 hover:text-white underline transition-colors"
          >
            Search literal
          </button>
        </div>
      )}

      {/* Predictive Suggestions Dropdown */}
      {isOpen && (suggestions.length > 0 || instantMatches.length > 0) && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#111317]/95 backdrop-blur-2xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-4 py-2 border-b border-white/[0.06] flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#F0631D]" />
              <span>Predictive Search</span>
            </span>
            <span className="text-[10px] text-zinc-500">
              ↑↓ to navigate • ↵ to select
            </span>
          </div>

          <div className="py-2 divide-y divide-white/[0.04]">
            {/* 1. Suggestions List */}
            {suggestions.length > 0 && (
              <div className="py-1">
                {suggestions.map((sugg, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isCorrection = sugg.type === "correction";

                  return (
                    <button
                      key={sugg.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(sugg)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-white/[0.08] text-white"
                          : "text-zinc-300 hover:bg-white/[0.04]"
                      } ${isCorrection ? "bg-[#F0631D]/10 text-white" : ""}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isCorrection
                              ? "bg-[#F0631D]/20 text-[#F0631D]"
                              : "bg-white/[0.05] text-zinc-400"
                          }`}
                        >
                          {isCorrection ? (
                            <Sparkles className="w-3.5 h-3.5" />
                          ) : (
                            getCategoryIcon(sugg.category)
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-xs sm:text-sm font-medium truncate flex items-center gap-2">
                            <span>{sugg.text}</span>
                            {isCorrection && (
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#F0631D]/30 text-[#F0631D] font-bold">
                                Auto-Correct
                              </span>
                            )}
                          </p>
                          {sugg.subtitle && (
                            <p className="text-[11px] text-zinc-400 font-mono">
                              {sugg.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {sugg.category && (
                          <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                            {sugg.category}
                          </span>
                        )}
                        <CornerDownLeft className="w-3.5 h-3.5 text-zinc-500 opacity-60" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Instant Matching Listings */}
            {instantMatches.length > 0 && (
              <div className="p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2 px-1">
                  Instant Campus Matches
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {instantMatches.map((item, mIdx) => {
                    const globalIdx = suggestions.length + mIdx;
                    const isSelected = selectedIndex === globalIdx;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          router.push(`/listings/${item.id}`);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`text-left p-2 rounded-xl flex items-center gap-2.5 transition-all border ${
                          isSelected
                            ? "bg-white/[0.08] border-[#F0631D]/40"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden relative shrink-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <Tag className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-white truncate">
                            {item.title}
                          </p>
                          <div className="flex items-center justify-between text-[11px] font-mono mt-0.5">
                            <span className="text-[#F0631D] font-bold">
                              ${item.price}
                            </span>
                            <span className="text-zinc-400 text-[10px]">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
