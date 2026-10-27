import { getListingById, getListings } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  ShieldCheck,
  Clock,
  MessageCircle,
  Phone,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import ListingCard from "@/components/ListingCard";
import ReviewsSection from "@/components/ReviewsSection";
import PurchaseActionModal from "@/components/PurchaseActionModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const listing = await getListingById(parseInt(id, 10));
  if (!listing) return { title: "Listing Not Found — The Corner" };
  return {
    title: `${listing.title} — $${listing.price} | The Corner`,
    description: listing.description,
  };
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listingId = parseInt(id, 10);
  const listing = await getListingById(listingId);

  if (!listing) {
    notFound();
  }

  const allListings = await getListings();
  const relatedListings = allListings
    .filter((item) => item.id !== listing.id && item.category === listing.category)
    .slice(0, 4);

  const photo = listing.images && listing.images[0]?.image_url;
  const phoneNumber = listing.seller_phone || "+263771234567";
  const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    `Hi @${listing.seller_username}, I saw your listing for "${listing.title}" ($${listing.price}) on The Corner. Is it still available?`
  )}`;

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-[6vw] pt-28 sm:pt-32 pb-20">
      
      {/* Breadcrumbs Navigation */}
      <div className="flex items-center justify-between mb-8 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/browse" className="hover:text-white transition-colors">
            Browse
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <Link href={`/category/${listing.category.toLowerCase()}`} className="hover:text-white transition-colors">
            {listing.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-[#F0631D] truncate max-w-xs">{listing.title}</span>
        </nav>
      </div>

      {/* Main Listing View Container */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        
        {/* Left Column: Image Canvas & Ambient Backdrop (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-[4/3.2] sm:aspect-[4/3] rounded-[28px] sm:rounded-[36px] overflow-hidden border border-white/[0.08] bg-[#121418] shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
            {photo ? (
              <Image
                src={photo}
                alt={listing.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-sm">
                No Photo Provided
              </div>
            )}
            
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090a0c]/80 via-transparent to-black/30 pointer-events-none" />

            {/* Badges Over Image */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/70 text-white backdrop-blur-md border border-white/20 uppercase">
                  {listing.condition}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-black/70 text-[#F0631D] backdrop-blur-md border border-white/20">
                  {listing.category}
                </span>
              </div>
            </div>

            {/* Bottom Hall Location Overlay */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono text-zinc-200">
                <MapPin className="w-3.5 h-3.5 text-[#F0631D]" />
                <span>{listing.hall_location}</span>
              </div>
            </div>
          </div>

          {/* Safe Meetup Recommendation Card */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-[#F0631D]/10 text-[#F0631D] shrink-0 border border-[#F0631D]/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="text-xs text-zinc-300 leading-relaxed">
              <span className="font-bold text-white block mb-0.5">Campus Safe Trade Protocol</span>
              Meet the seller on campus during daylight (e.g. <strong>{listing.hall_location}</strong> or Great Hall Quad). Always test gadgets and check pages before handing over cash or EcoCash.
            </div>
          </div>
        </div>

        {/* Right Column: Listing Meta & Action Cluster (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card Header Info */}
          <div className="p-6 sm:p-8 rounded-[28px] border border-white/[0.08] bg-[#111317]">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-2">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Posted recently by verified student</span>
            </div>

            <h1 className="font-sans font-black text-2xl sm:text-3xl text-white tracking-tight leading-snug">
              {listing.title}
            </h1>

            {/* Price Tag */}
            <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-white/[0.08]">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Asking Price</span>
              <span className="font-mono font-black text-3xl sm:text-4xl text-[#F0631D]">
                ${listing.price}
              </span>
              <span className="text-xs font-mono text-zinc-400">USD (Cash or EcoCash equivalent)</span>
            </div>

            {/* Verified Student Seller Profile */}
            <div className="mt-6 pt-6 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-[#F0631D] text-black font-mono font-black text-base flex items-center justify-center shadow-[0_2px_12px_rgba(240,99,29,0.4)]">
                  {listing.seller_username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-white">
                    <span>@{listing.seller_username}</span>
                    <ShieldCheck className="w-4 h-4 text-[#F0631D]" />
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">Great Zimbabwe University Student</span>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons or Out of Stock Notice */}
            {listing.status === "sold" ? (
              <div className="mt-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 font-mono text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span>Out of Stock / Sold</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  This item has been marked as sold or out of stock by @{listing.seller_username}.
                </p>
                <div className="mt-4">
                  <Link
                    href="/#listings"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10 transition-colors"
                  >
                    <span>Browse Similar Listings</span>
                  </Link>
                </div>
              </div>
            ) : (
              <PurchaseActionModal listing={listing} whatsappUrl={whatsappUrl} />
            )}

            {/* Quick Listing Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-white/[0.08] text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-zinc-500 block text-[10px] uppercase">Condition</span>
                <span className="text-white font-semibold">{listing.condition}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-zinc-500 block text-[10px] uppercase">Campus Hall</span>
                <span className="text-white font-semibold truncate block">{listing.hall_location}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-zinc-500 block text-[10px] uppercase">Category</span>
                <span className="text-white font-semibold">{listing.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-zinc-500 block text-[10px] uppercase">Listing Status</span>
                <span className="text-emerald-400 font-semibold uppercase">{listing.status}</span>
              </div>
            </div>

          </div>

          {/* Description Card */}
          <div className="p-6 sm:p-8 rounded-[28px] border border-white/[0.08] bg-[#111317]">
            <h2 className="font-sans font-bold text-sm uppercase tracking-wider text-zinc-300 mb-3">
              Description & Details
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

        </div>

      </div>

      {/* Seller Reviews & AI Reputation Section */}
      <div className="max-w-7xl mx-auto">
        <ReviewsSection
          sellerUsername={listing.seller_username}
          listingId={listing.id}
          listingTitle={listing.title}
        />
      </div>

      {/* Related Campus Listings Section */}
      {relatedListings.length > 0 && (
        <section className="max-w-7xl mx-auto mt-20 pt-12 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-mono text-[#F0631D] uppercase tracking-widest">More in {listing.category}</div>
              <h2 className="font-sans font-black text-2xl text-white uppercase tracking-tight">Related Campus Stashes</h2>
            </div>
            <Link
              href={`/category/${listing.category.toLowerCase()}`}
              className="text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedListings.map((item, index) => (
              <ListingCard key={item.id} listing={item} index={index} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
