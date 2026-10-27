"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, fetchCurrentUser } from "@/lib/auth";
import { Lock, ShieldCheck, Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "seller" | "customer";
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      if (!isAuthenticated()) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      const user = await fetchCurrentUser();
      if (!isMounted) return;

      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      // Check seller requirement only if strictly enforced
      if (requiredRole === "seller" && user.role !== "seller" && !user.is_seller && !user.is_staff) {
        router.replace(`/login?role=seller&redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setAuthorized(true);
    }

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [router, pathname, requiredRole]);

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-[#0b0c0e] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#F0631D] mb-4">
          <Lock className="w-6 h-6 animate-pulse" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0631D]/15 text-[#F0631D] text-xs font-mono uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verifying Campus Credentials</span>
        </div>
        <p className="text-zinc-400 text-xs sm:text-sm font-mono mt-1">
          Sign-in required to access The Corner campus platform.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
