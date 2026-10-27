/**
 * The Corner — Campus Marketplace Auto-Correct & Spell Checking Engine
 * 
 * Powered by Damerau-Levenshtein distance, corpus term-frequency weighting,
 * and campus domain-specific vocabulary (courses, textbooks, electronics, clothing, dorm services).
 */

export interface CorrectionDetail {
  original: string;
  replacement: string;
  distance: number;
  confidence: number;
}

export interface AutoCorrectResult {
  originalQuery: string;
  correctedQuery: string;
  hasCorrection: boolean;
  corrections: CorrectionDetail[];
  explanation: string | null;
}

// 1. Direct High-Confidence Common Typos Map
export const COMMON_TYPOS: Record<string, string> = {
  // Electronics & Gadgets
  caculator: "calculator",
  claculator: "calculator",
  calcualtor: "calculator",
  calclator: "calculator",
  calcultor: "calculator",
  engenering: "engineering",
  enginering: "engineering",
  engneering: "engineering",
  enginer: "engineer",
  scientfic: "scientific",
  scintific: "scientific",
  casioo: "casio",
  casioe: "casio",
  macbok: "macbook",
  macboook: "macbook",
  macbookk: "macbook",
  labtop: "laptop",
  laptp: "laptop",
  laptob: "laptop",
  iphoen: "iphone",
  iphon: "iphone",
  chargr: "charger",
  chrger: "charger",
  hedphones: "headphones",
  headphnes: "headphones",
  headfones: "headphones",
  airpds: "airpods",
  erbuds: "earbuds",
  thnkpad: "thinkpad",
  thinkpd: "thinkpad",
  elctronics: "electronics",
  electrnoics: "electronics",
  electonics: "electronics",
  frige: "fridge",
  refridgerator: "refrigerator",
  keybord: "keyboard",
  blutooth: "bluetooth",

  // Textbooks & Academics
  textbok: "textbook",
  txtbook: "textbook",
  textboko: "textbook",
  calculs: "calculus",
  calclus: "calculus",
  stewrt: "stewart",
  stewartt: "stewart",
  mathemetics: "mathematics",
  mathmatics: "mathematics",
  maths: "mathematics",
  statitics: "statistics",
  statisics: "statistics",
  stastistics: "statistics",
  econmics: "economics",
  ecomomics: "economics",
  acounting: "accounting",
  accunting: "accounting",
  comercial: "commercial",
  zimbabw: "zimbabwe",
  zimbabawe: "zimbabwe",
  madhku: "madhuku",
  madhukuu: "madhuku",
  edtion: "edition",
  edshon: "edition",

  // Clothing & Fashion
  hoody: "hoodie",
  hoddie: "hoodie",
  jacet: "jacket",
  jaket: "jacket",
  jket: "jacket",
  snekers: "sneakers",
  sneekers: "sneakers",
  snkrs: "sneakers",
  cloting: "clothing",
  clothe: "clothing",
  swtr: "sweater",
  sweter: "sweater",
  flece: "fleece",
  vintge: "vintage",
  oversizd: "oversized",

  // Services & Campus Life
  tutring: "tutoring",
  tutorng: "tutoring",
  toturing: "tutoring",
  braidng: "braiding",
  briading: "braiding",
  haircutt: "haircut",
  laundri: "laundry",
  servces: "services",
  servis: "services",
  printng: "printing",
  hostl: "hostel",
  campas: "campus",
  mashava: "mashava",
  mucheke: "mucheke",
};

// 2. Canonical Campus Vocabulary with Frequency Weights
export const CAMPUS_VOCABULARY: Record<string, number> = {
  // Electronics
  calculator: 100,
  engineering: 95,
  scientific: 85,
  casio: 90,
  laptop: 95,
  macbook: 85,
  thinkpad: 80,
  iphone: 85,
  charger: 85,
  headphones: 85,
  airpods: 80,
  bluetooth: 75,
  electronics: 90,
  fridge: 85,
  keyboard: 75,
  mouse: 70,
  monitor: 75,
  adapter: 75,
  screen: 70,
  battery: 75,
  powerbank: 80,
  speaker: 75,

  // Textbooks & Subjects
  textbook: 100,
  calculus: 90,
  stewart: 85,
  mathematics: 90,
  statistics: 85,
  probability: 80,
  accounting: 85,
  economics: 85,
  finance: 80,
  financial: 85,
  commercial: 80,
  law: 90,
  madhuku: 85,
  zimbabwe: 85,
  edition: 90,
  physics: 80,
  chemistry: 80,
  biology: 75,
  sociology: 70,
  psychology: 70,
  exam: 80,
  past: 75,
  papers: 75,
  notes: 80,
  summaries: 75,

  // Clothing & Apparel
  clothing: 95,
  hoodie: 90,
  jacket: 90,
  bomber: 80,
  fleece: 85,
  sweater: 80,
  sweatshirt: 75,
  sneakers: 90,
  shoes: 85,
  vintage: 80,
  oversized: 75,
  denim: 75,
  boots: 75,
  tshirt: 75,
  shirt: 75,
  warm: 85,
  winter: 85,

  // Services
  services: 95,
  tutoring: 90,
  braiding: 90,
  haircut: 85,
  laundry: 80,
  printing: 80,
  typing: 75,
  repairs: 80,
  assignment: 75,
  coaching: 80,

  // Campus & Modifiers
  campus: 90,
  mashava: 90,
  mucheke: 90,
  chitepo: 85,
  hostel: 80,
  library: 85,
  cheap: 85,
  affordable: 80,
  clean: 75,
  original: 80,
  under: 85,
  below: 80,
};

// 3. Damerau-Levenshtein Edit Distance (insertions, deletions, substitutions, transpositions)
export function damerauLevenshtein(a: string, b: string): number {
  const la = a.length;
  const lb = b.length;
  if (la === 0) return lb;
  if (lb === 0) return la;

  const d: number[][] = Array.from({ length: la + 1 }, () =>
    new Array(lb + 1).fill(0)
  );

  for (let i = 0; i <= la; i++) d[i][0] = i;
  for (let j = 0; j <= lb; j++) d[0][j] = j;

  for (let i = 1; i <= la; i++) {
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,       // deletion
        d[i][j - 1] + 1,       // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[la][lb];
}

// 4. Correct a single token
export function correctSingleWord(word: string): {
  replacement: string;
  isCorrected: boolean;
  distance: number;
  confidence: number;
} {
  const clean = word.toLowerCase().trim();

  // If word is too short, numeric, or a special token ($20, MATH101, etc.), don't alter
  if (clean.length < 3 || /^\d+$/.test(clean) || /^\$\d+/.test(clean) || /^[a-z]{2,4}\d{2,4}$/.test(clean)) {
    return { replacement: word, isCorrected: false, distance: 0, confidence: 1 };
  }

  // Exact match in dictionary
  if (CAMPUS_VOCABULARY[clean]) {
    return { replacement: clean, isCorrected: false, distance: 0, confidence: 1 };
  }

  // Direct hit in known typos
  if (COMMON_TYPOS[clean]) {
    return {
      replacement: COMMON_TYPOS[clean],
      isCorrected: true,
      distance: damerauLevenshtein(clean, COMMON_TYPOS[clean]),
      confidence: 0.98,
    };
  }

  // Fuzzy search in dictionary within max edit distance
  const maxDistance = clean.length <= 4 ? 1 : 2;
  let bestCandidate = clean;
  let minDistance = Infinity;
  let bestScore = -Infinity;

  for (const [candidate, weight] of Object.entries(CAMPUS_VOCABULARY)) {
    // Length filter to skip huge disparities
    if (Math.abs(candidate.length - clean.length) > maxDistance) continue;

    const dist = damerauLevenshtein(clean, candidate);
    if (dist <= maxDistance) {
      // Score: heavily reward smaller distance, tiebreak with corpus frequency
      const score = (10 - dist * 4) * 100 + weight;
      if (score > bestScore) {
        bestScore = score;
        minDistance = dist;
        bestCandidate = candidate;
      }
    }
  }

  if (bestCandidate !== clean && minDistance <= maxDistance) {
    const confidence = Math.max(0.5, 1 - minDistance / Math.max(clean.length, 4));
    return {
      replacement: bestCandidate,
      isCorrected: true,
      distance: minDistance,
      confidence,
    };
  }

  return { replacement: word, isCorrected: false, distance: 0, confidence: 1 };
}

// 5. Main Auto-Correction Pipeline for User Query
export function autoCorrectQuery(query: string): AutoCorrectResult {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      originalQuery: query,
      correctedQuery: query,
      hasCorrection: false,
      corrections: [],
      explanation: null,
    };
  }

  // Split query preserving punctuation/spacing
  const tokens = trimmed.split(/(\s+)/);
  const corrections: CorrectionDetail[] = [];
  const correctedTokens: string[] = [];

  for (const token of tokens) {
    // If whitespace, retain
    if (/^\s+$/.test(token)) {
      correctedTokens.push(token);
      continue;
    }

    const { replacement, isCorrected, distance, confidence } = correctSingleWord(token);
    if (isCorrected && replacement.toLowerCase() !== token.toLowerCase()) {
      corrections.push({
        original: token,
        replacement,
        distance,
        confidence,
      });
      correctedTokens.push(replacement);
    } else {
      correctedTokens.push(token);
    }
  }

  const correctedQuery = correctedTokens.join("");
  const hasCorrection = corrections.length > 0;

  let explanation: string | null = null;
  if (hasCorrection) {
    if (corrections.length === 1) {
      explanation = `Did you mean "${corrections[0].replacement}" instead of "${corrections[0].original}"?`;
    } else {
      explanation = `Auto-corrected typos for campus search: ${corrections
        .map((c) => `"${c.original}" → "${c.replacement}"`)
        .join(", ")}`;
    }
  }

  return {
    originalQuery: query,
    correctedQuery,
    hasCorrection,
    corrections,
    explanation,
  };
}
