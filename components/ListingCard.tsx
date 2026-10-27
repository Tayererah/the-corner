"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MapPin, ShieldCheck, Clock } from "lucide-react";
import { Listing, addFavorite, removeFavorite } from "@/lib/api";
import { useState } from "react";
import { getAccessToken } from "@/lib/auth";

const STYLES = [
  { gradientBg: "from-[#1a3835] via-[#2a5953] to-[#122422]", glow: "rgba(56, 189, 168, 0.22)" },
  { gradientBg: "from-[#45371c] via-[#8c6d32] to-[#261f0e]", glow: "rgba(234, 179, 8, 0.22)" },
  { gradientBg: "from-[#282d38] via-[#4d5668] to-[#181b22]", glow: "rgba(148, 163, 184, 0.22)" },
  { gradientBg: "from-[#4a2411] via-[#aa4e1e] to-[#261108]", glow: "rgba(240, 99, 29, 0.25)" },
];

function formatTimeAgo(dateStr?: string) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const diffHours = Math.round((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

interface ListingCardProps {
  listing: Listing;
  index: number;
  initialSaved?: boolean;
  favoriteId?: number;
  onRemove?: () => void;
}

export default function ListingCard({
  listing,
  index,
  initialSaved = false,
  favoriteId,
  onRemove,
}: ListingCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [currentFavId, setCurrentFavId] = useState<number | undefined>(favoriteId);
  const [isSaving, setIsSaving] = useState(false);

  const timeAgo = formatTimeAgo(listing.created_at);
  const style = STYLES[index % STYLES.length];
  const photo = listing.images && listing.images[0]?.image_url;

  return (
    <Link
      href={"/listings/" + listing.id}
      className="group relative aspect-[3/4.4] rounded-[28px] sm:rounded-[32px] overflow-hidden border border-white/[0.08] bg-[#121316] cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(0,0,0,0.8)] block select-none"
      style={{ boxShadow: "0 18px 40px -10px " + style.glow }}
    >
      <div className={"absolute inset-0 bg-gradient-to-b " + style.gradientBg + " opacity-85 group-hover:opacity-100 transition-opacity"} />

      <div className="absolute inset-0 overflow-hidden">
        {photo ? (
          <Image
            src={photo}
            alt={listing.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-65 group-hover:opacity-75"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <span className="font-mono text-xs uppercase">No Photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c] via-[#090a0c]/60 to-transparent" />
      </div>

      {/* Out of Stock Overlay Badge */}
      {listing.status === "sold" && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-30 flex items-center justify-center p-4 pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full border border-red-500/50 bg-red-950/85 text-red-300 font-mono text-[11px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Out of Stock</span>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/60 text-white backdrop-blur-md border border-white/15 uppercase">
            {listing.condition}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono bg-black/60 text-zinc-300 backdrop-blur-md border border-white/10">
            <MapPin className="w-2.5 h-2.5 text-[#F0631D]" />
            <span className="truncate max-w-[80px] sm:max-w-[100px]">{listing.hall_location || listing.category}</span>
          </span>
        </div>

        <button
          disabled={isSaving}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isSaving) return;

            const token = getAccessToken();
            if (!token) {
              router.push("/login");
              return;
            }

            setIsSaving(true);
            try {
              if (saved && (currentFavId || favoriteId)) {
                const idToDelete = currentFavId || favoriteId;
                if (idToDelete) {
                  const res = await removeFavorite(idToDelete);
                  if (res.ok) {
                    setSaved(false);
                    setCurrentFavId(undefined);
                    onRemove?.();
                  }
                }
              } else if (!saved) {
                const res = await addFavorite(listing.id);
                if (res.ok) {
                  const data = await res.json().catch(() => ({}));
                  if (data?.id) {
                    setCurrentFavId(data.id);
                  }
                  setSaved(true);
                } else if (res.status === 401) {
                  router.push("/login");
                }
              }
            } catch (err: unknown) {
              if ((err as Error)?.message === "UNAUTHORIZED") {
                router.push("/login");
              } else {
                console.error("Favorite action failed:", err);
              }
            } finally {
              setIsSaving(false);
            }
          }}
          className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-110 active:scale-90 disabled:opacity-50 shrink-0 cursor-pointer"
          aria-label={saved ? "Remove from saved" : "Save listing"}
        >
          <span className={saved ? "text-red-500 font-bold" : "text-zinc-600"}>
            {saved ? "♥" : "♡"}
          </span>
        </button>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-end p-5 sm:p-6 text-left">
        <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-zinc-400">
          <div className="inline-flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 text-zinc-500" />
            <span>{timeAgo}</span>
          </div>
          <span>•</span>
          <div className="inline-flex items-center gap-1 text-zinc-300">
            <ShieldCheck className="w-2.5 h-2.5 text-[#F0631D]" />
            <span className="truncate max-w-[90px]">@{listing.seller_username}</span>
          </div>
        </div>

        <h3 className="font-sans font-bold text-base sm:text-lg text-white mb-2 line-clamp-2 leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-[#F0631D] transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] mt-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Price</span>
            <span className="font-mono font-bold text-lg sm:text-xl text-[#F0631D]">
              ${listing.price}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-white/[0.1] hover:bg-white/[0.2] border border-white/15 backdrop-blur-md transition-all group-hover:scale-105">
            <span>View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}