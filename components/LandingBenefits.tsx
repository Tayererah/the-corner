"use client";

import { DollarSign, ShieldCheck, Zap, HeartHandshake, CheckCircle2 } from "lucide-react";

export default function LandingBenefits() {
  return (
    <section className="px-4 sm:px-6 md:px-[6vw] py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0631D]/15 border border-[#F0631D]/30 text-[#F0631D] text-xs font-mono uppercase tracking-wider mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Outcomes That Matter to Students</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight">
            Built to Solve Real Campus Headaches.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2 leading-relaxed">
            No retail bookshop markups. No ghosting after sending EcoCash. Here is why over 1,400 Great Zimbabwe University students trade directly through The Corner.
          </p>
        </div>

        {/* 4 Outcome-Driven Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          {/* Outcome 1: Save Money on Books */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-[#111317] border border-white/10 hover:border-[#F0631D]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F0631D]/15 text-[#F0631D] flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white mb-2 leading-snug">
                Save $20–$50 on Prescribed Books
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Why pay bookstore prices for books you only need for 4 months? Grab clean, highlighted copies from seniors who already passed the module.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Madhuku, Feltoe, Stewart in stock</span>
            </div>
          </div>

          {/* Outcome 2: Inspect Before Paying */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-[#111317] border border-white/10 hover:border-[#F0631D]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white mb-2 leading-snug">
                Test Gadgets Before Paying a Cent
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Never send money in advance. Meet your fellow peer in daylight at Mashava Security Gate or Library Quad—run diagnostics together before paying.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero risk of online delivery scams</span>
            </div>
          </div>

          {/* Outcome 3: Turn Clutter into Cash */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-[#111317] border border-white/10 hover:border-[#F0631D]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center mb-5">
                <Zap className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white mb-2 leading-snug">
                Cash Out Dorm Gear in 48 Hours
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Snap photos from your phone, write a brief note, and publish. Interested buyers message your WhatsApp directly with zero middleman friction.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Direct WhatsApp student leads</span>
            </div>
          </div>

          {/* Outcome 4: 100% Free with Zero Commission */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-[#111317] border border-white/10 hover:border-[#F0631D]/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mb-5">
                <HeartHandshake className="w-6 h-6 stroke-[2.5]" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white mb-2 leading-snug">
                100% of What You Agree Is Yours
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                We believe campus peer trades should be free. There are zero listing deductions, zero transaction percentages, and zero hidden platform fees.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-white/[0.06] flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Zero trading cuts forever</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
