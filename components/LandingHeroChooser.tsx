"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  Star,
  Search,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Laptop,
  Shirt,
  Wrench,
  Clock
} from "lucide-react";

export default function LandingHeroChooser() {
  const router = useRouter();
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const scrollToBrowse = () => {
    const el = document.getElementById("listings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#listings");
    }
  };

  return (
    <section className="relative px-4 sm:px-6 md:px-[6vw] pt-24 sm:pt-28 md:pt-30 pb-6 font-sans">
      {/* ==================== 1. TOP EDITORIAL BANNER (MATCHING SCREENSHOT) ==================== */}
      <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-zinc-400 font-mono text-xs uppercase tracking-widest px-2">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F0631D] animate-pulse" />
            <span>Great Zimbabwe University</span>
          </span>
          <span>Semester 2 Active Trades</span>
        </div>

        {/* Big Bold Editorial Typography Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mt-2 select-none overflow-hidden">
          <h2 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-[-0.04em] text-white leading-none">
            OWN THE <span className="text-[#F0631D]">TRADE.</span>
          </h2>
          <h2 className="font-sans font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-[-0.04em] text-zinc-400/70 sm:text-right leading-none mt-1 sm:mt-0">
            KEEP THE <span className="text-white">CASH.</span>
          </h2>
        </div>
      </div>

      {/* ==================== 2. CENTRAL CURVED HERO CARD (VYBE-INSPIRED) ==================== */}
      <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[44px] md:rounded-[52px] bg-gradient-to-br from-[#ea580c] via-[#F0631D] to-[#c2410c] text-white p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-[0_25px_80px_rgba(240,99,29,0.35)]">
        
        {/* Soft Background Art Circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-black/15 blur-2xl pointer-events-none" />

        {/* Top Feature Highlights Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-white/20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-wider text-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Campus Direct Exchange</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-mono uppercase tracking-wider text-white/90">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Zero Trading Fees</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Verified Peers</span>
            </span>
            <span className="flex items-center gap-1.5 hidden sm:inline-flex">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <span>4 Campus Meetup Zones</span>
            </span>
          </div>
        </div>

        {/* Main Hero Card Body: 2 Columns */}
        <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6 sm:pt-10">
          
          {/* Left Column: Value Proposition & Intent Chooser */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Mode Switcher Chooser ("I want to buy" / "I want to sell") */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-black/70 font-bold block mb-2">
                Select Your Campus Goal:
              </span>
              <div className="inline-flex p-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/25">
                <button
                  type="button"
                  onClick={() => setMode("buy")}
                  className={`px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    mode === "buy"
                      ? "bg-white text-black shadow-lg scale-100"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                  <span>I want to buy</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("sell")}
                  className={`px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                    mode === "sell"
                      ? "bg-black text-white shadow-lg scale-100"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  <Tag className="w-4 h-4 stroke-[2.5]" />
                  <span>I want to sell</span>
                </button>
              </div>
            </div>

            {/* Dynamic Headline Based on Chooser */}
            {mode === "buy" ? (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-black/80 font-bold">
                  Save 40%–60% vs Bookstore Markup
                </div>
                <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[0.98]">
                  Buy Prescribed Books &amp; Tech Direct From Seniors.
                </h1>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                  No middleman markups, no bank transfer anxiety. Meet right on campus at the Library Quad or Mashava Gate—test the calculator, inspect textbook notes, and pay only when satisfied.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-black/80 font-bold">
                  14-Day Free Seller Trial • 0% Commission
                </div>
                <h1 className="font-sans font-black text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight leading-[0.98]">
                  Turn Unused Campus Gear Into Instant Cash Today.
                </h1>
                <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                  Passed your module? Graduating? Snap a photo of your textbooks, electronics, or dorm gear. Buyers message your WhatsApp directly and pay in full at safe campus spots.
                </p>
              </div>
            )}

            {/* Chooser-Specific Search / Action Bar */}
            {mode === "buy" ? (
              <div className="space-y-3 max-w-xl">
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-zinc-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask AI: e.g. Madhuku Law, Casio fx-991EX, ThinkPad..."
                    className="w-full pl-11 pr-36 py-3.5 rounded-full bg-white text-zinc-900 placeholder-zinc-500 text-xs sm:text-sm font-sans focus:outline-none shadow-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#F0631D]" />
                    <span>Search</span>
                  </button>
                </form>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={scrollToBrowse}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-900 transition-transform active:scale-95 shadow-xl"
                  >
                    <span>Browse All Listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    href="/category/textbooks"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono uppercase bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors border border-white/20"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Textbooks</span>
                  </Link>
                  <Link
                    href="/category/electronics"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-mono uppercase bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-colors border border-white/20"
                  >
                    <Laptop className="w-3.5 h-3.5" />
                    <span>Electronics</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-xl">
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/sell"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-900 transition-transform active:scale-95 shadow-xl"
                  >
                    <span>Post Your First Item Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs font-mono text-white/90">
                    Takes under 45 seconds on mobile
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/15">
                    <span className="font-bold block text-white">0% Cuts</span>
                    <span className="text-[11px] text-white/80">Keep all earnings</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/15">
                    <span className="font-bold block text-white">WhatsApp</span>
                    <span className="text-[11px] text-white/80">Direct buyer chat</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/20 border border-white/15 col-span-2 sm:col-span-1">
                    <span className="font-bold block text-white">Safe Zones</span>
                    <span className="text-[11px] text-white/80">Hall pickup</span>
                  </div>
                </div>
              </div>
            )}

            {/* Social Proof Trust Stack (Matching the bottom badge in screenshot) */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 text-xs">
                {/* 4 Overlapping Avatar Circles */}
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-[#F0631D] flex items-center justify-center text-[10px] font-bold text-black">T</div>
                  <div className="w-6 h-6 rounded-full bg-emerald-400 border-2 border-[#F0631D] flex items-center justify-center text-[10px] font-bold text-black">B</div>
                  <div className="w-6 h-6 rounded-full bg-sky-400 border-2 border-[#F0631D] flex items-center justify-center text-[10px] font-bold text-black">K</div>
                  <div className="w-6 h-6 rounded-full bg-purple-400 border-2 border-[#F0631D] flex items-center justify-center text-[10px] font-bold text-black">R</div>
                </div>
                <div className="font-mono text-[11px] text-white">
                  <span className="text-amber-300 font-bold">★ 4.9/5</span> from 1,400+ GZU Students
                </div>
              </div>

              <div className="text-[11px] font-mono text-white/80 hidden sm:block">
                ✓ Over 400 verified student exchanges this semester
              </div>
            </div>

          </div>

          {/* Right Column: High Quality Product Photo & Floating Featured Badge */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            
            {/* Framed Lifestyle Student Image */}
            <div className="relative w-full max-w-sm sm:max-w-md aspect-[4/5] rounded-[32px] sm:rounded-[40px] overflow-hidden border-2 border-white/30 shadow-2xl">
              <Image
                src="/images/hero-student.jpg"
                alt="Great Zimbabwe University student trading on campus"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover object-center brightness-[0.92] contrast-[1.05] hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Photo Bottom Caption */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#F0631D] font-bold">
                  Campus Safe Meetup Zone
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  Great Hall &amp; Mashava Library Quad
                </div>
              </div>
            </div>

            {/* Floating "Featured Item" Card (Identical in concept to VYBE screenshot) */}
            <div className="absolute -bottom-6 -left-2 sm:-left-6 bg-white text-zinc-900 p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-zinc-200/80 max-w-[240px] sm:max-w-[260px] animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold">
                  Featured On-Campus
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  Like New
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center shrink-0 border border-zinc-200">
                  <Laptop className="w-6 h-6 text-[#F0631D]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 leading-snug line-clamp-1">
                    Casio fx-991EX ClassWiz
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-1 font-sans">
                    With fresh batteries
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-black text-[#F0631D] font-mono">$25.00</span>
                <span className="text-[10px] font-mono text-zinc-500">Mashava Quad</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
