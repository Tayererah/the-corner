import { Suspense } from "react";
import CategoryScroll from "@/components/CategoryScroll";
import ListingsSection from "@/components/ListingsSection";
import { getListings } from "@/lib/api";
import { ShieldCheck, MapPin, CheckCircle2, ArrowLeft, PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function BrowsePage() {
  const listings = await getListings();

  return (
    <main className="min-h-screen px-4 sm:px-6 md:px-[6vw] pt-24 sm:pt-28 pb-20 font-sans" style={{ background: "#0b0c0e" }}>
      {/* Top Banner Navigation */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Landing</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
              Campus Marketplace Browse
            </h1>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-mono">
            Verified peer listings across Great Zimbabwe University faculties.
          </p>
        </div>
      </div>

      {/* Category Fast Switcher */}
      <CategoryScroll />

      {/* Main Interactive Listings Feed */}
      <Suspense
        fallback={
          <div className="py-24 text-center text-zinc-500 font-mono text-sm">
            Loading verified campus listings...
          </div>
        }
      >
        <ListingsSection initialListings={listings} />
      </Suspense>

      {/* Campus Safety & Official Meetup Zones Guide */}
      <section className="mt-16">
        <div className="rounded-[28px] sm:rounded-[36px] border border-white/[0.08] bg-gradient-to-br from-[#121418] via-[#101216] to-[#0d0f12] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F0631D]/10 blur-[120px] pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0631D]/10 border border-[#F0631D]/30 text-[#F0631D] text-xs font-mono tracking-widest uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>Safe Campus Exchange</span>
              </div>
              <h2 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight leading-tight">
                Trade in Person.<br />Zero Scams. Zero Fees.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Every trade happens peer-to-peer on campus ground. Meet your fellow student at official campus zones, test gadgets before paying, and transfer cash or EcoCash safely.
              </p>
            </div>

            {/* Recommended Meetup Spots */}
            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#F0631D] uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Main Campus</span>
                </div>
                <h3 className="font-sans font-bold text-sm text-white">Great Hall &amp; Library Quad</h3>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  High foot-traffic, open daylight hours, CCTV coverage near student administration.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#F0631D] uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Mashava Campus</span>
                </div>
                <h3 className="font-sans font-bold text-sm text-white">Mashava Security Gate</h3>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  Directly outside campus gate control and dining hall entrance.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-mono text-[#F0631D] uppercase mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Mucheke Campus</span>
                </div>
                <h3 className="font-sans font-bold text-sm text-white">Student Centre Foyer</h3>
                <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                  Central meeting point next to campus lecture blocks and cafeteria.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Campus Rule</span>
                  </div>
                  <h3 className="font-sans font-bold text-sm text-white">No Advance Deposits</h3>
                  <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
                    Inspect the textbook or gadget first. Pay in person during the handoff.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
