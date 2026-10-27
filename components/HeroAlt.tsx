"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Search, ShieldCheck, Zap, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroAlt() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <section className="relative overflow-hidden px-4 sm:px-6 md:px-[6vw] pt-24 sm:pt-28 md:pt-32 pb-4">
      <div className="relative rounded-[28px] sm:rounded-[36px] md:rounded-[42px] border border-white/[0.08] bg-[#111317] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
        
        {/* Ambient Glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#F0631D]/15 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-[#2F6B4F]/15 blur-[140px] pointer-events-none" />

        <div className="grid lg:grid-cols-12 min-h-[580px] lg:min-h-[620px] items-stretch relative z-10">
          
          {/* Left Column: Hero Content & Search */}
          <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-10 md:px-14 py-12 md:py-16">
            
            {/* Campus Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-mono tracking-widest w-fit shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#F0631D] animate-pulse" />
              <span>GREAT ZIMBABWE UNIVERSITY MARKETPLACE</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-6 font-sans font-black text-4xl sm:text-6xl md:text-7xl lg:text-7xl uppercase tracking-[-0.035em] text-white leading-[0.93]">
              THE<br />
              CORNER<span className="text-[#F0631D]">.</span>
            </h1>

            {/* Subheadings */}
            <h2 className="mt-5 text-white font-sans font-bold text-lg sm:text-xl tracking-tight">
              Built on campus, for campus.
            </h2>
            <p className="mt-2 text-zinc-300/80 text-sm sm:text-base leading-relaxed max-w-lg">
              We don&rsquo;t run from the future. We wear it. Verified student listings, peer-to-peer textbook trades, and safe campus meetups across Mashava, Mucheke, and Main Campus.
            </p>

            {/* Interactive Fast Campus Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-lg">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask AI: e.g. cheap calculator for engineering, warm winter jacket..."
                  className="w-full pl-12 pr-36 py-3.5 rounded-full bg-white/[0.06] border border-white/15 text-white placeholder-zinc-400 text-xs sm:text-sm font-sans focus:outline-none focus:border-[#F0631D] focus:ring-1 focus:ring-[#F0631D] transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-black" />
                  <span>AI Search</span>
                </button>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6">
              <Link
                href="/#listings"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_24px_rgba(240,99,29,0.35)]"
              >
                <span>Browse Listings</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center px-6 py-3 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                List an item free
              </Link>
            </div>

            {/* Trust Badges Cluster */}
            <div className="grid grid-cols-3 gap-3 pt-8 mt-8 border-t border-white/[0.08] max-w-lg">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F0631D] shrink-0" />
                <span className="text-[11px] font-mono text-zinc-300 leading-tight">GZU Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#F0631D] shrink-0" />
                <span className="text-[11px] font-mono text-zinc-300 leading-tight">1,200+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#F0631D] shrink-0" />
                <span className="text-[11px] font-mono text-zinc-300 leading-tight">Zero Trading Fees</span>
              </div>
            </div>

          </div>

          {/* Right Column: Campus Lifestyle Imagery & Tag */}
          <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-white/[0.08]">
            <Image
              src="/images/hero-student.jpg"
              alt="Great Zimbabwe University student on campus"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center brightness-[0.88] contrast-[1.08] transition-transform duration-700 hover:scale-105"
            />
            {/* Edge Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111317] via-transparent to-transparent lg:hidden" />
            <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#111317] to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111317]/90 via-transparent to-black/20 pointer-events-none" />

            {/* Photo Bottom Caption */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-10">
              <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#F0631D]">
                  Campus Meetup Zone
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  Main Library Quad & Mashava Gate
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                  Masvingo, Zimbabwe
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}