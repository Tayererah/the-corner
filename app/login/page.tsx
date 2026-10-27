"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowLeft, Mail, Lock, CheckCircle2, ShoppingBag, Tag, ArrowRight } from "lucide-react";
import { login, fetchCurrentUser, quickDemoLogin } from "@/lib/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role"); // "seller" | "customer"
  const redirectParam = searchParams.get("redirect"); // e.g. "/browse", "/sell"

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleIntent, setRoleIntent] = useState<"customer" | "seller">(
    roleParam === "seller" ? "seller" : "customer"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleRoleRedirect = (role: string) => {
    if (role === "admin") {
      setRedirectMessage("Signed in as Staff. Redirecting to System Admin...");
      setTimeout(() => router.push(redirectParam || "/admin"), 650);
    } else if (role === "seller") {
      setRedirectMessage("Signed in as Student Seller. Redirecting to your seller hub...");
      setTimeout(() => router.push(redirectParam || "/sell"), 650);
    } else {
      setRedirectMessage("Signed in as Campus Customer. Redirecting to Browse Listings...");
      setTimeout(() => router.push(redirectParam || "/browse"), 650);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const loginRes = await login(username, password);
      const user = await fetchCurrentUser();
      const detectedRole = user?.role || (user?.is_seller ? "seller" : roleIntent);
      handleRoleRedirect(detectedRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
      setIsLoading(false);
    }
  };

  const handleQuickDemo = (role: "customer" | "seller") => {
    quickDemoLogin(role);
    handleRoleRedirect(role);
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-[6vw] pt-24 sm:pt-28 pb-20 flex items-center justify-center font-sans" style={{ background: "#0b0c0e" }}>
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </Link>

        <div className="p-8 sm:p-10 rounded-[36px] bg-[#111317] border border-white/[0.08] shadow-[0_30px_90px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F0631D]/15 blur-[100px] pointer-events-none" />

          {redirectMessage ? (
            <div className="py-10 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-sans font-black text-2xl text-white uppercase">
                Welcome Back!
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm font-mono max-w-xs mx-auto">
                {redirectMessage}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono tracking-widest text-[#F0631D] uppercase mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Campus Portal</span>
                </div>
                <h1 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
                  Student Sign In
                </h1>
                <p className="text-zinc-400 text-xs sm:text-sm mt-1">
                  Sign in to browse listings or manage your seller account.
                </p>
              </div>

              {/* Destination Mode Selector */}
              <div className="mb-6">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
                  Choose Where to Go After Sign In:
                </span>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setRoleIntent("customer")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      roleIntent === "customer"
                        ? "bg-[#F0631D] text-black shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Customer (Browse)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleIntent("seller")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                      roleIntent === "seller"
                        ? "bg-emerald-400 text-black shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>Seller (List Item)</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Student Username
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. tendai_k or tinashe_m"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#F0631D] transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#F0631D] transition-all font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>
                        Sign In &amp; {roleIntent === "seller" ? "List an Item" : "Browse Listings"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Instant Quick Demo Profiles */}
              <div className="mt-8 pt-6 border-t border-white/[0.08]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2 text-center">
                  Instant One-Click Campus Sign-In:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo("customer")}
                    className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-[#F0631D] text-[10px] font-mono font-bold">
                      <ShoppingBag className="w-3 h-3" />
                      <span>Customer Sign-In</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-mono mt-0.5">Goes to /browse →</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo("seller")}
                    className="p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-left transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
                      <Tag className="w-3 h-3" />
                      <span>Seller Sign-In</span>
                    </div>
                    <div className="text-[11px] text-zinc-300 font-mono mt-0.5">Goes to /sell →</div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ background: "#0b0c0e" }} className="min-h-screen text-white flex items-center justify-center font-mono text-sm">
          Loading Sign In...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
