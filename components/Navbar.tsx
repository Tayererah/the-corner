"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { PlusCircle, Menu, X, Sparkles, LogOut, User, Store, BellRing } from "lucide-react";
import { fetchCurrentUser, logout } from "@/lib/auth";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    role: "admin" | "seller" | "customer";
    is_seller?: boolean;
    is_staff?: boolean;
  } | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchCurrentUser().then((u) => {
      setCurrentUser(u);
      if (u?.username) {
        fetch(`/api/notifications?seller=${encodeURIComponent(u.username)}`)
          .then((res) => res.json())
          .then((data) => {
            const pending = (data.notifications || []).filter((n: { status: string }) => n.status === "pending").length;
            setUnreadCount(pending);
          })
          .catch(() => {});
      }
    });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not render global navbar on the minimalist landing page or admin console
  if (pathname === "/" || pathname.startsWith("/admin")) {
    return null;
  }

  // Identify whether on Seller Platform or Customer Marketplace
  const isSellerRoute = pathname === "/sell" || pathname === "/my-listings";
  const isCustomerBrowsing =
    pathname.startsWith("/browse") ||
    pathname.startsWith("/category") ||
    pathname.startsWith("/search") ||
    pathname.startsWith("/listings") ||
    pathname.startsWith("/favorites");

  const isSellerPlatform = isSellerRoute || (currentUser?.role === "seller" && !isCustomerBrowsing);

  const handleSignOut = () => {
    logout();
    setCurrentUser(null);
    router.push(isSellerPlatform ? "/login?role=seller" : "/login?role=customer");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#090a0c]/95 backdrop-blur-xl border-b border-white/[0.08] py-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          : "bg-gradient-to-b from-[#090a0c]/80 via-[#090a0c]/40 to-transparent py-5 sm:py-6"
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-[6vw] max-w-7xl mx-auto w-full">
        {/* Brand Logo & Platform Scope Indicator */}
        <div className="flex items-center gap-3">
          <Link
            href={isSellerPlatform ? "/my-listings" : "/browse"}
            className="font-sans font-black text-xl sm:text-2xl tracking-tighter text-white hover:opacity-90 transition-opacity flex items-center"
          >
            <span>the corner</span>
            <span className="text-[#F0631D] text-3xl leading-none">.</span>
          </Link>

          {isSellerPlatform ? (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0631D]/15 border border-[#F0631D]/30 text-[10px] font-mono tracking-widest text-[#F0631D] uppercase">
              <Store className="w-3 h-3" />
              <span></span>
            </div>
          ) : (
            <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0631D] animate-pulse" />
              <span></span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 1. SELLER PLATFORM NAVIGATION: Register, Sign In, List Item, My Listings Only */}
        {/* ========================================================================= */}
        {isSellerPlatform ? (
          <>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/browse"
                className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                
              </Link>
            </div>

            {/* Seller Action Controls (Matching Picture 2) */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/my-listings"
                className={`text-xs font-mono uppercase tracking-wider px-3.5 py-2 rounded-full transition-colors relative flex items-center gap-1.5 ${
                  pathname === "/my-listings"
                    ? "text-[#F0631D] bg-white/[0.08]"
                    : "text-zinc-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                <span>My Listings</span>
                {unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#F0631D] text-black text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-2 pl-1 border-l border-white/10">
                  <span className="text-xs font-mono text-zinc-400">
                    @{currentUser.username}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-mono text-zinc-400 hover:text-red-400 p-2 rounded-full hover:bg-white/[0.05] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login?role=seller"
                    className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/[0.05]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register?role=seller"
                    className="text-xs font-semibold text-zinc-300 hover:text-white transition-colors px-3 py-2 rounded-full hover:bg-white/[0.05]"
                  >
                    Register
                  </Link>
                </div>
              )}

              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_20px_rgba(240,99,29,0.35)]"
              >
                <PlusCircle className="w-4 h-4 text-black stroke-[2.5]" />
                <span>List an Item</span>
              </Link>
            </div>
          </>
        ) : (
          /* ========================================================================= */
          /* 2. CUSTOMER SIDE NAVIGATION: Picture 1 Only (AI SEARCH, BROWSE, CATEGORIES) */
          /* No "My Listings" and No "List an Item" on Customer Side!                  */
          /* ========================================================================= */
          <>
            {/* Desktop Navigation Links (EXACT PICTURE 1) */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              <Link
                href="/search"
                className="text-[#F0631D] hover:text-white transition-colors py-1 flex items-center gap-1.5 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Search</span>
              </Link>
              <Link
                href="/browse"
                className={`transition-colors py-1 hover:text-white ${
                  pathname === "/browse" ? "text-white font-bold border-b-2 border-[#F0631D]" : "hover:border-b-2 hover:border-[#F0631D]"
                }`}
              >
                Browse
              </Link>
              <Link
                href="/category/textbooks"
                className={`transition-colors py-1 hover:text-white ${
                  pathname === "/category/textbooks" ? "text-white font-bold border-b-2 border-[#F0631D]" : "hover:border-b-2 hover:border-[#F0631D]"
                }`}
              >
                Textbooks
              </Link>
              <Link
                href="/category/electronics"
                className={`transition-colors py-1 hover:text-white ${
                  pathname === "/category/electronics" ? "text-white font-bold border-b-2 border-[#F0631D]" : "hover:border-b-2 hover:border-[#F0631D]"
                }`}
              >
                Electronics
              </Link>
              <Link
                href="/category/clothing"
                className={`transition-colors py-1 hover:text-white ${
                  pathname === "/category/clothing" ? "text-white font-bold border-b-2 border-[#F0631D]" : "hover:border-b-2 hover:border-[#F0631D]"
                }`}
              >
                Clothing
              </Link>
              <Link
                href="/category/services"
                className={`transition-colors py-1 hover:text-white ${
                  pathname === "/category/services" ? "text-white font-bold border-b-2 border-[#F0631D]" : "hover:border-b-2 hover:border-[#F0631D]"
                }`}
              >
                Services
              </Link>
            </nav>

            {/* Customer Auth Actions (Strictly Picture 1 Only - NO "My Listings", NO "List an Item") */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/sell"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_4px_20px_rgba(240,99,29,0.35)]"
              >
                <PlusCircle className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                <span>Sell</span>
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-300 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#F0631D]" />
                    <span>@{currentUser.username}</span>
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-xs font-mono text-zinc-400 hover:text-red-400 p-2 rounded-full hover:bg-white/[0.05] transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login?role=customer"
                    className="text-xs sm:text-sm font-semibold text-zinc-300 hover:text-white transition-colors px-3.5 py-2 rounded-full hover:bg-white/[0.05]"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register?role=customer"
                    className="text-xs font-mono uppercase tracking-wider text-black bg-white hover:bg-zinc-200 transition-colors px-4 py-2 rounded-full font-bold shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </>
        )}

        {/* Mobile Menu Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {isSellerPlatform && (
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black bg-[#F0631D]"
            >
              <PlusCircle className="w-3.5 h-3.5 text-black" />
              <span>List</span>
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090a0c]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 pb-2 border-b border-white/[0.06] text-xs font-mono text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-[#F0631D]" />
            <span>{isSellerPlatform ? "SELLER PLATFORM" : "CAMPUS MARKETPLACE"}</span>
          </div>

          {isSellerPlatform ? (
            /* Mobile Seller Links */
            <div className="flex flex-col gap-3">
              <Link
                href="/my-listings"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white py-2"
              >
                My Listings
              </Link>
              <Link
                href="/sell"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 text-xs font-bold uppercase tracking-wider rounded-full text-black bg-[#F0631D]"
              >
                List an Item
              </Link>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {currentUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-center py-2 text-xs font-mono text-red-400 border border-red-500/20 rounded-full"
                  >
                    Sign Out (@{currentUser.username})
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login?role=seller"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-xs font-mono text-zinc-300 border border-white/10 rounded-full"
                    >
                      Sign In as Seller
                    </Link>
                    <Link
                      href="/register?role=seller"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-xs font-mono text-zinc-300 border border-white/10 rounded-full"
                    >
                      Register as Seller
                    </Link>
                  </>
                )}
                <Link
                  href="/browse"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-[11px] font-mono text-zinc-400 hover:text-white"
                >
                  Switch to Customer Marketplace →
                </Link>
              </div>
            </div>
          ) : (
            /* Mobile Customer Links (Picture 1 Only) */
            <div className="flex flex-col gap-2.5">
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-[#F0631D] hover:text-white py-2 flex items-center gap-2 font-bold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Search</span>
              </Link>
              <Link
                href="/browse"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white py-2"
              >
                Browse All Items
              </Link>
              <Link
                href="/category/textbooks"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white py-2"
              >
                Textbooks
              </Link>
              <Link
                href="/category/electronics"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white py-2"
              >
                Electronics
              </Link>
              <Link
                href="/category/clothing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white py-2"
              >
                Clothing
              </Link>
              <Link
                href="/category/services"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-mono uppercase tracking-widest text-zinc-200 hover:text-white py-2"
              >
                Services
              </Link>
              <Link
                href="/sell"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-bold uppercase tracking-wider rounded-full text-black bg-[#F0631D]"
              >
                List an Item (Sell)
              </Link>

              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                {currentUser ? (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full text-center py-2 text-xs font-mono text-red-400 border border-red-500/20 rounded-full"
                  >
                    Sign Out (@{currentUser.username})
                  </button>
                ) : (
                  <>
                    <Link
                      href="/login?role=customer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-xs font-mono text-white border border-white/20 rounded-full"
                    >
                      Customer Log In
                    </Link>
                    <Link
                      href="/register?role=customer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-2 text-xs font-mono text-black bg-white font-bold rounded-full"
                    >
                      Customer Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
