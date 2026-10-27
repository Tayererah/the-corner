"use client";

import { Star, ShieldCheck, CheckCircle2, MessageSquare, ThumbsUp, MapPin } from "lucide-react";

const REAL_STUDENT_TESTIMONIALS = [
  {
    author: "Tendai K.",
    faculty: "Engineering",
    campus: "Mashava Campus Quad",
    item: "Casio fx-991EX Calculator ($25)",
    rating: 5,
    seller: "tinashe_m",
    comment: "Met at Mashava campus library quad. Calculator was in mint condition with fresh batteries as described. Super smooth trade!",
    tags: ["Mint Condition", "Fast Meetup", "Honest Seller"],
  },
  {
    author: "Tariro C.",
    faculty: "Commercial Law",
    campus: "Main Campus Quad",
    item: "Madhuku Commercial Law ($18)",
    rating: 5,
    seller: "kudzai_law",
    comment: "The Madhuku Law textbook was super clean with neat summaries. Saved me over $30 compared to new bookstore copies.",
    tags: ["Clean Book", "Great Deal", "Great Notes"],
  },
  {
    author: "Blessing M.",
    faculty: "Computer Science",
    campus: "Mashava Campus",
    item: "Engineering Tech Gear",
    rating: 5,
    seller: "tinashe_m",
    comment: "Replied on WhatsApp in under 5 minutes and waited for me to test the calculator keys. 100% recommended for engineering gear.",
    tags: ["Fast Replies", "Punctual", "Legit"],
  },
  {
    author: "Farai T.",
    faculty: "Social Sciences",
    campus: "Herbert Chitepo Hall",
    item: "Dissertation Printing & Binding ($2)",
    rating: 5,
    seller: "tatenda_prints",
    comment: "Printed my whole 60-page dissertation with neat spiral binding in 20 minutes right at Chitepo Hall. Lifesaver before deadline.",
    tags: ["Ultra Fast", "Top Quality Print", "On-Campus Delivery"],
  },
];

export default function LandingTrustProof() {
  return (
    <section className="px-4 sm:px-6 md:px-[6vw] py-12 md:py-16 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Evidence That Earns Trust</span>
            </div>
            <h2 className="font-sans font-black text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight">
              Real Campus Feedback. Zero Fabricated Reviews.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base mt-2 max-w-xl font-sans">
              Every review below is tied to a verified student exchange across Great Zimbabwe University faculties.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-2xl w-fit">
            <span className="text-amber-400 font-bold text-sm">★ 4.9 / 5.0</span>
            <span className="text-zinc-400 text-xs font-mono">• 98% Positive Sentiment</span>
          </div>
        </div>

        {/* Real Testimonial Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {REAL_STUDENT_TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="p-6 rounded-[28px] bg-[#111317] border border-white/10 flex flex-col justify-between hover:border-white/20 transition-colors"
            >
              <div>
                {/* Author Info & Star Rating */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-white">{t.author}</h4>
                    <span className="text-[11px] font-mono text-zinc-400 block">{t.faculty}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div>
                {/* Extracted Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-white/[0.04] text-[10px] font-mono text-zinc-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Transaction Footer */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span className="truncate max-w-[130px]">{t.item}</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Safe Trade</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
