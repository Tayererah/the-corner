import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{ background: "#0b0c0e" }}
      className="min-h-screen text-white flex flex-col items-center justify-center px-6 text-center"
    >
      <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#F0631D" }}>
        404 — Page not found
      </div>
      <h1 className="font-sans font-black text-5xl sm:text-6xl uppercase tracking-tight mb-4">
        Lost on campus?
      </h1>
      <p className="text-zinc-400 text-sm max-w-sm mb-8">
        This page doesn&rsquo;t exist. Maybe the listing was sold, or the link&rsquo;s just wrong.
      </p>
      <Link
        href="/"
        className="px-6 py-3.5 rounded-full font-bold text-sm uppercase tracking-wide transition-transform hover:scale-[1.03]"
        style={{ background: "#F0631D", color: "#0b0c0e" }}
      >
        Back to The Corner
      </Link>
    </div>
  );
}