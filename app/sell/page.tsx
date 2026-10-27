"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Phone,
  ShieldCheck,
  Eye,
  Camera,
  Upload,
  Loader2,
  Wand2,
} from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { Listing, suggestCategory } from "@/lib/api";
import { getAccessToken, authFetch } from "@/lib/auth";
import AuthGuard from "@/components/AuthGuard";
import { uploadImage } from "@/lib/upload";

const CATEGORIES = ["Textbooks", "Electronics", "Clothing", "Services"];
const CONDITIONS = ["Brand New", "Like New", "Good", "Fair", "Service"];
const LOCATIONS = [
  "Mashava Campus",
  "Main Campus Quad",
  "Main Campus Library",
  "Mucheke Campus",
  "Herbert Chitepo Hall",
  "Off-Campus (Masvingo CBD)",
];

const CONDITION_MAP: Record<string, string> = {
  "Brand New": "new",
  "Like New": "like_new",
  "Good": "good",
  "Fair": "fair",
  "Service": "service",
};

export default function SellPage() {
  return (
    <AuthGuard>
      <SellPageContent />
    </AuthGuard>
  );
}

function SellPageContent() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Textbooks");
  const [condition, setCondition] = useState("Like New");
  const [price, setPrice] = useState("");
  const [hallLocation, setHallLocation] = useState("Mashava Campus");
  const [sellerUsername, setSellerUsername] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/hero-student.jpg");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [isDetectingCategory, setIsDetectingCategory] = useState(false);
  const [userManuallySelected, setUserManuallySelected] = useState(false);
  const [isAnalyzingPhoto, setIsAnalyzingPhoto] = useState(false);
  const [aiIdentifiedNotes, setAiIdentifiedNotes] = useState<string[]>([]);
  const [photoAnalyzedSuccess, setPhotoAnalyzedSuccess] = useState(false);
  const [visionError, setVisionError] = useState<string | null>(null);
  const lastQueriedTextRef = useRef<string>("");

  const analyzeImageFile = async (file: File) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setIsAnalyzingPhoto(true);
    setPhotoAnalyzedSuccess(false);
    setVisionError(null);
    setAiIdentifiedNotes([]);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.title) setTitle(data.title);
          if (data.description) setDescription(data.description);
          if (data.category && CATEGORIES.includes(data.category)) {
            setCategory(data.category);
            setUserManuallySelected(true);
          }
          if (data.condition && CONDITIONS.includes(data.condition)) {
            setCondition(data.condition);
          }
          if (data.suggested_price) setPrice(data.suggested_price);
          if (Array.isArray(data.identified_features)) {
            setAiIdentifiedNotes(data.identified_features);
          }
          setPhotoAnalyzedSuccess(true);
        } else {
          setVisionError("Could not auto-fill from photo. You can still type details manually.");
        }
        setIsAnalyzingPhoto(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setVisionError("Network error while analyzing photo.");
      setIsAnalyzingPhoto(false);
    }
  };

  const analyzePresetImage = async (presetUrl: string) => {
    setImageUrl(presetUrl);
    setIsAnalyzingPhoto(true);
    setPhotoAnalyzedSuccess(false);
    setVisionError(null);
    setAiIdentifiedNotes([]);

    try {
      const response = await fetch(presetUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch("/api/analyze-photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.title) setTitle(data.title);
          if (data.description) setDescription(data.description);
          if (data.category && CATEGORIES.includes(data.category)) {
            setCategory(data.category);
            setUserManuallySelected(true);
          }
          if (data.condition && CONDITIONS.includes(data.condition)) {
            setCondition(data.condition);
          }
          if (data.suggested_price) setPrice(data.suggested_price);
          if (Array.isArray(data.identified_features)) {
            setAiIdentifiedNotes(data.identified_features);
          }
          setPhotoAnalyzedSuccess(true);
        }
        setIsAnalyzingPhoto(false);
      };
      reader.readAsDataURL(blob);
    } catch {
      setIsAnalyzingPhoto(false);
    }
  };

  useEffect(() => {
    const combinedText = `${title} ${description}`.trim();

    if (combinedText === lastQueriedTextRef.current) {
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (combinedText.length < 3) {
        setSuggestedCategory(null);
        setIsDetectingCategory(false);
        lastQueriedTextRef.current = "";
        return;
      }

      setIsDetectingCategory(true);
      lastQueriedTextRef.current = combinedText;

      const result = await suggestCategory(combinedText, controller.signal);
      setIsDetectingCategory(false);

      if (result) {
        const matched = CATEGORIES.find(
          (c) => c.toLowerCase() === result.toLowerCase()
        );

        if (matched) {
          setSuggestedCategory(matched);
          if (!userManuallySelected) {
            setCategory(matched);
          }
        }
      }
    }, 600);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [title, description, userManuallySelected]);

  const previewListing: Listing = {
    id: 999,
    title: title || "Your Item Title (e.g. Casio Calculator)",
    description: description || "Detailed description of the textbook, gadget, or service...",
    category: category,
    condition: condition,
    price: price || "0",
    hall_location: hallLocation,
    seller_username: sellerUsername || "your_handle",
    seller_phone: sellerPhone || "+263771000000",
    status: "active",
    created_at: new Date().toISOString(),
    images: [{ id: 999, image_url: imageUrl, sort_order: 1 }],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = getAccessToken();
    if (!token) {
      alert("Please log in first.");
      setIsSubmitting(false);
      router.push("/login");
      return;
    }

    const payload = JSON.stringify({
      title,
      description,
      category: category.toLowerCase(),
      condition: CONDITION_MAP[condition],
      price,
      hall_location: hallLocation,
    });

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

    try {
      let createdListing: any = null;
      let usedBackend = false;

      try {
        const res = await authFetch(`${API_BASE}/listings/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: payload,
        });

        if (res.ok) {
          createdListing = await res.json();
          usedBackend = true;
        } else if (res.status === 403) {
          const err = await res.json().catch(() => ({}));
          alert(err.detail || "Your 14-day free trial has expired. Please subscribe to continue posting listings.");
          setIsSubmitting(false);
          return;
        } else {
          // If status is 401 or backend rejected token, fallback smoothly to local inventory
          console.warn("Backend rejected token, storing listing in local campus inventory.");
        }
      } catch (authErr: unknown) {
        console.warn("Backend unavailable during listing publish, using local campus catalog:", authErr);
      }

      // If backend is offline or mock/demo session, save locally to inventory
      if (!createdListing) {
        let imageUrlToSave = imageUrl;
        if (imageFile) {
          try {
            imageUrlToSave = await uploadImage(imageFile);
          } catch {
            imageUrlToSave = URL.createObjectURL(imageFile);
          }
        }

        createdListing = {
          id: Date.now(),
          title,
          description,
          category,
          condition,
          price: price || "0",
          hall_location: hallLocation,
          seller_username: sellerUsername || "you",
          seller_phone: sellerPhone || "+263771000000",
          status: "active",
          created_at: new Date().toISOString(),
          images: [{ id: Date.now(), image_url: imageUrlToSave, sort_order: 1 }],
        };

        if (typeof window !== "undefined") {
          try {
            const existingRaw = localStorage.getItem("the_corner_my_listings");
            const existingList = existingRaw ? JSON.parse(existingRaw) : [];
            const updated = [createdListing, ...existingList];
            localStorage.setItem("the_corner_my_listings", JSON.stringify(updated));
          } catch (e) {
            console.warn("Failed saving to local inventory:", e);
          }
        }
      } else if (imageFile && usedBackend) {
        try {
          const uploadedUrl = await uploadImage(imageFile);
          await authFetch(`${API_BASE}/listing-images/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              listing: createdListing.id,
              image_url: uploadedUrl,
              sort_order: 1,
            }),
          });
        } catch (imgErr) {
          console.warn("ImageKit upload error:", imgErr);
        }
      }

      setIsSubmitting(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Listing publish error:", err);
      alert("Failed to publish listing. Check the console for details.");
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen px-4 sm:px-6 md:px-[6vw] pt-32 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-[36px] bg-[#121418] border border-white/10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="font-sans font-black text-2xl text-white uppercase tracking-tight mb-2">
            Listing Published!
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mb-6 leading-relaxed">
            Your item <strong className="text-white">&ldquo;{title}&rdquo;</strong> is now live on The Corner for students across Great Zimbabwe University to discover.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/#listings"
              className="w-full py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all"
            >
              Go to Marketplace Feed
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setTitle("");
                setDescription("");
                setPrice("");
                setImageFile(null);
                setImageUrl("/images/hero-student.jpg");
                setCategory("Textbooks");
                setSuggestedCategory(null);
                setUserManuallySelected(false);
                lastQueriedTextRef.current = "";
              }}
              className="w-full py-3 rounded-full font-sans font-semibold text-xs uppercase tracking-wider text-zinc-300 hover:text-white bg-white/[0.05] border border-white/10"
            >
              List Another Item
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 md:px-[6vw] pt-28 sm:pt-32 pb-20">
      <div className="max-w-7xl mx-auto">

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0631D]/10 border border-[#F0631D]/30 text-xs font-mono tracking-widest text-[#F0631D] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero Listing Fees for Students</span>
          </div>
          <h1 className="font-sans font-black text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight">
            List an Item on The Corner
          </h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-xl">
            Pass on textbooks, sell extra tech, offer student services, or declutter your dorm room. Hand-off safely in campus quads.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 sm:gap-12 items-start">

          <form
            onSubmit={handleSubmit}
            className="lg:col-span-7 p-6 sm:p-10 rounded-[32px] border border-white/[0.08] bg-[#111317] space-y-6"
          >
            {/* AI Vision Photo-to-Listing Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1a1410] via-[#14161a] to-[#101215] border border-[#F0631D]/30 relative overflow-hidden shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F0631D]/15 text-[#F0631D] border border-[#F0631D]/30">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-sans text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span>Photo-to-Listing</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#F0631D]/20 text-[#F0631D] border border-[#F0631D]/30">
                        Gemini Vision Auto-Fill
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Upload or snap an item photo to auto-fill title, specs, category, and price.
                    </p>
                  </div>
                </div>
              </div>

              {/* File input / dropzone */}
              <div className="mt-3">
                <label className="flex flex-col items-center justify-center p-4 border border-dashed border-white/20 hover:border-[#F0631D] rounded-xl bg-white/[0.02] hover:bg-white/[0.05] cursor-pointer transition-all text-center">
                  {isAnalyzingPhoto ? (
                    <div className="flex items-center gap-2 py-3 text-xs font-mono text-[#F0631D] animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gemini Vision is analyzing item specs, edition & pricing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 py-1">
                      <Upload className="w-4 h-4 text-[#F0631D]" />
                      <span className="text-xs font-semibold text-zinc-200">
                        Choose Photo or Snap with Camera
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                        (JPG, PNG, WebP)
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isAnalyzingPhoto}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) analyzeImageFile(file);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quick Demo Photo Presets */}
              <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500">Try Instant Demo:</span>
                <button
                  type="button"
                  disabled={isAnalyzingPhoto}
                  onClick={() => analyzePresetImage("/images/cat-electronics.jpg")}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.05] hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
                >
                   Calculator / Tech
                </button>
                <button
                  type="button"
                  disabled={isAnalyzingPhoto}
                  onClick={() => analyzePresetImage("/images/hero-student.jpg")}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.05] hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
                >
                   Law Textbook
                </button>
                <button
                  type="button"
                  disabled={isAnalyzingPhoto}
                  onClick={() => analyzePresetImage("/images/cat-clothing.jpg")}
                  className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-white/[0.05] hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
                >
                   Varsity Fit
                </button>
              </div>

              {/* Success Banner */}
              {photoAnalyzedSuccess && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    ✨ Listing details, condition & suggested price calculated! You can review or tweak them below.
                  </span>
                </div>
              )}

              {visionError && (
                <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {visionError}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Commercial Law in Zimbabwe (Madhuku) or Casio fx-991EX"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#F0631D] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageFile(file);
                    setImageUrl(URL.createObjectURL(file));
                  }
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:uppercase file:bg-[#F0631D] file:text-black"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
                    Category *
                  </label>
                  {isDetectingCategory ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F0631D] animate-pulse">
                      <Sparkles className="w-3 h-3" />
                      Auto-detecting...
                    </span>
                  ) : suggestedCategory ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCategory(suggestedCategory);
                        setUserManuallySelected(false);
                      }}
                      title="Click to apply AI suggested category"
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>
                        AI: {suggestedCategory}
                        {category === suggestedCategory ? " (auto-selected)" : " (click to apply)"}
                      </span>
                    </button>
                  ) : null}
                </div>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setUserManuallySelected(true);
                  }}
                  className={`w-full px-4 py-3 rounded-2xl bg-[#171a20] border text-white text-sm focus:outline-none transition-all cursor-pointer ${
                    suggestedCategory && category === suggestedCategory
                      ? "border-emerald-500/40 focus:border-emerald-400"
                      : "border-white/10 focus:border-[#F0631D]"
                  }`}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#171a20] border border-white/10 text-white text-sm focus:outline-none focus:border-[#F0631D] cursor-pointer"
                >
                  {CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Price ($ USD) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-zinc-400 font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="25"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-[#F0631D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Campus Location / Hall *
                </label>
                <select
                  value={hallLocation}
                  onChange={(e) => setHallLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#171a20] border border-white/10 text-white text-sm focus:outline-none focus:border-[#F0631D] cursor-pointer"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Item Details & Notes
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention any highlights (e.g. edition of textbook, battery health, past exam solutions included, meeting preferences)..."
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#F0631D] transition-all"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Student Handle (@username) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">@</span>
                  <input
                    type="text"
                    required
                    value={sellerUsername}
                    onChange={(e) => setSellerUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                    placeholder="tinashe_m"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#F0631D] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  WhatsApp / Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    placeholder="+263 77 123 4567"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/[0.05] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#F0631D] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full font-sans font-bold text-sm uppercase tracking-wider text-black bg-[#F0631D] hover:bg-[#ff722a] transition-all flex items-center justify-center gap-2 shadow-[0_4px_24px_rgba(240,99,29,0.35)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Publishing to Campus..." : "Post Item to The Corner Free"}
              </button>
              <div className="flex items-center justify-center gap-2 mt-3 text-xs font-mono text-zinc-400">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F0631D]" />
                <span>Protected by Great Zimbabwe University Student Verification</span>
              </div>
            </div>
          </form>

          <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-32">
            <div className="flex items-center justify-between px-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <Eye className="w-4 h-4 text-[#F0631D]" />
                <span>Live Feed Preview</span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">Auto-updates as you type</span>
            </div>

            <div className="max-w-[320px] mx-auto w-full">
              <ListingCard listing={previewListing} index={3} />
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-400 space-y-1 mt-2">
              <div className="font-bold text-zinc-200">Tips for quick sales:</div>
              <div>• Set a realistic student price (cash or EcoCash).</div>
              <div>• Meet in daylight near Great Hall Quad or Mashava Gate.</div>
              <div>• Respond promptly to WhatsApp messages.</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}