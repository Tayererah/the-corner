"use client";

import { useState, useEffect, useTransition } from "react";
import { Star, Sparkles, ShieldCheck, ThumbsUp, MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Review, ReviewInsights, fetchSellerReviews } from "@/lib/reviews";

const QUICK_TAGS = [
  "Fast Meetup",
  "Item As Described",
  "Fair Student Price",
  "Punctual",
  "Clean & Tested",
  "Friendly Seller",
  "Quick WhatsApp Replies",
];

interface ReviewsSectionProps {
  sellerUsername: string;
  listingId?: number;
  listingTitle?: string;
}

export default function ReviewsSection({
  sellerUsername,
  listingId,
  listingTitle,
}: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [insights, setInsights] = useState<ReviewInsights | null>(null);
  const [loadedSellerUsername, setLoadedSellerUsername] = useState<string | null>(null);
  const loading = loadedSellerUsername !== sellerUsername;

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPolishing, setIsPolishing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchSellerReviews(sellerUsername)
      .then((data) => {
        if (isMounted) {
          setReviews(data.reviews);
          setInsights(data.insights);
          setLoadedSellerUsername(sellerUsername);
        }
      })
      .catch(() => {
        if (isMounted) setLoadedSellerUsername(sellerUsername);
      });

    return () => {
      isMounted = false;
    };
  }, [sellerUsername]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleAIPolish() {
    if (!comment.trim()) return;
    setIsPolishing(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "enhance",
          draft: comment,
          rating,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.enhanced) {
          setComment(data.enhanced);
        }
        if (Array.isArray(data.tags)) {
          setSelectedTags((prev) => Array.from(new Set([...prev, ...data.tags])));
        }
      }
    } catch (err) {
      console.warn("Could not polish review:", err);
    } finally {
      setIsPolishing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      setErrorMessage("Please enter your name and review comment.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seller_username: sellerUsername,
          author_name: authorName,
          rating,
          comment,
          listing_id: listingId,
          tags: selectedTags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit review.");
        setSubmitting(false);
        return;
      }

      if (data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setSubmitSuccess(true);
        setComment("");
        setSelectedTags([]);
        
        // Refresh insights
        fetchSellerReviews(sellerUsername).then((d) => setInsights(d.insights));

        setTimeout(() => {
          setSubmitSuccess(false);
          setShowForm(false);
        }, 2200);
      }
    } catch {
      setErrorMessage("Network error while posting your review.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-12 p-6 sm:p-8 rounded-[28px] border border-white/[0.08] bg-[#111317]">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F0631D] uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Campus Peer Reputation</span>
          </div>
          <h2 className="font-sans font-black text-xl sm:text-2xl text-white">
            Reviews for @{sellerUsername}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {insights && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(insights.average_rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-zinc-600"
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-white">{insights.average_rating}</span>
              <span className="text-zinc-400">({insights.total_reviews})</span>
            </div>
          )}

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider transition-all bg-[#F0631D] text-black hover:bg-[#ff7530] active:scale-95 flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 fill-black" />
            <span>{showForm ? "Close Form" : "Write a Review"}</span>
          </button>
        </div>
      </div>

      {/* AI Review Summary & Highlights Card */}
      {insights && (
        <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#1a1410] via-[#15171b] to-[#121316] border border-[#F0631D]/25 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="px-2.5 py-0.5 rounded-full bg-[#F0631D]/15 border border-[#F0631D]/30 flex items-center gap-1 text-[11px] font-mono text-[#F0631D] uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#F0631D]" />
              <span>AI Review Summary</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              • {insights.trust_level}
            </span>
          </div>

          <p className="text-zinc-200 text-sm leading-relaxed font-sans mb-4">
            &ldquo;{insights.ai_summary}&rdquo;
          </p>

          {/* Key Highlights Pill Badges */}
          <div className="flex flex-wrap gap-2 items-center">
            {insights.highlights.map((highlight, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono bg-white/[0.05] border border-white/10 text-zinc-300"
              >
                <ThumbsUp className="w-3 h-3 text-[#F0631D]" />
                <span>{highlight}</span>
              </span>
            ))}
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              ✓ {insights.sentiment_score}% Positive Feedback
            </span>
          </div>
        </div>
      )}

      {/* Expandable Write Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="my-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col gap-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <span>Rate Your Trade with @{sellerUsername}</span>
            </h3>
            {listingTitle && (
              <span className="text-xs font-mono text-zinc-400 truncate max-w-xs">
                Item: {listingTitle}
              </span>
            )}
          </div>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
              Overall Rating
            </label>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, i) => {
                const starVal = i + 1;
                const isLit = (hoverRating ?? rating) >= starVal;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(starVal)}
                    onMouseEnter={() => setHoverRating(starVal)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-amber-400 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${isLit ? "fill-amber-400" : "text-zinc-600"}`}
                    />
                  </button>
                );
              })}
              <span className="text-xs font-mono text-zinc-300 ml-2">
                {rating === 5
                  ? "5/5 — Excellent Experience"
                  : rating === 4
                  ? "4/5 — Good & Smooth"
                  : rating === 3
                  ? "3/5 — Average"
                  : `${rating}/5 Stars`}
              </span>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
              Your Name / Campus Initials
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Tendai K. (Engineering)"
              required
              className="w-full bg-[#16181d] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#F0631D]"
            />
          </div>

          {/* Review Comment Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono text-zinc-400 uppercase">
                Review Details
              </label>
              <button
                type="button"
                onClick={handleAIPolish}
                disabled={isPolishing || !comment.trim()}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-[#F0631D] hover:text-[#ff8142] transition-colors disabled:opacity-40"
              >
                <Sparkles className="w-3 h-3" />
                <span>{isPolishing ? "Polishing with AI..." : "Polish with AI"}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other students how the trade went (e.g. meet location, item condition, response time)..."
              required
              className="w-full bg-[#16181d] border border-white/10 rounded-xl p-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-[#F0631D] resize-none"
            />
          </div>

          {/* Quick Tags Selector */}
          <div>
            <span className="block text-xs font-mono text-zinc-400 uppercase mb-2">
              Select Quick Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-mono transition-colors border ${
                      active
                        ? "bg-[#F0631D]/20 text-[#F0631D] border-[#F0631D]/40 font-bold"
                        : "bg-white/[0.04] text-zinc-400 border-white/10 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Review submitted and verified by AI moderation!</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-5 py-2.5 rounded-full text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wide transition-all bg-[#F0631D] text-black hover:bg-[#ff7530] disabled:opacity-50 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? "Posting..." : "Post Review"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Reviews Feed List */}
      <div className="flex flex-col gap-4 mt-6">
        {loading ? (
          <div className="py-8 text-center text-xs font-mono text-zinc-500">
            Loading student reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-zinc-500">
            No reviews yet for this student seller. Be the first to trade and leave a review!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-white font-mono font-bold text-xs flex items-center justify-center">
                    {rev.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-white flex items-center gap-1.5">
                      <span>{rev.author_name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Verified Student
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < rev.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed pl-10">
                {rev.comment}
              </p>

              {rev.tags && rev.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-10 mt-1">
                  {rev.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-white/[0.04] text-zinc-400 border border-white/[0.08]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
