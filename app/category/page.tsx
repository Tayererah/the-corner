import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { getAllCategories } from "@/lib/categories";

export const metadata = {
  title: "Shop by Category | GZU Campus Marketplace — The Corner",
  description: "Browse verified campus stashes across Textbooks, Electronics, Clothing, and Student Services.",
};

export default function AllCategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="min-h-screen text-white bg-[#090a0c] pt-24 sm:pt-28 pb-20 px-4 sm:px-6 md:px-[6vw]">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-[#F0631D] font-semibold">All Categories</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono tracking-widest text-[#F0631D] uppercase bg-[#F0631D]/10 border border-[#F0631D]/20 mb-3">
              <Sparkles className="w-3 h-3" />
              <span>GZU Campus Stashes</span>
            </div>
            <h1 className="font-sans font-black text-3xl sm:text-5xl uppercase tracking-tight">
              Shop by Category
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-xl">
              Explore specialized campus stashes. Instant peer-to-peer hand-offs in Mashava, Mucheke, and Main Campus.
            </p>
          </div>
        </div>

        {/* Categories Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative rounded-[32px] sm:rounded-[40px] overflow-hidden border border-white/[0.08] bg-[#111317] p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
              style={{ boxShadow: `0 14px 40px -10px ${cat.glowColor}` }}
            >
              {/* Gradient & Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradientBg} opacity-85 group-hover:opacity-100 transition-opacity`} />
              <div
                className="absolute top-1/4 right-1/4 w-60 h-60 rounded-full blur-[100px] pointer-events-none"
                style={{ backgroundColor: cat.glowColor }}
              />

              {/* Photo Backdrop */}
              <div className="absolute right-0 top-0 bottom-0 w-2/5 opacity-30 group-hover:opacity-40 transition-opacity pointer-events-none">
                <Image
                  src={cat.heroImage}
                  alt={cat.name}
                  fill
                  sizes="400px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#111317] via-[#111317]/50 to-transparent" />
              </div>

              {/* Top Row: Meta Badge & Count */}
              <div className="relative z-10 flex items-center justify-between mb-8">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/15">
                  Verified Stash
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F0631D] text-black">
                  {cat.itemCountEstimate}
                </span>
              </div>

              {/* Middle: Content */}
              <div className="relative z-10 max-w-md">
                <h2 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight group-hover:text-[#F0631D] transition-colors mb-2">
                  {cat.name}
                </h2>
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {cat.description}
                </p>

                {/* Subcategory Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {cat.subcategories.slice(1, 5).map((sub) => (
                    <span
                      key={sub.id}
                      className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.08] text-zinc-300 border border-white/10"
                    >
                      {sub.name}
                    </span>
                  ))}
                  {cat.subcategories.length > 5 && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.04] text-zinc-400">
                      +{cat.subcategories.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom: Action Button */}
              <div className="relative z-10 pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
                  Explore {cat.shortName}
                </span>
                <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-[#F0631D] text-white group-hover:text-black flex items-center justify-center transition-all group-hover:scale-110">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Safety Protocol */}
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
        </div>

      </div>
    </div>
  );
}
