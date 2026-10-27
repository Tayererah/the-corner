"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  ExternalLink,
  PackageX,
  PackageCheck,
  RefreshCw,
  Sparkles,
  X,
  BellRing,
  ShoppingBag,
  Phone,
  MessageCircle,
} from "lucide-react";
import {
  Listing,
  getMyListings,
  deleteListing,
  updateListingStatus
} from "@/lib/api";
import { getAccessToken, fetchCurrentUser } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";

export interface PurchaseNotification {
  id: string;
  orderReference: string;
  listingId: number;
  listingTitle: string;
  price: string;
  category: string;
  meetupZone: string;
  paymentMethod: "cash" | "ecocash";
  buyerUsername: string;
  buyerPhone: string;
  notes?: string;
  sellerUsername: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
}

type FilterTab = "all" | "active" | "sold" | "requests";

export default function MyListingsPage() {
  return (
    <AuthGuard>
      <MyListingsContent />
    </AuthGuard>
  );
}

function MyListingsContent() {
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [notifications, setNotifications] = useState<PurchaseNotification[]>([]);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const [sellerName, setSellerName] = useState<string>("");

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const loadNotifications = async (username?: string) => {
    try {
      const targetUser = username || sellerName;
      const url = targetUser ? `/api/notifications?seller=${encodeURIComponent(targetUser)}` : `/api/notifications`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (e) {
      console.warn("Failed to load notifications:", e);
    }
  };

  const handleUpdateNotifStatus = async (id: string, status: "accepted" | "declined") => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, status } : n))
        );
        setToastMessage({
          text: status === "accepted" ? "Purchase request accepted!" : "Purchase request declined.",
          type: "success",
        });
      }
    } catch {
      setToastMessage({ text: "Failed to update request.", type: "error" });
    }
  };

  const loadListings = () => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    setLoading(true);

    fetchCurrentUser().then((u) => {
      if (u?.username) {
        setSellerName(u.username);
        loadNotifications(u.username);
      } else {
        loadNotifications();
      }
    });

    getMyListings(token)
      .then((data) => {
        setListings(data);
      })
      .catch((err) => {
        console.error("Failed to load listings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadListings();
  }, [router]);

  // Handle Permanent Deletion
  const handleDeleteConfirm = async () => {
    if (!listingToDelete) return;
    setIsDeleting(true);

    const token = getAccessToken() || undefined;
    const res = await deleteListing(listingToDelete.id, token);

    if (res.success) {
      setListings((prev) => prev.filter((item) => item.id !== listingToDelete.id));
      setToastMessage({
        text: `"${listingToDelete.title}" has been permanently removed from your catalog.`,
        type: "success",
      });
      setListingToDelete(null);
    } else {
      setToastMessage({
        text: res.error || "Failed to delete listing. Please try again.",
        type: "error",
      });
    }
    setIsDeleting(false);
  };

  // Handle Status Toggle (In Stock ↔ Out of Stock)
  const handleToggleStock = async (listing: Listing) => {
    const nextStatus = listing.status === "sold" ? "active" : "sold";
    setActionLoadingId(listing.id);

    const token = getAccessToken() || undefined;
    const res = await updateListingStatus(listing.id, nextStatus, token);

    if (res.success) {
      setListings((prev) =>
        prev.map((item) =>
          item.id === listing.id ? { ...item, status: nextStatus } : item
        )
      );
      setToastMessage({
        text: nextStatus === "sold"
          ? `Marked "${listing.title}" as Out of Stock (Sold).`
          : `Restocked "${listing.title}" — now visible in public search.`,
        type: "success",
      });
    } else {
      setToastMessage({
        text: res.error || "Failed to update item stock status.",
        type: "error",
      });
    }
    setActionLoadingId(null);
  };

  // Counts
  const counts = useMemo(() => {
    const total = listings.length;
    const active = listings.filter((l) => l.status === "active").length;
    const sold = listings.filter((l) => l.status === "sold").length;
    return { total, active, sold };
  }, [listings]);

  // Filtered Listings
  const filteredListings = useMemo(() => {
    if (activeTab === "active") {
      return listings.filter((l) => l.status === "active");
    }
    if (activeTab === "sold") {
      return listings.filter((l) => l.status === "sold");
    }
    return listings;
  }, [listings, activeTab]);

  return (
    <div style={{ background: "#0b0c0e" }} className="min-h-screen text-white px-4 sm:px-6 md:px-[6vw] pt-28 pb-24 font-sans">
      {/* Top Breadcrumb Navigation */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 hidden sm:inline">
          Seller Inventory Management
        </span>
      </div>

      {/* Main Header & Actions */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono tracking-widest text-[#F0631D] uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Seller Hub</span>
            </div>
            <h1 className="font-sans font-black text-3xl sm:text-4xl uppercase tracking-tight text-white">
              Inventory & My Listings<span className="text-[#F0631D]">.</span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Manage your active student listings, mark items out of stock when sold, or delete old items to keep your catalog clean.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-bold text-xs uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(240,99,29,0.35)]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Post New Item</span>
            </Link>
          </div>
        </div>

        {/* Inventory Statistics & Tabs Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          {/* Tab Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "all"
                  ? "bg-white text-black font-bold shadow-md"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              All Items ({counts.total})
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "active"
                  ? "bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>In Stock ({counts.active})</span>
            </button>
            <button
              onClick={() => setActiveTab("sold")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "sold"
                  ? "bg-red-500 text-white font-bold shadow-md shadow-red-500/20"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span>Out of Stock ({counts.sold})</span>
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "requests"
                  ? "bg-[#F0631D] text-black font-bold shadow-md shadow-[#F0631D]/20"
                  : "bg-white/[0.04] text-zinc-400 hover:text-white border border-white/10"
              }`}
            >
              <BellRing className="w-3.5 h-3.5 text-[#F0631D]" />
              <span>Buyer Purchase Requests ({notifications.length})</span>
            </button>
          </div>

          <div className="text-right text-[11px] font-mono text-zinc-500 hidden sm:block">
            Items marked out of stock are hidden from buyer search feeds
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="max-w-6xl mx-auto mb-6">
          <div
            className={`p-3.5 rounded-2xl flex items-center justify-between gap-3 text-xs border ${
              toastMessage.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border-red-500/30 text-red-300"
            } animate-fadeIn`}
          >
            <div className="flex items-center gap-2">
              {toastMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="p-1 hover:opacity-80 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Listings Area */}
      <div className="max-w-6xl mx-auto">
        {activeTab === "requests" ? (
          notifications.length === 0 ? (
            <div className="text-center py-20 p-8 rounded-3xl bg-[#121316] border border-white/[0.08] max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#F0631D]">
                <BellRing className="w-7 h-7" />
              </div>
              <h3 className="font-sans font-bold text-lg text-white mb-2">No Purchase Requests Yet</h3>
              <p className="text-xs text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed">
                When buyers click &quot;Try to Purchase&quot; on your listings, their purchase request notifications and campus meetup choices will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Received Buyer Inquiries &amp; Orders ({notifications.length})
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Live Campus Feed</span>
              </div>

              <div className="grid gap-4">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-5 sm:p-6 rounded-3xl bg-[#121316] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.06] text-zinc-400 border border-white/10">
                          {notif.orderReference}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold ${
                            notif.status === "accepted"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : notif.status === "declined"
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : "bg-[#F0631D]/20 text-[#F0631D] border border-[#F0631D]/30"
                          }`}
                        >
                          {notif.status}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h4 className="font-sans font-bold text-base sm:text-lg text-white">
                        {notif.listingTitle}{" "}
                        <span className="text-[#F0631D] font-mono font-bold">${notif.price} USD</span>
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <span>Buyer:</span> <strong className="text-white">@{notif.buyerUsername}</strong>
                        </span>
                        {notif.buyerPhone && (
                          <span className="flex items-center gap-1 text-zinc-300">
                            <Phone className="w-3 h-3 text-[#F0631D]" />
                            <span>{notif.buyerPhone}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-zinc-300">
                          <MapPin className="w-3 h-3 text-[#F0631D]" />
                          <span>{notif.meetupZone}</span>
                        </span>
                        <span className="flex items-center gap-1 text-zinc-300">
                          <span>Payment:</span> <span className="uppercase text-white font-bold">{notif.paymentMethod}</span>
                        </span>
                      </div>

                      {notif.notes && (
                        <p className="text-xs text-zinc-300 font-mono italic bg-white/[0.03] p-2.5 rounded-xl border border-white/5 max-w-lg">
                          &ldquo;{notif.notes}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex sm:flex-col md:flex-row items-center gap-2 shrink-0">
                      {notif.buyerPhone && (
                        <a
                          href={`https://wa.me/${notif.buyerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hi @${notif.buyerUsername}, I received your purchase request for "${notif.listingTitle}" ($${notif.price}) on The Corner. Let's arrange meetup!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full font-mono text-xs text-zinc-300 hover:text-white bg-white/[0.05] border border-white/10 hover:bg-white/10 flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Buyer</span>
                        </a>
                      )}

                      {notif.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleUpdateNotifStatus(notif.id, "accepted")}
                            className="px-4 py-2 rounded-full font-mono text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateNotifStatus(notif.id, "declined")}
                            className="px-4 py-2 rounded-full font-mono text-xs text-zinc-400 hover:text-red-400 bg-white/[0.05] border border-white/10 transition-colors"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : loading ? (
          <div className="text-center py-20">
            <RefreshCw className="w-6 h-6 animate-spin text-[#F0631D] mx-auto mb-3" />
            <p className="text-xs font-mono text-zinc-400">Loading your inventory...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 p-8 rounded-3xl bg-[#121316] border border-white/[0.08] max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <PackageX className="w-7 h-7" />
            </div>
            <h3 className="font-sans font-bold text-lg text-white mb-2">
              {activeTab === "all"
                ? "No listings yet"
                : activeTab === "active"
                ? "No active in-stock listings"
                : "No out of stock listings"}
            </h3>
            <p className="text-xs text-zinc-400 mb-6 max-w-sm mx-auto leading-relaxed">
              {activeTab === "all"
                ? "You haven't listed any items for sale yet. Snap a photo or list a textbook to get started."
                : "All items in this category are currently sorted into other statuses."}
            </p>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>List Your First Item</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isSold = listing.status === "sold";
              const photo = listing.images && listing.images[0]?.image_url;
              const isActionLoading = actionLoadingId === listing.id;

              return (
                <div
                  key={listing.id}
                  className={`group relative rounded-[28px] overflow-hidden border transition-all duration-200 bg-[#121316] flex flex-col justify-between ${
                    isSold
                      ? "border-red-500/20 shadow-[0_4px_24px_rgba(239,68,68,0.06)]"
                      : "border-white/[0.08] hover:border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
                  }`}
                >
                  {/* Top Image Preview & Status Overlays */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                    {photo ? (
                      <Image
                        src={photo}
                        alt={listing.title}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                          isSold ? "opacity-40 grayscale" : "opacity-90"
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs uppercase">
                        No Photo
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-transparent to-black/40" />

                    {/* Stock Status Badge */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                      {isSold ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-red-950/90 text-red-300 border border-red-500/40 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          <span>Out of Stock</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>In Stock (Active)</span>
                        </span>
                      )}
                    </div>

                    {/* Category Pill */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/60 text-zinc-300 backdrop-blur-md border border-white/10 uppercase">
                        {listing.category}
                      </span>
                    </div>

                    {/* Price Tag in Bottom Corner */}
                    <div className="absolute bottom-3 right-4 z-10">
                      <span className="font-mono font-black text-xl text-[#F0631D] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        ${listing.price}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans font-bold text-base text-white mb-1.5 line-clamp-1 group-hover:text-[#F0631D] transition-colors">
                        {listing.title}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
                        {listing.description || "No description provided."}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500 mb-4 pb-4 border-b border-white/[0.06]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#F0631D]" />
                          <span>{listing.hall_location || "Campus"}</span>
                        </span>
                        <span>•</span>
                        <span>Condition: {listing.condition}</span>
                      </div>
                    </div>

                    {/* Seller Action Toolbar */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      {/* View Button */}
                      <Link
                        href={`/listings/${listing.id}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors"
                        title="View public listing page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">View</span>
                      </Link>

                      <div className="flex items-center gap-2">
                        {/* Toggle Out-of-Stock / In-Stock Button */}
                        <button
                          type="button"
                          disabled={isActionLoading}
                          onClick={() => handleToggleStock(listing)}
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                            isSold
                              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25"
                              : "bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25"
                          } disabled:opacity-50`}
                          title={isSold ? "Restock item" : "Mark as sold out"}
                        >
                          {isActionLoading ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : isSold ? (
                            <PackageCheck className="w-3.5 h-3.5" />
                          ) : (
                            <PackageX className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {isSold ? "Restock" : "Mark Sold"}
                          </span>
                        </button>

                        {/* Permanent Delete Button */}
                        <button
                          type="button"
                          onClick={() => setListingToDelete(listing)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/25 hover:border-red-500/40 transition-colors cursor-pointer"
                          title="Delete this listing permanently"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Permanent Delete */}
      {listingToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-[28px] bg-[#121418] border border-red-500/30 shadow-[0_20px_60px_rgba(239,68,68,0.2)]">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5 text-red-400">
              <Trash2 className="w-6 h-6 stroke-[2]" />
            </div>

            <h3 className="font-sans font-black text-xl text-white uppercase tracking-tight mb-2">
              Delete Listing?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mb-2 leading-relaxed">
              Are you sure you want to delete <strong className="text-white">&ldquo;{listingToDelete.title}&rdquo;</strong>?
            </p>
            <p className="text-xs text-zinc-400 font-mono mb-6 leading-relaxed bg-white/[0.04] p-3 rounded-xl border border-white/[0.06]">
              ⚠️ This item will be permanently removed from student search feeds and catalog results. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setListingToDelete(null)}
                className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.06] hover:bg-white/[0.1] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 transition-transform active:scale-95 shadow-[0_4px_16px_rgba(239,68,68,0.4)] disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Yes, Delete Item</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}