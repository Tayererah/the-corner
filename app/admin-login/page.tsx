"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  AlertTriangle,
  Info,
  CheckCircle2
} from "lucide-react";
import { adminLogin, fetchCurrentUser, getAccessToken } from "@/lib/auth";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const unauthorizedParam = searchParams.get("error") === "unauthorized";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    unauthorizedParam ? "Access Restricted: You must authenticate with an authorized staff account to access /admin." : null
  );
  const [checkingExistingSession, setCheckingExistingSession] = useState(true);

  // Check if current user is already an authenticated staff member
  useEffect(() => {
    let mounted = true;
    const token = getAccessToken();
    if (!token) {
      setCheckingExistingSession(false);
      return;
    }

    fetchCurrentUser().then((user) => {
      if (!mounted) return;
      if (user && (user.is_staff || user.role === "admin")) {
        router.replace("/admin");
      } else {
        setCheckingExistingSession(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      await adminLogin(username, password);

      // Verify server-side via /api/me/ (NEVER trust localStorage)
      const user = await fetchCurrentUser();
      if (!user || (!user.is_staff && user.role !== "admin")) {
        setErrorMessage("Access Denied: Staff authorization required. Non-staff accounts are restricted from accessing system administration.");
        setLoading(false);
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setErrorMessage((err as Error).message || "Authentication failed. Staff credentials required.");
      setLoading(false);
    }
  }

  function fillPreset(u: string, p: string) {
    setUsername(u);
    setPassword(p);
    setErrorMessage(null);
  }

  if (checkingExistingSession) {
    return (
      <div style={{ background: "#090a0c" }} className="min-h-screen text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F0631D] animate-ping" />
          <span className="text-zinc-400">Verifying security session...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#090a0c" }} className="min-h-screen text-white flex flex-col justify-between px-4 py-10 font-sans">
      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Campus Marketplace</span>
        </Link>
        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Internal Restricted URL
        </span>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="p-8 sm:p-10 rounded-[32px] bg-[#111317] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-[#F0631D]/15 blur-3xl pointer-events-none" />

          {/* Badge & Title */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-mono tracking-widest uppercase mb-4">
            <Lock className="w-3 h-3 text-red-400" />
            <span>Staff Administration Gateway</span>
          </div>

          <h1 className="font-sans font-black text-2xl sm:text-3xl text-white uppercase tracking-tight">
            System Admin Login
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 leading-relaxed font-sans">
            Authentication portal for Great Zimbabwe University staff and marketplace system administrators.
          </p>

          {/* Error / Non-Staff Rejection Alert */}
          {errorMessage && (
            <div className="mt-5 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono flex items-start gap-3 animate-in fade-in duration-200">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold block uppercase tracking-wider text-[11px] text-red-400 mb-0.5">
                  Authentication Failed
                </span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Staff Username / Handle
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or hilz_admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#F0631D] focus:ring-1 focus:ring-[#F0631D] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                Staff Security Key
              </label>
              <div className="relative flex items-center">
                <KeyRound className="absolute left-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-[#F0631D] focus:ring-1 focus:ring-[#F0631D] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 rounded-xl bg-[#F0631D] hover:bg-[#ff722a] disabled:opacity-50 text-black font-sans font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(240,99,29,0.35)]"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  <span>Verifying Staff Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate to /admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Preset Test Helpers */}
          <div className="mt-8 pt-6 border-t border-white/[0.08] text-xs">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              Security Evaluation Profiles:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillPreset("admin", "admin123")}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Authorized Staff</span>
                </div>
                <div className="text-[11px] text-zinc-300 font-mono mt-0.5">admin / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => fillPreset("tendai_k", "student123")}
                className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-left transition-colors"
              >
                <div className="flex items-center gap-1.5 text-red-400 text-[10px] font-mono font-bold">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Student (Non-Staff)</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Test 403 Rejection</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="max-w-md w-full mx-auto text-center text-[10px] font-mono text-zinc-500">
        Role verification enforced at database level via <code className="text-zinc-400">/api/me/</code>. Client localStorage is not trusted for role elevation.
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ background: "#090a0c" }} className="min-h-screen text-white flex items-center justify-center font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F0631D] animate-ping" />
            <span className="text-zinc-400">Loading Staff Portal...</span>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

