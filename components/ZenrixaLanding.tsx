"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Sparkles,
  X,
  MapPin,
  CheckCircle2,
  Lock,
  Pause,
  Play
} from "lucide-react";
import { quickDemoLogin, isAuthenticated, fetchCurrentUser } from "@/lib/auth";

interface SlideData {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  glowColor: string;
  badge: string;
  category: string;
  isTransparent?: boolean;
}

const SLIDES: SlideData[] = [
  {
    id: "model",
    tag: "Campus Identity",
    title: "Design to explore.",
    subtitle: "We start from zero, delivering only what matters for Great Zimbabwe University.",
    image: "/hero-model-transparent.png",
    glowColor: "rgba(234, 88, 12, 0.45)",
    badge: "Student Stash",
    category: "Campus Identity",
    isTransparent: true,
  },
  {
    id: "iphone",
    tag: "Apple & Verified Tech",
    title: "iPhone 17 Pro.",
    subtitle: "Cosmic orange titanium, ProMotion retina, and verified student hardware.",
    image: "/slides/slide-iphone.png",
    glowColor: "rgba(255, 106, 0, 0.5)",
    badge: "Tech Vault",
    category: "Electronics",
    isTransparent: false,
  },
  {
    id: "sneaker",
    tag: "Concept Footwear",
    title: "Concept Lab Kicks.",
    subtitle: "Deadstock kicks, high-top court silhouettes, and varsity drops.",
    image: "/slides/slide-sneaker.png",
    glowColor: "rgba(255, 255, 255, 0.25)",
    badge: "Streetwear",
    category: "Clothing & Kicks",
    isTransparent: false,
  },
  {
    id: "airpods",
    tag: "Audio & Acoustics",
    title: "AirPods Pro Matte.",
    subtitle: "Up to 20h ANC audio for late-night quad study and lecture playback.",
    image: "/slides/slide-airpods.png",
    glowColor: "rgba(180, 180, 195, 0.35)",
    badge: "New Arrival",
    category: "Audio",
    isTransparent: false,
  },
  {
    id: "runner",
    tag: "Performance Gear",
    title: "Nike Zoom Runner.",
    subtitle: "Track speed trainers and athletic varsity gear direct from student athletes.",
    image: "/slides/slide-runner.png",
    glowColor: "rgba(240, 99, 29, 0.5)",
    badge: "Athletics",
    category: "Sport & Varsity",
    isTransparent: false,
  },
  {
    id: "crocs",
    tag: "Dorm Essentials",
    title: "Glow Classic Clog.",
    subtitle: "Dorm slip-ons, relaxed slides, and daily campus living comfort.",
    image: "/slides/slide-crocs.png",
    glowColor: "rgba(255, 85, 0, 0.55)",
    badge: "Campus Daily",
    category: "Casuals",
    isTransparent: false,
  },
];

export default function ZenrixaLanding() {
  const router = useRouter();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleSignInClick = async (roleIntent?: "customer" | "seller") => {
    if (roleIntent) {
      setShowSignInModal(false);
      if (isAuthenticated()) {
        router.push(roleIntent === "seller" ? "/sell" : "/browse");
      } else {
        router.push(`/login?role=${roleIntent}&redirect=${encodeURIComponent(roleIntent === "seller" ? "/sell" : "/browse")}`);
      }
      return;
    }

    if (isAuthenticated()) {
      const user = await fetchCurrentUser();
      if (user?.role === "seller" || user?.is_seller) {
        router.push("/sell");
      } else if (user?.is_staff) {
        router.push("/admin");
      } else {
        router.push("/browse");
      }
      return;
    }

    setShowSignInModal(true);
  };

  const current = SLIDES[activeSlide];

  return (
    <div className="relative min-h-screen w-full bg-[#d6d7dc] text-[#121316] font-sans overflow-x-hidden flex flex-col justify-between select-none">
      
      {/* ==================== 1. TOP NAVBAR (CLEAN EDITORIAL HEADER) ==================== */}
      <header className="relative z-30 w-full px-6 sm:px-12 md:px-16 pt-6 sm:pt-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-black flex items-center justify-center text-white font-black text-xs">
            C
          </div>
          <span className="font-sans font-bold text-lg sm:text-xl tracking-tight text-black">
            The Corner<span className="text-[#ea580c]">.</span>
          </span>
        </Link>

        {/* Top Right: Sign In Button Only */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSignInClick()}
            className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Sign In</span>
          </button>
        </div>
      </header>

      {/* ==================== 2. MAIN HERO SECTION ==================== */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 py-4 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* ==================== LEFT COLUMN: HEADLINE & ACTIONS ==================== */}
        <div className="w-full lg:w-4/12 z-20 pt-2 lg:pt-0">
          
          {/* Subtle Category Kicker */}
          <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3 flex items-center gap-1.5">
            <span className="text-zinc-400 font-bold">|</span>
            <span>Campus Marketplace</span>
          </div>

          {/* Huge Editorial Headline */}
          <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-[62px] text-black tracking-[-0.04em] leading-[0.94] mb-5">
            We start from zero, delivering only what matters.
          </h1>

          {/* Social Proof Stars */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex text-[#ea580c]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-[#ea580c]" />
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-600 font-semibold">
              1400+ Students
            </span>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSignInClick()}
              className="px-7 sm:px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold bg-black text-white hover:bg-zinc-800 transition-all flex items-center gap-3 shadow-md group active:scale-95 cursor-pointer"
            >
              <span>Sign In to Continue</span>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black group-hover:translate-x-0.5 transition-transform">
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </button>
          </div>

        </div>

        {/* ==================== CENTER: INTERACTIVE EDITORIAL IMAGE SLIDER ==================== */}
        <div
          className="relative w-full lg:w-5/12 flex flex-col items-center justify-center min-h-[460px] sm:min-h-[540px] my-4 lg:my-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* Subtle Ambient Studio Halo Glow matching active slide */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full blur-[90px] pointer-events-none transition-colors duration-1000"
            style={{ backgroundColor: current.glowColor }}
          />

          {/* Background Huge Typographic Watermark (Matching Zenrixa exact layout) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full text-center select-none pointer-events-none z-0">
            <span
              className="font-sans font-black tracking-[-0.04em] uppercase text-transparent leading-none inline-block scale-y-110"
              style={{
                fontSize: "clamp(4.2rem, 13vw, 11rem)",
                WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.75)",
                textShadow: "0 2px 20px rgba(0,0,0,0.03)",
              }}
            >
              THE CORNER
            </span>
          </div>

          {/* Floating Editorial Poster Carousel Card */}
          <div className="relative z-10 w-full max-w-[340px] sm:max-w-[390px] md:max-w-[420px] aspect-[723/1024] flex items-center justify-center rounded-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.3)] border border-white/20 bg-[#121316] group">
            
            {/* The Slide Images */}
            {SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-out flex items-center justify-center ${
                  index === activeSlide
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 640px) 100vw, 420px"
                  className={slide.isTransparent ? "object-contain p-2 drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]" : "object-cover"}
                />
              </div>
            ))}

            {/* Top Slide Category Pill */}
            <div className="absolute top-4 left-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c] animate-pulse" />
              <span>{current.badge}</span>
            </div>

            {/* Slide Index Badge */}
            <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-300">
              0{activeSlide + 1} / 0{SLIDES.length}
            </div>

            {/* Floating Carousel Navigation Arrow Buttons on Image */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Bottom Gradient Overlay on Image with Caption */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-20 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#ea580c] block">
                  {current.category}
                </span>
                <span className="font-sans font-bold text-sm sm:text-base text-white block">
                  {current.title}
                </span>
              </div>

              {/* Pause / Play Indicator */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-3 h-3 ml-0.5" /> : <Pause className="w-3 h-3" />}
              </button>
            </div>

          </div>

          {/* Interactive Slide Dot / Progress Line below image */}
          <div className="relative z-10 flex items-center gap-2 mt-4">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActiveSlide(i)}
                aria-label={`Jump to slide ${i + 1}: ${slide.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === activeSlide
                    ? "w-8 bg-black shadow-sm"
                    : "w-2 bg-black/25 hover:bg-black/50"
                }`}
              />
            ))}
          </div>

        </div>

        {/* ==================== RIGHT COLUMN: SYNCHRONIZED WIDGET & CAMPUSES ==================== */}
        <div className="w-full lg:w-3/12 z-20 flex flex-col items-start lg:items-end justify-between space-y-6">
          
          {/* Top Floating Sleek Dark Widget (Synchronized with Active Slide) */}
          <div className="w-full max-w-[280px] p-5 rounded-[26px] bg-[#121316] text-white border border-black/10 shadow-xl relative overflow-hidden group">
            
            <div className="flex items-center justify-between mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-white">
                π
              </div>
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                {current.tag}
              </span>
            </div>

            <h3 className="font-sans font-bold text-lg text-white mb-1 transition-all">
              {current.title}
            </h3>

            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-sans min-h-[48px]">
              {current.subtitle}
            </p>

            {/* Slider bar & navigation arrow pills */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeSlide ? "w-6 bg-white" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevSlide}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Previous card slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  aria-label="Next card slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Lower Right: "Our Campuses" / Partners */}
          <div className="text-left lg:text-right space-y-2 pt-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
              Our Campuses
            </span>
            <div className="flex flex-wrap lg:justify-end items-center gap-4 text-xs font-mono font-bold text-zinc-700 tracking-wider uppercase">
              <span className="hover:text-black transition-colors">Main Quad</span>
              <span>•</span>
              <span className="hover:text-black transition-colors">Mashava</span>
              <span>•</span>
              <span className="hover:text-black transition-colors">Mucheke</span>
              <span>•</span>
              <span className="hover:text-black transition-colors">Chitepo</span>
            </div>
          </div>

        </div>

      </main>

      {/* ==================== 3. BOTTOM FLOATING DOCK BAR ==================== */}
      <footer className="relative z-30 w-full px-6 sm:px-12 md:px-16 pb-6 pt-2">
        <div className="max-w-5xl mx-auto rounded-full bg-[#121316]/90 backdrop-blur-md text-white py-3 px-6 sm:px-8 border border-white/10 shadow-xl flex items-center justify-between text-[11px] font-mono tracking-wider">
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>• 1,400+ Active Students</span>
          </div>

          <div className="hidden sm:block text-zinc-400">
            • Based in Masvingo, GZU
          </div>

          <button
            onClick={() => handleSignInClick()}
            className="text-zinc-300 hover:text-white flex items-center gap-1 transition-colors group cursor-pointer"
          >
            <span>• Sign In to Enter</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </footer>

      {/* ==================== 4. SIMPLE SIGN-IN ROLE DISPATCH MODAL ==================== */}
      {showSignInModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-[32px] bg-[#121316] text-white p-7 border border-white/10 shadow-2xl relative">
            
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-zinc-300 uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Campus Access</span>
            </div>

            <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white mb-2">
              Sign In to Continue
            </h3>
            
            <p className="text-zinc-400 text-xs leading-relaxed mb-6">
              Choose your campus destination to continue to The Corner.
            </p>

            <div className="space-y-3">
              {/* Customer / Browse Choice */}
              <button
                onClick={() => handleSignInClick("customer")}
                className="w-full p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-[#ea580c] group-hover:text-black transition-colors">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">I want to Browse</span>
                    <span className="text-[11px] font-mono text-zinc-400">Shop campus verified listings</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>

              {/* Seller / Post Item Choice */}
              <button
                onClick={() => handleSignInClick("seller")}
                className="w-full p-4 rounded-2xl bg-[#ea580c]/10 hover:bg-[#ea580c]/20 border border-[#ea580c]/30 text-left transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#ea580c] flex items-center justify-center text-black">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-white block">I want to Sell</span>
                    <span className="text-[11px] font-mono text-zinc-400">Post an item &amp; manage catalog</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#ea580c] group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <Link
                href="/login"
                className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
              >
                Standard Student Log In →
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
