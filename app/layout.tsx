import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  themeColor: "#090a0c",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  title: "The Corner — Campus Marketplace | Great Zimbabwe University",
  description: "Buy and sell verified textbooks, electronics, clothing, and student services on campus at Great Zimbabwe University.",
  keywords: ["campus marketplace", "GZU", "student trade", "textbooks", "Great Zimbabwe University", "electronics"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#090a0c] text-zinc-100 min-h-screen flex flex-col selection:bg-[#F0631D] selection:text-black">
        <Navbar />
        <div className="flex-1 w-full">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
