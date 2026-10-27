export interface SubCategory {
  id: string;
  name: string;
  badge?: string;
  keywords?: string[];
  maxPrice?: number;
}

export interface CategoryData {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  heroImage: string;
  itemCountEstimate: string;
  gradientBg: string;
  glowColor: string;
  accentColor: string;
  accentText: string;
  accentBadge: string;
  subcategories: SubCategory[];
  promoNotice: string;
  popularFilters: { label: string; query: string }[];
}

export const CATEGORIES_DATA: Record<string, CategoryData> = {
  textbooks: {
    slug: "textbooks",
    name: "Textbooks & Academic Notes",
    shortName: "Textbooks",
    tagline: "Prescribed Modules, Law Cases & Exam Prep at Student Rates",
    description: "Save big on core university textbooks, Law & LLB casebooks, B.Com accounting modules, and printed past-exam papers from students who passed the course.",
    heroImage: "/images/hero-student.jpg",
    itemCountEstimate: "420+ Items",
    gradientBg: "from-[#382b13] via-[#6e5323] to-[#1c1509]",
    glowColor: "rgba(234, 179, 8, 0.28)",
    accentColor: "#EAB308",
    accentText: "text-amber-400",
    accentBadge: "bg-amber-400/10 text-amber-300 border-amber-400/30",
    promoNotice: "📚 Semester Exam Prep: Up to 70% cheaper than bookstore copies. Instant pickup at Main Campus Quad & Library.",
    subcategories: [
      { id: "all", name: "All Textbooks" },
      { id: "law", name: "Law & LLB", keywords: ["law", "madhuku", "commercial", "legal", "constitution"] },
      { id: "commerce", name: "B.Com & Finance", keywords: ["accounting", "finance", "economics", "bcom", "commerce", "business"] },
      { id: "stem", name: "STEM & Computing", keywords: ["calculus", "physics", "computer", "engineering", "math", "science"] },
      { id: "notes", name: "Exam Packs & Notes", keywords: ["notes", "papers", "exam", "revision", "summary"] },
      { id: "under15", name: "Under $15", maxPrice: 15 },
    ],
    popularFilters: [
      { label: "Madhuku Law", query: "madhuku" },
      { label: "Accounting", query: "accounting" },
      { label: "Past Papers", query: "exam" },
      { label: "Like New Condition", query: "Like New" },
    ],
  },
  electronics: {
    slug: "electronics",
    name: "Electronics & Campus Tech",
    shortName: "Electronics",
    tagline: "Laptops, Scientific Calculators & Dorm Gadgets",
    description: "Gear up for study sessions and campus life. Verified Casio scientific calculators, ThinkPad laptops, dorm fridges, chargers, and audio gear.",
    heroImage: "/images/cat-electronics.jpg",
    itemCountEstimate: "190+ Items",
    gradientBg: "from-[#1c2433] via-[#2f3e58] to-[#111620]",
    glowColor: "rgba(96, 165, 250, 0.28)",
    accentColor: "#60A5FA",
    accentText: "text-blue-400",
    accentBadge: "bg-blue-400/10 text-blue-300 border-blue-400/30",
    promoNotice: "⚡ Test Before You Pay: Official protocol encourages meeting at Mashava or Main Hall to inspect battery & screens.",
    subcategories: [
      { id: "all", name: "All Electronics" },
      { id: "calculators", name: "Calculators", keywords: ["calculator", "casio", "scientific", "classwiz", "fx-991"] },
      { id: "laptops", name: "Laptops & PCs", keywords: ["laptop", "thinkpad", "lenovo", "hp", "dell", "notebook"] },
      { id: "appliances", name: "Dorm Appliances", keywords: ["fridge", "kettle", "iron", "cooker", "heater", "fan"] },
      { id: "phones", name: "Phones & Tablets", keywords: ["phone", "iphone", "samsung", "tablet", "ipad", "android"] },
      { id: "audio", name: "Audio & Cables", keywords: ["charger", "earbuds", "headphones", "cable", "powerbank", "usb"] },
      { id: "under25", name: "Under $25", maxPrice: 25 },
    ],
    popularFilters: [
      { label: "Casio fx-991", query: "casio" },
      { label: "ThinkPad", query: "thinkpad" },
      { label: "Bar Fridge", query: "fridge" },
      { label: "Like New", query: "Like New" },
    ],
  },
  clothing: {
    slug: "clothing",
    name: "Clothing & Varsity Fits",
    shortName: "Clothing",
    tagline: "Varsity Merch, Fresh Kicks & Dorm Drops",
    description: "Show off campus pride with official GZU varsity jackets, comfy winter hoodies, sneakers, dress wear for presentations, and casual street styles.",
    heroImage: "/images/cat-clothing.jpg",
    itemCountEstimate: "280+ Items",
    gradientBg: "from-[#13302c] via-[#214d46] to-[#0d1f1c]",
    glowColor: "rgba(56, 189, 168, 0.3)",
    accentColor: "#38BDA8",
    accentText: "text-emerald-400",
    accentBadge: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
    promoNotice: "✨ Campus Streetwear: Pre-loved student wardrobes & unreleased varsity drops. Check size and fits during hand-off.",
    subcategories: [
      { id: "all", name: "All Clothing" },
      { id: "varsity", name: "Varsity & Bombers", keywords: ["varsity", "bomber", "jacket", "gzu", "crest"] },
      { id: "hoodies", name: "Hoodies & Sweaters", keywords: ["hoodie", "sweater", "fleece", "sweatshirt"] },
      { id: "kicks", name: "Sneakers & Kicks", keywords: ["sneakers", "kicks", "shoes", "boots", "loafers"] },
      { id: "formal", name: "Formal & Presentation", keywords: ["suit", "shirt", "blazer", "formal", "dress"] },
      { id: "accessories", name: "Bags & Caps", keywords: ["cap", "hat", "bag", "backpack", "belt", "beanie"] },
      { id: "under20", name: "Under $20", maxPrice: 20 },
    ],
    popularFilters: [
      { label: "Bomber Jacket", query: "bomber" },
      { label: "Size M / L", query: "size" },
      { label: "Under $20", query: "20" },
      { label: "Like New", query: "Like New" },
    ],
  },
  services: {
    slug: "services",
    name: "Campus Services & Skills",
    shortName: "Services",
    tagline: "Fast Printing, Hair Braiding, Tutoring & Tech Help",
    description: "Support talented campus peers. Fast hostel printing and binding, neat knotless braiding, course tutoring, assignment formatting, and phone repairs.",
    heroImage: "/images/cat-services.jpg",
    itemCountEstimate: "160+ Gigs",
    gradientBg: "from-[#271938] via-[#4d326e] to-[#130b1c]",
    glowColor: "rgba(168, 85, 247, 0.28)",
    accentColor: "#A855F7",
    accentText: "text-purple-400",
    accentBadge: "bg-purple-400/10 text-purple-300 border-purple-400/30",
    promoNotice: "🎓 Direct Peer Support: WhatsApp campus student providers directly with zero middlemen or commission fees.",
    subcategories: [
      { id: "all", name: "All Services" },
      { id: "printing", name: "Dorm Printing & Binding", keywords: ["printing", "binding", "print", "scanning", "copies"] },
      { id: "hair", name: "Hair Braiding & Beauty", keywords: ["hair", "braiding", "braids", "beauty", "twists", "locs"] },
      { id: "tutoring", name: "Tutoring & Coaching", keywords: ["tutoring", "tutor", "lessons", "stats", "exam prep"] },
      { id: "tech", name: "Tech & Phone Repairs", keywords: ["repair", "screen", "installation", "windows", "software", "tech"] },
      { id: "typing", name: "Typing & Assignment Format", keywords: ["typing", "dissertation", "formatting", "assignment"] },
      { id: "under10", name: "Under $10", maxPrice: 10 },
    ],
    popularFilters: [
      { label: "Fast Printing", query: "printing" },
      { label: "Knotless Braids", query: "braids" },
      { label: "Dissertation Binding", query: "binding" },
      { label: "Tech Help", query: "repair" },
    ],
  },
};

export function normalizeCategorySlug(rawSlug: string): string {
  const clean = rawSlug.toLowerCase().trim();
  if (clean === "textbooks" || clean === "textbook" || clean === "books" || clean === "book") return "textbooks";
  if (clean === "electronics" || clean === "electronic" || clean === "tech" || clean === "gadgets") return "electronics";
  if (clean === "clothing" || clean === "clothes" || clean === "apparel" || clean === "fashion") return "clothing";
  if (clean === "services" || clean === "service" || clean === "gigs" || clean === "skills") return "services";
  return clean;
}

export function getCategoryData(slug: string): CategoryData | null {
  const normalized = normalizeCategorySlug(slug);
  return CATEGORIES_DATA[normalized] || null;
}

export function getAllCategories(): CategoryData[] {
  return Object.values(CATEGORIES_DATA);
}
