"use client";

import { useState, useEffect } from "react";
import {
  ShoppingBag,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  MessageCircle,
  Clock,
  ArrowRight,
  BellRing,
  Loader2,
} from "lucide-react";
import { Listing } from "@/lib/api";
import { fetchCurrentUser } from "@/lib/auth";

interface PurchaseActionModalProps {
  listing: Listing;
  whatsappUrl: string;
}

const SAFE_ZONES = [
  "Main Campus — Library Quad (Recommended)",
  "Mashava Campus — Security Gate",
  "Mucheke Campus — Student Center",
  "Herbert Chitepo Hall — Entrance",
  "Off-Campus — Masvingo CBD Safe Zone",
];

export default function PurchaseActionModal({ listing, whatsappUrl }: PurchaseActionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [meetupZone, setMeetupZone] = useState(SAFE_ZONES[0]);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "ecocash">("cash");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderReference, setOrderReference] = useState("");
  const [buyerUsername, setBuyerUsername] = useState("student");

  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (user?.username) {
        setBuyerUsername(user.username);
      }
    });
  }, []);

  const handleOpen = () => {
    setIsSubmitted(false);
    setOrderReference(`TC-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderReference,
          listingId: listing.id,
          listingTitle: listing.title,
          price: listing.price,
          category: listing.category,
          meetupZone,
          paymentMethod,
          buyerUsername: buyerUsername || "student",
          buyerPhone,
          notes,
          sellerUsername: listing.seller_username,
        }),
      });
    } catch (err) {
      console.warn("Could not record server notification:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const dynamicWhatsappUrl = `${whatsappUrl}&text=${encodeURIComponent(
    `Hi @${listing.seller_username}, I placed a purchase request on The Corner (Order #${orderReference}) for "${listing.title}" ($${listing.price}). Meetup location: ${meetupZone}. Payment: ${paymentMethod.toUpperCase()}. Can we confirm?`
  )}`;

  return (
    <>
      <div className="flex flex-col gap-3 mt-8">
        {/* Primary Try to Purchase Button */}
        <button
          onClick={handleOpen}
          className="w-full py-4 px-6 rounded-full font-sans font-bold text-sm uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(240,99,29,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
          <span>Try to Purchase (${listing.price})</span>
        </button>

        {/* WhatsApp Direct Chat */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 px-6 rounded-full font-sans font-semibold text-xs uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition-all flex items-center justify-center gap-2 text-center"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Message Seller Directly</span>
        </a>
      </div>

      {/* Purchase Request Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-[32px] bg-[#121418] text-white p-6 sm:p-8 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-mono text-zinc-400">
                  <span>Order Ref: {orderReference}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Seller @{listing.seller_username} has been notified on The Corner</span>
                </div>

                <h3 className="font-sans font-black text-2xl uppercase tracking-tight text-white">
                  Purchase Request Sent!
                </h3>
                
                <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                  Your purchase request for <strong className="text-white">&quot;{listing.title}&quot;</strong> has been submitted. Meetup zone reserved at <span className="text-[#F0631D] font-bold">{meetupZone}</span>.
                </p>

                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Seller:</span>
                    <span className="text-white">@{listing.seller_username}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Price:</span>
                    <span className="text-[#F0631D] font-bold">${listing.price} USD</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Payment:</span>
                    <span className="text-white uppercase">{paymentMethod} on delivery</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href={dynamicWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 rounded-full font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Order Ticket on WhatsApp</span>
                  </a>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F0631D]/15 text-[#F0631D] text-[10px] font-mono uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Safe Campus Purchase</span>
                  </div>
                  <h2 className="font-sans font-black text-2xl text-white uppercase tracking-tight">
                    Confirm Purchase Request
                  </h2>
                  <p className="text-zinc-400 text-xs mt-1">
                    Connect with @{listing.seller_username} for a verified in-person campus trade.
                  </p>
                </div>

                {/* Listing Summary Preview */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase block">{listing.category}</span>
                    <span className="font-bold text-sm text-white line-clamp-1">{listing.title}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-xl text-[#F0631D]">${listing.price}</span>
                    <span className="text-[10px] font-mono text-zinc-500 block">USD</span>
                  </div>
                </div>

                {/* Safe Meetup Zone Selection */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#F0631D]" />
                    <span>Select Campus Meetup Zone</span>
                  </label>
                  <select
                    value={meetupZone}
                    onChange={(e) => setMeetupZone(e.target.value)}
                    className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#F0631D]"
                  >
                    {SAFE_ZONES.map((zone) => (
                      <option key={zone} value={zone} className="bg-[#121418] text-white">
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Choice */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                    Payment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                        paymentMethod === "cash"
                          ? "border-[#F0631D] bg-[#F0631D]/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-[#F0631D]" />
                      <div>
                        <span className="text-xs font-bold block">Cash (USD)</span>
                        <span className="text-[10px] font-mono text-zinc-500">Pay on exchange</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("ecocash")}
                      className={`p-3.5 rounded-2xl border flex items-center gap-2.5 transition-all text-left ${
                        paymentMethod === "ecocash"
                          ? "border-[#F0631D] bg-[#F0631D]/10 text-white"
                          : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#F0631D]" />
                      <div>
                        <span className="text-xs font-bold block">EcoCash</span>
                        <span className="text-[10px] font-mono text-zinc-500">USD / Equivalent</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Optional Phone / WhatsApp Number */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Your Contact Phone / WhatsApp <span className="text-zinc-500 normal-case">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                    placeholder="+263 77..."
                    className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#F0631D]"
                  />
                </div>

                {/* Optional Notes */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Order Note / Meeting Time <span className="text-zinc-500 normal-case">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Free after 2pm at library..."
                    className="w-full py-3 px-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-[#F0631D]"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(240,99,29,0.35)] cursor-pointer mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Notifying Seller...</span>
                    </>
                  ) : (
                    <>
                      <BellRing className="w-4 h-4" />
                      <span>Notify Seller &amp; Submit Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}
    </>
  );
}
