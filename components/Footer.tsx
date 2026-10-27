"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Hide global consumer footer on landing page and admin dashboard
  if (pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full bg-[#090a0c] pt-12 md:pt-16 pb-12 md:pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans border-t border-white/[0.06]">

      <div className="relative w-full max-w-6xl rounded-[28px] sm:rounded-[36px] md:rounded-[42px] bg-[#0c0d0f] text-white border border-white/[0.06] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">

        <div className="pt-10 sm:pt-14 md:pt-16 px-8 sm:px-12 md:px-16 pb-0">

          <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-16">

            <div className="max-w-xs space-y-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white uppercase">
                THE CORNER<span style={{ color: "#F0631D" }}>.</span>
              </h2>
              <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed font-normal">
                Built on campus, for campus. Direct student-to-student exchange, verified listings, and safe campus meetups across Great Zimbabwe University.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 lg:gap-14 text-left">

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-white font-mono uppercase tracking-wider">Marketplace</h3>
                <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-400">
                  <li><Link href="/browse" className="hover:text-white transition-colors">Browse listings</Link></li>
                  <li><Link href="/category/textbooks" className="hover:text-white transition-colors">Textbooks</Link></li>
                  <li><Link href="/category/electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                  <li><Link href="/category/clothing" className="hover:text-white transition-colors">Clothing</Link></li>
                  <li><Link href="/category/services" className="hover:text-white transition-colors">Campus Services</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-white font-mono uppercase tracking-wider">Seller Platform</h3>
                <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-400">
                  <li><Link href="/sell" className="hover:text-white transition-colors">List an item</Link></li>
                  <li><Link href="/my-listings" className="hover:text-white transition-colors">My Listings</Link></li>
                  <li><Link href="/login?role=seller" className="hover:text-white transition-colors">Seller Sign In</Link></li>
                  <li><Link href="/register?role=seller" className="hover:text-white transition-colors">Seller Register</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-white font-mono uppercase tracking-wider">Customer</h3>
                <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-400">
                  <li><Link href="/login?role=customer" className="hover:text-white transition-colors">Student Log in</Link></li>
                  <li><Link href="/register?role=customer" className="hover:text-white transition-colors">Create Account</Link></li>
                  <li><Link href="/favorites" className="hover:text-white transition-colors">Saved items</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-white font-mono uppercase tracking-wider">Campuses</h3>
                <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-400">
                  <li><Link href="/#listings?cat=All" className="hover:text-white transition-colors">Main Campus Quad</Link></li>
                  <li><Link href="/#listings?cat=All" className="hover:text-white transition-colors">Mashava Campus</Link></li>
                  <li><Link href="/#listings?cat=All" className="hover:text-white transition-colors">Mucheke Campus</Link></li>
                  <li><Link href="/#listings?cat=All" className="hover:text-white transition-colors">Herbert Chitepo</Link></li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-medium text-white font-mono uppercase tracking-wider">Trust</h3>
                <ul className="space-y-2 text-xs sm:text-[13px] text-zinc-400">
                  <li><span className="text-zinc-400">Zero Trading Fees</span></li>
                  <li><span className="text-zinc-400">Verified Students</span></li>
                  <li><span className="text-zinc-400">Safe Meetup Zones</span></li>
                </ul>
              </div>

            </div>
          </div>

          <div className="mt-14 sm:mt-20 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-zinc-400 text-xs sm:text-[13px]">
            <div>©{currentYear} The Corner. All rights reserved.</div>
            <div>Great Zimbabwe University • Built for campus</div>
          </div>

        </div>

        <div className="relative w-full mt-4 sm:mt-6 overflow-hidden flex justify-center pointer-events-none select-none">

          <div className="absolute bottom-0 w-3/4 h-28 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: "#F0631D" }} />

          <span
            className="font-sans font-black tracking-tighter uppercase leading-[0.78] translate-y-3 sm:translate-y-5 md:translate-y-7 text-transparent bg-clip-text bg-gradient-to-b from-[#3a1a0d] via-[#F0631D] to-[#5c2c14]"
            style={{
              fontSize: "clamp(3.8rem, 16vw, 15.5rem)",
              letterSpacing: "-0.04em",
            }}
          >
            THE CORNER
          </span>
        </div>

      </div>

      <div
        className="relative w-full max-w-5xl overflow-hidden flex justify-center pointer-events-none select-none opacity-20 blur-[1px] -mt-1 scale-y-[-1]"
        aria-hidden="true"
      >
        <span
          className="font-sans font-black tracking-tighter uppercase leading-[0.78] text-transparent bg-clip-text bg-gradient-to-t from-transparent via-[#6b3319] to-transparent"
          style={{
            fontSize: "clamp(3.8rem, 16vw, 15.5rem)",
            letterSpacing: "-0.04em",
          }}
        >
          THE CORNER
        </span>
      </div>

    </footer>
  );
}