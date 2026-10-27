"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag, Tag, ShieldCheck } from "lucide-react";

export default function LandingFinalCTA() {
  const scrollToBrowse = () => {
    const el = document.getElementById("listings");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="px-4 sm:px-6 md:px-[6vw] py-14 md:py-20 font-sans">
      <div className="max-w-7xl mx-auto rounded-[32px] sm:rounded-[44px] bg-gradient-to-br from-[#181a20] via-[#121418] to-[#0c0d10] border border-white/10 p-8 sm:p-14 md:p-16 relative overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.7)] text-center flex flex-col items-center">
        
        {/* Ambient Coral Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#F0631D]/15 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F0631D]/15 border border-[#F0631D]/30 text-[#F0631D] text-xs font-mono uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Join 1,400+ GZU Students Today</span>
          </div>

          <h2 className="font-sans font-black text-3xl sm:text-5xl text-white uppercase tracking-tight leading-tight">
            Ready to Save Money or Cash Out Your Gear?
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Prescribed textbooks, exam-tested calculators, student laptops, and varsity hoodies are waiting on campus right now.
          </p>

          {/* Primary Action Buttons (Clear, informative labels) */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={scrollToBrowse}
              className="px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all hover:scale-105 active:scale-95 shadow-[0_4px_25px_rgba(240,99,29,0.4)] flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>Browse Campus Listings</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              href="/sell"
              className="px-8 py-4 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              <span>Post an Item Free</span>
            </Link>
          </div>

          <div className="pt-4 text-xs font-mono text-zinc-500">
            Zero fees • Hand-to-hand on campus ground • WhatsApp direct contact
          </div>
        </div>

      </div>
    </section>
  );
}
