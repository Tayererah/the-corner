"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, PlusCircle, Search } from "lucide-react";


export default function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[620px] lg:min-h-[720px] bg-[#16171a] m-0 p-0 rounded-none border-0 overflow-hidden select-none flex flex-col justify-between"
    >
      {/* 1. Full-Bleed Top Integrated Header / Navbar (Edge-to-Edge with Zero Corners) */}
      <header className="relative z-30 w-full px-6 sm:px-10 lg:px-14 py-5 sm:py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-sans font-black text-xl sm:text-2xl tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          the corner<span style={{ color: "#F0631D" }}>.</span>
        </Link>

        {/* Navigation Links - Protected by background scrim so "SERVICES" never washes out */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-10 font-mono text-xs uppercase tracking-[0.22em] text-zinc-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <Link href="/search" className="hover:text-white transition-colors flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5" />
           Search
         </Link>
          <Link href="/#listings" className="hover:text-white transition-colors">
            Browse
          </Link>
          <Link href="/#textbooks" className="hover:text-white transition-colors">
            Textbooks
          </Link>
          <Link href="/#electronics" className="hover:text-white transition-colors">
            Electronics
          </Link>
          <Link href="/#services" className="hover:text-white transition-colors font-semibold text-zinc-200">
            Services
          </Link>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
          >
            Log in
          </Link>
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-transform hover:scale-[1.03] active:scale-[0.98] shadow-lg"
            style={{ background: "#F0631D", color: "#090a0c" }}
          >
            <PlusCircle className="w-4 h-4 text-black" />
            <span>List an item</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Full-Bleed Split Grid: Left Copy & Right Photo */}
      <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 flex-1 w-full items-stretch rounded-none m-0 p-0">
        
        {/* Left Column (6 cols): Typography & CTA Cluster */}
        <div className="lg:col-span-6 xl:col-span-6 px-6 sm:px-10 lg:pl-14 lg:pr-8 py-8 sm:py-12 flex flex-col justify-center">
          
          {/* Badge: Campus Marketplace */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-zinc-300 text-xs font-mono uppercase tracking-[0.18em] mb-6 w-fit shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F0631D] animate-pulse" />
            <span>Campus Marketplace</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[-0.035em] text-white uppercase leading-[0.94]">
            THE
            <br />
            CORNER<span style={{ color: "#F0631D" }}>.</span>
          </h1>

          {/* Subheading */}
          <h2 className="text-white font-sans font-bold text-lg sm:text-xl mt-6 tracking-tight">
            Built on campus, for campus.
          </h2>

          {/* Body Text */}
          <p className="text-zinc-300/90 font-sans text-sm sm:text-base mt-3 max-w-lg leading-relaxed">
            We don’t run from the future. We wear it. Verified student listings, peer-to-peer textbook trades, and instant campus meetups.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
            <Link
              href="/#listings"
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-[#090a0c] bg-[#F0631D] hover:bg-[#ff722a] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_24px_rgba(240,99,29,0.35)]"
            >
              <span>Browse Listings</span>
              <ArrowUpRight className="w-4 h-4 text-black stroke-[2.5]" />
            </Link>

            <Link
              href="/sell"
              className="inline-flex items-center px-6 sm:px-7 py-3.5 rounded-full font-sans text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              List an Item Free
            </Link>
          </div>

        </div>

        {/* Right Column (6 cols): The Visor Photo Canvas (Zero Corners, Edge-to-Edge) */}
        <div className="lg:col-span-6 xl:col-span-6 relative min-h-[420px] sm:min-h-[480px] lg:min-h-full overflow-hidden flex flex-col justify-end p-6 sm:p-10 lg:pr-14 rounded-none">
          
          {/* Background Image Container with Atmospheric Gradient Overlays */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-none">
            <Image
              src="/images/hero.jpg"
              alt="The Corner campaign portrait with orange visor"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={90}
              className="object-cover object-[center_center] scale-[0.85] brightness-[0.92] contrast-[1.05] rounded-none"
            />

            {/* Top Vignette Scrim - Guarantees that Header items ("SERVICES", "Log in", "+ LIST AN ITEM") are 100% crisp */}
            <div className="absolute top-0 inset-x-0 h-40 sm:h-48 bg-gradient-to-b from-[#16171a] via-[#16171a]/75 to-transparent pointer-events-none rounded-none" />

            {/* Left Edge Seamless Blend - Fades smoothly into the dark card left panel */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-52 bg-gradient-to-r from-[#16171a] via-[#16171a]/65 to-transparent pointer-events-none rounded-none" />

            {/* Bottom Vignette - Smooth grounding into section transition */}
            <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#16171a]/95 via-[#16171a]/50 to-transparent pointer-events-none rounded-none" />
          </div>

          {/* Overlaid Typography at Bottom of Photo */}
          <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mt-auto pt-16">
            
            {/* Manifesto Quote (Bottom Left of photo) */}
            <div className="max-w-xs font-sans text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              <h3 className="font-bold text-xs sm:text-sm tracking-wider uppercase text-white">
                Noise Off.
                <br />
                Focus On.
              </h3>
              <p className="text-[11px] sm:text-xs text-zinc-300/90 mt-1.5 leading-relaxed font-normal">
                We don’t run from the future.
                <br />
                We wear it.
                <br />
                No fear. No doubts. Just vision.
                <br />
                One breath. One step. Forward.
              </p>
            </div>

            {/* University / Campus Tag (Bottom Right of photo) */}
            <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-zinc-400 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              Great Zimbabwe University
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}