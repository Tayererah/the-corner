"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, BookOpen, Laptop, Shirt, Sparkles } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    label: "Textbooks",
    subLabel: "Past papers, law, B.Com, notes",
    href: "textbooks",
    categoryFilter: "Textbooks",
    img: "/images/hero-student.jpg",
    icon: BookOpen,
    count: "420+ items",
    gradientBg: "from-[#382b13] via-[#6e5323] to-[#1c1509]",
    glowColor: "rgba(234, 179, 8, 0.25)",
    btnStyle: "bg-amber-400/20 hover:bg-amber-400/35 text-amber-200 border-amber-400/30",
  },
  {
    label: "Electronics",
    subLabel: "Calculators, laptops, chargers, phones",
    href: "electronics",
    categoryFilter: "Electronics",
    img: "/images/cat-electronics.jpg",
    icon: Laptop,
    count: "190+ items",
    gradientBg: "from-[#1c2433] via-[#2f3e58] to-[#111620]",
    glowColor: "rgba(96, 165, 250, 0.25)",
    btnStyle: "bg-blue-400/20 hover:bg-blue-400/35 text-blue-200 border-blue-400/30",
  },
  {
    label: "Clothing",
    subLabel: "Hoodies, varsity wear, formals, kicks",
    href: "clothing",
    categoryFilter: "Clothing",
    img: "/images/cat-clothing.jpg",
    icon: Shirt,
    count: "280+ items",
    gradientBg: "from-[#13302c] via-[#214d46] to-[#0d1f1c]",
    glowColor: "rgba(56, 189, 168, 0.28)",
    btnStyle: "bg-emerald-400/20 hover:bg-emerald-400/35 text-emerald-200 border-emerald-400/30",
  },
  {
    label: "Services",
    subLabel: "Tutoring, printing, hair, laundry",
    href: "services",
    categoryFilter: "Services",
    img: "/images/cat-services.jpg",
    icon: Sparkles,
    count: "160+ gigs",
    gradientBg: "from-[#271938] via-[#4d326e] to-[#130b1c]",
    glowColor: "rgba(168, 85, 247, 0.25)",
    btnStyle: "bg-purple-400/20 hover:bg-purple-400/35 text-purple-200 border-purple-400/30",
  },
];

export default function CategoryScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollTrackRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollTrackRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollTrackRef.current) {
      const amount = direction === "left" ? -320 : 320;
      scrollTrackRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll(".cat-item");
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: 32, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    checkScroll();

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="px-4 sm:px-6 md:px-[6vw] py-14 select-none">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-[#F0631D] uppercase mb-1">
            <span>Explore Campus Stashes</span>
          </div>
          <h2 className="font-sans font-black text-2xl sm:text-3xl md:text-4xl tracking-tight text-white uppercase">
            Shop by Category
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-lg">
            Verified listings with instant peer hand-offs in Mashava, Mucheke, and Main Campus.
          </p>
        </div>

        {/* Desktop Carousel Navigation Controls */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2.5 rounded-full border transition-all ${
              canScrollLeft
                ? "bg-white/[0.08] hover:bg-white/[0.15] border-white/15 text-white cursor-pointer"
                : "bg-white/[0.02] border-white/5 text-zinc-600 cursor-not-allowed"
            }`}
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2.5 rounded-full border transition-all ${
              canScrollRight
                ? "bg-white/[0.08] hover:bg-white/[0.15] border-white/15 text-white cursor-pointer"
                : "bg-white/[0.02] border-white/5 text-zinc-600 cursor-not-allowed"
            }`}
            aria-label="Scroll categories right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div
        ref={scrollTrackRef}
        onScroll={checkScroll}
        className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.label}
              href={`/category/${cat.href}`}
              id={cat.href}
              className="cat-item group relative shrink-0 w-[260px] sm:w-[280px] md:w-[300px] aspect-[3/4.2] rounded-[32px] overflow-hidden border border-white/[0.08] bg-[#101215] cursor-pointer transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_26px_50px_-10px_rgba(0,0,0,0.8)]"
              style={{ boxShadow: `0 16px 36px -10px ${cat.glowColor}` }}
            >
              {/* Card Gradient Base */}
              <div
                className={`absolute inset-0 bg-gradient-to-b ${cat.gradientBg} opacity-90 group-hover:opacity-100 transition-opacity`}
              />
              
              {/* Radial Glow */}
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: cat.glowColor }}
              />

              {/* Photo & Shading */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  sizes="320px"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none opacity-50 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c]/95 via-[#090a0c]/50 to-transparent pointer-events-none" />
              </div>

              {/* Foreground Card Content */}
              <div className="relative z-10 w-full h-full flex flex-col justify-between p-6">
                
                {/* Top: Icon Badge & Count */}
                <div className="flex items-center justify-between w-full">
                  <div className="p-2 rounded-xl bg-black/40 border border-white/10 text-white backdrop-blur-md">
                    <Icon className="w-4 h-4 text-[#F0631D]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-black/50 text-zinc-200 backdrop-blur-md border border-white/10">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom: Title & Action */}
                <div className="w-full flex flex-col items-center text-center">
                  <div className="mb-4 max-w-[220px]">
                    <h3 className="font-sans font-black text-lg sm:text-xl text-white uppercase tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                      {cat.label}
                    </h3>
                    <p className="text-[11px] text-zinc-300 mt-1 line-clamp-1">
                      {cat.subLabel}
                    </p>
                  </div>

                  <div
                    className={`w-full max-w-[200px] py-2.5 px-5 rounded-full font-semibold text-xs tracking-wide backdrop-blur-md border transition-all duration-200 flex items-center justify-center gap-2 group-hover:scale-[1.03] active:scale-[0.98] ${cat.btnStyle}`}
                  >
                    <span>Browse category</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}