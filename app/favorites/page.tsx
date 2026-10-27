"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { getFavorites, FavoriteEntry } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    getFavorites(token)
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  return (
    <div style={{ background: "#0b0c0e" }} className="min-h-screen text-white px-4 sm:px-6 md:px-[6vw] pt-10 pb-20">
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Marketplace</span>
      </Link>

      <h1 className="font-sans font-black text-3xl uppercase tracking-tight mb-8">Saved Items</h1>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading...</p>
      ) : favorites.length === 0 ? (
        <p className="text-zinc-500 text-sm">Nothing saved yet — tap the heart on a listing to save it here.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {favorites.map((fav, i) => (
            <ListingCard
              key={fav.id}
              listing={fav.listing_detail}
              index={i}
              initialSaved={true}
              favoriteId={fav.id}
              onRemove={() => {
                setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}