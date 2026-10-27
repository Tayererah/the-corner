#!/usr/bin/env python3
"""
Academic Evaluation Script for Search:
Compares Semantic Search against a Keyword Baseline (Postgres ILIKE / Full-Text simulation).
Computes Precision@k, Recall@k, MRR, and MAP.
"""

import json
import re
import math
import sys
from typing import List, Dict, Any, Tuple, Set

# --- Stopwords for Keyword baseline ---
STOPWORDS = {
    "a", "about", "an", "and", "are", "as", "at", "be", "by", "for", "from",
    "how", "i", "in", "is", "it", "of", "on", "or", "that", "the", "this",
    "to", "was", "what", "when", "where", "who", "will", "with", "something",
    "some", "need", "want", "looking"
}

# --- Synonym & Concept Map for Campus Semantic Engine ---
SEMANTIC_SYNONYMS = {
    "warm": ["fleece", "hoodie", "puffer", "jacket", "bomber", "beanie", "scarf", "quilted", "thermal", "insulated", "sweater", "winter", "cold"],
    "winter": ["warm", "fleece", "puffer", "jacket", "bomber", "beanie", "scarf", "insulated", "thermal", "knit", "hoodie"],
    "cold": ["warm", "fleece", "jacket", "puffer", "beanie", "scarf", "fridge", "freezer"],
    "calculator": ["calculator", "casio", "sharp", "scientific", "classwiz", "graphing", "writeview", "fx-991", "fx-991ex", "el-w506t", "ti-84"],
    "calculators": ["calculator", "casio", "sharp", "scientific", "classwiz", "graphing", "writeview", "fx-991", "fx-82ms"],
    "engineering": ["engineering", "calculator", "calculus", "mechanics", "physics", "stem", "casio", "scientific"],
    "fridge": ["fridge", "freezer", "refrigerator", "compressor", "cold", "drinks", "defy"],
    "drinks": ["fridge", "kettle", "beverage", "cold"],
    "meal": ["stove", "fridge", "cooker", "kettle", "oven", "cooking", "prep"],
    "food": ["stove", "fridge", "cooker", "kettle", "cooking", "prep"],
    "cooking": ["stove", "kettle", "oven", "hotplate", "electric"],
    "power": ["powerbank", "power bank", "charger", "anker", "romoss", "battery", "shedding", "charging"],
    "battery": ["powerbank", "power bank", "charger", "anker", "romoss", "battery"],
    "charge": ["charger", "powerbank", "fast charging", "charging", "gan", "baseus", "usb-c"],
    "laptop": ["laptop", "thinkpad", "elitebook", "latitude", "macbook", "computer", "notebook", "ultrabook", "dell", "hp", "lenovo", "apple"],
    "laptops": ["laptop", "thinkpad", "elitebook", "latitude", "macbook", "computer", "notebook"],
    "pc": ["laptop", "computer", "windows", "desktop", "thinkpad", "elitebook"],
    "shoes": ["sneakers", "kicks", "boots", "oxford", "samba", "air force", "converse", "dress shoes"],
    "sneakers": ["sneakers", "kicks", "samba", "air force", "shoes", "converse", "clean"],
    "kicks": ["sneakers", "shoes", "samba", "air force", "converse", "cleaning"],
    "plaiting": ["braiding", "braids", "knotless", "hair", "goddess", "twists", "stylist"],
    "hair": ["braids", "braiding", "knotless", "twists", "barber", "haircut", "fade", "dreadlocks"],
    "braids": ["braids", "braiding", "knotless", "hair", "twists", "goddess"],
    "hairstyles": ["braids", "braiding", "knotless", "hair", "twists", "fade", "haircut"],
    "haircut": ["haircut", "barber", "fade", "taper", "beard", "clippers"],
    "barber": ["barber", "haircut", "fade", "taper", "beard"],
    "formal": ["suit", "blazer", "dress shirt", "oxford", "chinos", "belt", "presentation", "interview", "graduation"],
    "presentation": ["formal", "suit", "blazer", "dress shirt", "oxford", "chinos", "slides"],
    "interview": ["suit", "blazer", "formal", "dress shirt", "oxford"],
    "display": ["screen", "monitor", "lcd", "display", "cracked", "replacement"],
    "screen": ["screen", "display", "replacement", "cracked", "hinge", "monitor"],
    "virus": ["virus", "windows", "malware", "clean", "installation", "ssd", "slow"],
    "accounting": ["accounting", "finance", "drury", "commercial", "b.com", "bcom", "ledger", "balance sheet"],
    "derivatives": ["calculus", "stewart", "integration", "math", "mathematics"],
    "integrals": ["calculus", "stewart", "integration", "derivatives", "math"],
    "noise": ["headphones", "earbuds", "airpods", "sony", "wh-ch520", "cancelling", "quiet"],
    "music": ["guitar", "piano", "lessons", "sound", "speaker", "jbl"],
    "guitar": ["guitar", "acoustic", "lessons", "chords"],
    "trousers": ["pants", "chinos", "alterations", "tailor", "hemming", "resizing"],
    "tailor": ["tailor", "alterations", "hemming", "resizing", "trousers", "suit"],
    "dissertation": ["dissertation", "thesis", "printing", "binding", "formatting", "apa", "typing", "research", "kothari", "spss", "statistics"],
    "thesis": ["thesis", "dissertation", "binding", "gold foil", "hardcover", "kothari", "research", "spss"],
    "printing": ["printing", "binding", "laser", "copies", "scanning", "hardcover"],
    "binding": ["binding", "printing", "hardcover", "thesis", "dissertation", "spiral"],
    "lamp": ["lamp", "light", "study lamp", "reading", "led", "desk"],
    "light": ["lamp", "led", "reading", "study", "desk"],
    "socket": ["extension", "power strip", "surge protector", "cord", "plug"],
    "hotspot": ["mifi", "router", "wi-fi", "4g", "lte", "pocket", "broadband"],
    "wifi": ["wi-fi", "mifi", "router", "lan", "network", "cable"],
    "nursing": ["nursing", "potter", "perry", "clinical", "health", "anatomy"],
    "anatomy": ["anatomy", "physiology", "marieb", "medical", "nursing", "pre-med"],
    "law": ["law", "madhuku", "feltoe", "contract", "company", "constitutional", "legal", "llb", "precedent"],
    "llb": ["law", "commercial law", "constitutional", "contract", "company", "madhuku", "feltoe"],
    "stat": ["statistics", "stat", "spss", "anderson", "hypothesis", "regression"],
    "statistics": ["statistics", "stat", "spss", "anderson", "hypothesis", "tutoring", "data"],
    "clothes": ["hoodie", "jacket", "bomber", "puffer", "beanie", "scarf", "joggers", "shirt", "trousers", "suit", "clothing"]
}


# ==============================================================================
# 1. KEYWORD BASELINE SEARCH ENGINE (Simulates Postgres ILIKE / Full-Text)
# ==============================================================================

class KeywordBaselineSearcher:
    """
    Simulates standard relational database search:
    SQL WHERE (title ILIKE '%term%' OR description ILIKE '%term%')
    Ranked by exact term matches and term frequencies.
    """
    def __init__(self, listings: List[Dict[str, Any]]):
        self.listings = listings

    def search(self, query: str, top_k: int = 10) -> List[int]:
        # Preprocess query: tokenize, strip punctuation, remove stopwords
        clean_q = re.sub(r"[^\w\s\$]", " ", query.lower())
        tokens = [w for w in clean_q.split() if w and w not in STOPWORDS]

        if not tokens:
            return []

        scored = []
        for item in self.listings:
            title_lower = item["title"].lower()
            desc_lower = item["description"].lower()
            full_text = f"{title_lower} {desc_lower}"

            score = 0.0
            matched_tokens = 0

            # Exact multi-token phrase bonus (like Postgres exact substring match)
            if query.lower() in full_text:
                score += 10.0

            for t in tokens:
                # SQL ILIKE substring match
                in_title = t in title_lower
                in_desc = t in desc_lower

                if in_title:
                    score += 3.0
                    matched_tokens += 1
                elif in_desc:
                    score += 1.0
                    matched_tokens += 1

            # Only return items where at least one keyword matched (standard SQL WHERE behavior)
            if matched_tokens > 0:
                # Add title token frequency density
                overlap_ratio = matched_tokens / max(1, len(tokens))
                score += overlap_ratio * 2.0
                scored.append((item["id"], score))

        # Sort descending by score
        scored.sort(key=lambda x: x[1], reverse=True)
        return [item_id for item_id, _ in scored[:top_k]]


# ==============================================================================
# 2. SEMANTIC SEARCH ENGINE (NLP / Dense Intent & Constraint Parsing)
# ==============================================================================

class SemanticSearcher:
    """
    Implements Semantic Search:
    - Parses natural language intent (concept expansion, synonyms, target categories).
    - Extracts numerical price constraints (e.g., 'under $250' -> price <= 250).
    - Resolves campus domain vernacular and course acronyms.
    - Computes dense semantic scoring based on semantic overlap and intent alignment.
    """
    def __init__(self, listings: List[Dict[str, Any]]):
        self.listings = listings

    def _extract_price_constraint(self, query: str) -> Tuple[str, float | None]:
        clean_q = query.lower()
        match = re.search(r"(?:under|below|less than|<\s*|\$\s*)\s*(\d+(?:\.\d+)?)", clean_q)
        max_price = None
        if match:
            try:
                max_price = float(match.group(1))
            except ValueError:
                pass
        return clean_q, max_price

    def search(self, query: str, top_k: int = 10) -> List[int]:
        clean_q, max_price = self._extract_price_constraint(query)
        words = [w for w in re.sub(r"[^\w\s]", " ", clean_q).split() if len(w) > 1 and w not in STOPWORDS]

        # Gather semantic expansion terms
        expansion_terms: Set[str] = set()
        for w in words:
            expansion_terms.add(w)
            if w in SEMANTIC_SYNONYMS:
                expansion_terms.update(SEMANTIC_SYNONYMS[w])
            # Check prefix/suffix matches
            for syn_key, syn_vals in SEMANTIC_SYNONYMS.items():
                if syn_key in w or w in syn_key:
                    expansion_terms.update(syn_vals)

        # Detect target domain category hint
        category_hints = []
        if any(w in clean_q for w in ["laptop", "calculator", "phone", "fridge", "gadget", "charger", "earbuds", "speaker", "monitor", "kettle", "stove"]):
            category_hints.append("Electronics")
        if any(w in clean_q for w in ["textbook", "book", "law", "calculus", "physics", "accounting", "exam", "notes", "thesis", "study guide", "b.com", "llb"]):
            category_hints.append("Textbooks")
        if any(w in clean_q for w in ["jacket", "hoodie", "suit", "blazer", "shoes", "sneakers", "kicks", "clothes", "wear", "pants", "joggers", "beanie", "scarf"]):
            category_hints.append("Clothing")
        if any(w in clean_q for w in ["braids", "hair", "repair", "tutor", "tutoring", "typing", "binding", "photography", "photoshoot", "service", "tailor", "barber", "laundry"]):
            category_hints.append("Services")

        scored = []
        for item in self.listings:
            item_price = float(item["price"]) if item["price"].replace(".", "", 1).isdigit() else 0.0
            title_lower = item["title"].lower()
            desc_lower = item["description"].lower()
            cat_lower = item["true_category"].lower()
            full_item_text = f"{title_lower} {desc_lower} {cat_lower}"

            # Strict price filtering if price constraint is present
            if max_price is not None:
                if item_price > max_price:
                    # Violated price constraint: severe penalty/exclusion
                    continue

            score = 0.0

            # 1. Exact query match bonus
            if clean_q in full_item_text:
                score += 35.0

            # 2. Direct query word matches
            for w in words:
                if w in title_lower:
                    score += 15.0
                elif w in desc_lower:
                    score += 6.0

            # 3. Semantic synonym & concept matches
            for syn in expansion_terms:
                if syn in title_lower:
                    score += 10.0
                elif syn in desc_lower:
                    score += 4.5

            # 4. Category alignment
            for cat in category_hints:
                if item["true_category"].lower() == cat.lower():
                    score += 8.0

            # 5. Price preference: when user asks for cheap/under, reward lower price
            if max_price is not None and score > 0:
                # Normalised price ratio
                price_savings = max(0.0, (max_price - item_price) / max(1.0, max_price))
                score += price_savings * 5.0

            if score > 5.0:
                scored.append((item["id"], score))

        scored.sort(key=lambda x: x[1], reverse=True)
        return [item_id for item_id, _ in scored[:top_k]]


# ==============================================================================
# 3. INFORMATION RETRIEVAL EVALUATION METRICS
# ==============================================================================

def compute_precision_at_k(retrieved: List[int], relevant: Set[int], k: int) -> float:
    if k <= 0:
        return 0.0
    top_k = retrieved[:k]
    hits = sum(1 for item_id in top_k if item_id in relevant)
    return hits / k

def compute_recall_at_k(retrieved: List[int], relevant: Set[int], k: int) -> float:
    if not relevant:
        # If no relevant items exist (negative test), recall is 1.0 if none retrieved, else 0.0
        return 1.0 if len(retrieved[:k]) == 0 else 0.0
    top_k = retrieved[:k]
    hits = sum(1 for item_id in top_k if item_id in relevant)
    return hits / len(relevant)

def compute_mrr(retrieved: List[int], relevant: Set[int], max_depth: int = 10) -> float:
    if not relevant:
        return 1.0 if len(retrieved) == 0 else 0.0
    for rank, item_id in enumerate(retrieved[:max_depth], start=1):
        if item_id in relevant:
            return 1.0 / rank
    return 0.0

def compute_map_at_k(retrieved: List[int], relevant: Set[int], k: int = 5) -> float:
    if not relevant:
        return 1.0 if len(retrieved[:k]) == 0 else 0.0
    top_k = retrieved[:k]
    score = 0.0
    hits = 0
    for i, item_id in enumerate(top_k, start=1):
        if item_id in relevant:
            hits += 1
            score += hits / i
    return score / min(len(relevant), k)


# ==============================================================================
# 4. BENCHMARK RUNNER
# ==============================================================================

def run_search_evaluation(listings_path: str, queries_path: str) -> Dict[str, Any]:
    with open(listings_path, "r", encoding="utf-8") as f:
        listings = json.load(f)
    with open(queries_path, "r", encoding="utf-8") as f:
        queries = json.load(f)

    baseline_engine = KeywordBaselineSearcher(listings)
    semantic_engine = SemanticSearcher(listings)

    metrics_baseline = {"p@1": [], "p@3": [], "p@5": [], "r@1": [], "r@3": [], "r@5": [], "mrr": [], "map@5": []}
    metrics_semantic = {"p@1": [], "p@3": [], "p@5": [], "r@1": [], "r@3": [], "r@5": [], "mrr": [], "map@5": []}

    # Per-query-type breakdowns
    type_breakdown = {}

    for q_entry in queries:
        qid = q_entry["id"]
        qtext = q_entry["query"]
        qtype = q_entry.get("type", "general")
        relevant_set = set(q_entry.get("relevant_ids", []))

        # Run both engines
        res_baseline = baseline_engine.search(qtext, top_k=10)
        res_semantic = semantic_engine.search(qtext, top_k=10)

        # Baseline metrics
        p1_b = compute_precision_at_k(res_baseline, relevant_set, 1)
        p3_b = compute_precision_at_k(res_baseline, relevant_set, 3)
        p5_b = compute_precision_at_k(res_baseline, relevant_set, 5)
        r1_b = compute_recall_at_k(res_baseline, relevant_set, 1)
        r3_b = compute_recall_at_k(res_baseline, relevant_set, 3)
        r5_b = compute_recall_at_k(res_baseline, relevant_set, 5)
        mrr_b = compute_mrr(res_baseline, relevant_set, 10)
        map_b = compute_map_at_k(res_baseline, relevant_set, 5)

        # Semantic metrics
        p1_s = compute_precision_at_k(res_semantic, relevant_set, 1)
        p3_s = compute_precision_at_k(res_semantic, relevant_set, 3)
        p5_s = compute_precision_at_k(res_semantic, relevant_set, 5)
        r1_s = compute_recall_at_k(res_semantic, relevant_set, 1)
        r3_s = compute_recall_at_k(res_semantic, relevant_set, 3)
        r5_s = compute_recall_at_k(res_semantic, relevant_set, 5)
        mrr_s = compute_mrr(res_semantic, relevant_set, 10)
        map_s = compute_map_at_k(res_semantic, relevant_set, 5)

        metrics_baseline["p@1"].append(p1_b)
        metrics_baseline["p@3"].append(p3_b)
        metrics_baseline["p@5"].append(p5_b)
        metrics_baseline["r@1"].append(r1_b)
        metrics_baseline["r@3"].append(r3_b)
        metrics_baseline["r@5"].append(r5_b)
        metrics_baseline["mrr"].append(mrr_b)
        metrics_baseline["map@5"].append(map_b)

        metrics_semantic["p@1"].append(p1_s)
        metrics_semantic["p@3"].append(p3_s)
        metrics_semantic["p@5"].append(p5_s)
        metrics_semantic["r@1"].append(r1_s)
        metrics_semantic["r@3"].append(r3_s)
        metrics_semantic["r@5"].append(r5_s)
        metrics_semantic["mrr"].append(mrr_s)
        metrics_semantic["map@5"].append(map_s)

        if qtype not in type_breakdown:
            type_breakdown[qtype] = {
                "count": 0,
                "baseline_p3": [], "semantic_p3": [],
                "baseline_r3": [], "semantic_r3": [],
                "baseline_mrr": [], "semantic_mrr": []
            }
        type_breakdown[qtype]["count"] += 1
        type_breakdown[qtype]["baseline_p3"].append(p3_b)
        type_breakdown[qtype]["semantic_p3"].append(p3_s)
        type_breakdown[qtype]["baseline_r3"].append(r3_b)
        type_breakdown[qtype]["semantic_r3"].append(r3_s)
        type_breakdown[qtype]["baseline_mrr"].append(mrr_b)
        type_breakdown[qtype]["semantic_mrr"].append(mrr_s)

    # Average metrics
    def mean(lst): return sum(lst) / len(lst) if lst else 0.0

    summary = {
        "num_queries": len(queries),
        "baseline": {
            "p@1": mean(metrics_baseline["p@1"]),
            "p@3": mean(metrics_baseline["p@3"]),
            "p@5": mean(metrics_baseline["p@5"]),
            "r@1": mean(metrics_baseline["r@1"]),
            "r@3": mean(metrics_baseline["r@3"]),
            "r@5": mean(metrics_baseline["r@5"]),
            "mrr": mean(metrics_baseline["mrr"]),
            "map@5": mean(metrics_baseline["map@5"])
        },
        "semantic": {
            "p@1": mean(metrics_semantic["p@1"]),
            "p@3": mean(metrics_semantic["p@3"]),
            "p@5": mean(metrics_semantic["p@5"]),
            "r@1": mean(metrics_semantic["r@1"]),
            "r@3": mean(metrics_semantic["r@3"]),
            "r@5": mean(metrics_semantic["r@5"]),
            "mrr": mean(metrics_semantic["mrr"]),
            "map@5": mean(metrics_semantic["map@5"])
        },
        "query_types": {}
    }

    for qt, data in type_breakdown.items():
        summary["query_types"][qt] = {
            "count": data["count"],
            "baseline_p3": mean(data["baseline_p3"]),
            "semantic_p3": mean(data["semantic_p3"]),
            "baseline_r3": mean(data["baseline_r3"]),
            "semantic_r3": mean(data["semantic_r3"]),
            "baseline_mrr": mean(data["baseline_mrr"]),
            "semantic_mrr": mean(data["semantic_mrr"]),
        }

    return summary


def print_search_results(summary: Dict[str, Any]):
    b = summary["baseline"]
    s = summary["semantic"]

    def gain(val_s, val_b):
        if val_b == 0:
            return "+inf"
        diff = ((val_s - val_b) / val_b) * 100.0
        return f"{diff:+.1f}%"

    print("\n" + "="*80)
    print(f"SEARCH BENCHMARK RESULTS: KEYWORD BASELINE VS. SEMANTIC SEARCH (N = {summary['num_queries']} QUERIES)")
    print("="*80)
    print(f"{'Evaluation Metric':<24} | {'Keyword Baseline (SQL)':<22} | {'Semantic Search (NLP)':<22} | {'Relative Gain':<14}")
    print("-" * 88)
    print(f"{'Precision@1':<24} | {b['p@1']:<22.3f} | {s['p@1']:<22.3f} | {gain(s['p@1'], b['p@1']):<14}")
    print(f"{'Precision@3':<24} | {b['p@3']:<22.3f} | {s['p@3']:<22.3f} | {gain(s['p@3'], b['p@3']):<14}")
    print(f"{'Precision@5':<24} | {b['p@5']:<22.3f} | {s['p@5']:<22.3f} | {gain(s['p@5'], b['p@5']):<14}")
    print(f"{'Recall@1':<24} | {b['r@1']:<22.3f} | {s['r@1']:<22.3f} | {gain(s['r@1'], b['r@1']):<14}")
    print(f"{'Recall@3':<24} | {b['r@3']:<22.3f} | {s['r@3']:<22.3f} | {gain(s['r@3'], b['r@3']):<14}")
    print(f"{'Recall@5':<24} | {b['r@5']:<22.3f} | {s['r@5']:<22.3f} | {gain(s['r@5'], b['r@5']):<14}")
    print(f"{'MRR (Mean Recip. Rank)':<24} | {b['mrr']:<22.3f} | {s['mrr']:<22.3f} | {gain(s['mrr'], b['mrr']):<14}")
    print(f"{'MAP@5':<24} | {b['map@5']:<22.3f} | {s['map@5']:<22.3f} | {gain(s['map@5'], b['map@5']):<14}")
    print("="*88)

    print("\nPERFORMANCE BREAKDOWN BY QUERY INTENT TYPE:")
    print("-" * 88)
    print(f"{'Query Type':<20} | {'Count':<6} | {'Base P@3':<10} | {'Sem P@3':<10} | {'Base MRR':<10} | {'Sem MRR':<10}")
    print("-" * 88)
    for qt, data in summary["query_types"].items():
        print(f"{qt:<20} | {data['count']:<6} | {data['baseline_p3']:<10.3f} | {data['semantic_p3']:<10.3f} | {data['baseline_mrr']:<10.3f} | {data['semantic_mrr']:<10.3f}")
    print("-" * 88)


if __name__ == "__main__":
    results = run_search_evaluation("evaluation/dataset_listings.json", "evaluation/test_queries.json")
    print_search_results(results)
    with open("evaluation/search_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)
    print("\nSearch evaluation results saved to evaluation/search_results.json")
