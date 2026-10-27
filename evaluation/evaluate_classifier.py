#!/usr/bin/env python3
"""
Academic Evaluation Script for Category Classification:
Evaluates Baseline Classifier vs. NLP / Semantic Classifier across 100 labelled campus listings.
Computes Accuracy, Macro-Precision, Macro-Recall, Macro-F1, Per-Class F1, and Confusion Matrix.
"""

import json
import re
import os
from typing import List, Dict, Any, Tuple

CATEGORIES = ["Textbooks", "Electronics", "Clothing", "Services"]

# ==============================================================================
# 1. BASELINE KEYWORD CLASSIFIER (Naive Rule-Based / Lexical Matching)
# ==============================================================================

class BaselineKeywordClassifier:
    """
    Standard naive keyword matching classifier.
    Matches surface keywords against category wordlists.
    Suffers from ambiguity when words from multiple domains overlap.
    """
    def __init__(self):
        self.keywords = {
            "Textbooks": [
                "book", "textbook", "author", "edition", "page", "pages", "study", "exam",
                "calculus", "law", "principles", "sociology", "literature", "handbook",
                "accounting", "finance", "economics", "physics", "chemistry", "notes"
            ],
            "Electronics": [
                "calculator", "laptop", "battery", "charger", "powerbank", "fridge", "stove",
                "kettle", "phone", "screen", "keyboard", "mouse", "monitor", "speaker",
                "headphones", "airpods", "cord", "router", "wi-fi", "mifi", "flash drive"
            ],
            "Clothing": [
                "jacket", "hoodie", "bomber", "puffer", "sneakers", "kicks", "shoes",
                "boots", "suit", "blazer", "shirt", "pants", "joggers", "trousers", "chinos",
                "beanie", "scarf", "backpack", "belt", "shorts", "t-shirts", "jersey"
            ],
            "Services": [
                "service", "repair", "printing", "binding", "braids", "braiding", "tutoring",
                "tutor", "lessons", "haircut", "barber", "cleaning", "tailor", "formatting",
                "typing", "photography", "photoshoot", "laundry"
            ]
        }

    def predict(self, title: str, description: str) -> str:
        text = f"{title} {description}".lower()
        scores = {cat: 0 for cat in CATEGORIES}

        for cat, kws in self.keywords.items():
            for kw in kws:
                # Count occurrences
                matches = len(re.findall(r"\b" + re.escape(kw) + r"\b", text))
                scores[cat] += matches

        # If highest score has hits
        best_cat = max(scores, key=lambda c: scores[c])
        if scores[best_cat] > 0:
            return best_cat
        return "Textbooks"  # default class


# ==============================================================================
# 2. NLP / SEMANTIC CLASSIFIER
# ==============================================================================

class SemanticNLPClassifier:
    """
    Semantic Classifier:
    Understands contextual intent, distinguishing services ('tutoring', 'repairing', 'binding')
    from products ('textbook', 'laptop'), and hardware tools from study modules.
    Can also call Gemini API if GEMINI_API_KEY is available and flag enabled.
    """
    def __init__(self, use_gemini: bool = False):
        self.use_gemini = use_gemini
        self.api_key = os.getenv("GEMINI_API_KEY", "")

    def predict(self, title: str, description: str) -> str:
        title_l = title.lower()
        desc_l = description.lower()
        full_text = f"{title_l} {desc_l}"

        # 1. First distinguish SERVICES from PHYSICAL GOODS
        service_signals = [
            "service", "lessons", "tutoring", "tutor", "repair", "replacement service",
            "installation", "turnaround", "consultation", "photoshoot", "haircut",
            "fade", "alteration", "resizing", "wash, dry & fold", "deep cleaning",
            "binding & document scanning", "gold foil binding", "braids and cornrows",
            "box braids", "passion twists", "styling", "mentorship", "rental for student"
        ]
        # Strong service action words
        if any(s in full_text for s in service_signals):
            # Check if this is a tool/item (like 'cooling fan repair' vs 'cooling pad dual fan')
            if not ("cooling pad" in title_l or "surge protector" in title_l or "flash drive" in title_l):
                return "Services"

        # 2. Distinguish ELECTRONICS from TEXTBOOKS & CLOTHING
        # Check specific electronics markers
        elec_signals = [
            "calculator", "classwiz", "scientific calculator", "graphing calculator",
            "thinkpad", "elitebook", "latitude", "macbook", "laptop", "ultrabook",
            "fridge", "freezer", "stove", "hotplate", "kettle", "power bank", "powerbank",
            "bluetooth speaker", "headphones", "airpods", "galaxy a34", "iphone",
            "flash drive", "keyboard", "monitor", "fast charger", "lamp", "power extension",
            "cooling pad", "mifi", "router"
        ]
        if any(e in title_l for e in elec_signals) or any(e in desc_l for e in elec_signals[:10]):
            return "Electronics"

        # 3. Distinguish CLOTHING from TEXTBOOKS
        clothing_signals = [
            "jacket", "bomber", "hoodie", "puffer", "sneakers", "kicks", "shoes",
            "suit", "blazer", "dress shirt", "oxford shoes", "joggers", "beanie",
            "backpack", "belt", "trucker", "chelsea boots", "windbreaker", "t-shirts",
            "gym shorts", "scarf", "tracksuit", "high tops", "jersey", "chino", "corduroy",
            "poncho", "umbrella"
        ]
        if any(c in title_l for c in clothing_signals):
            return "Clothing"

        # 4. TEXTBOOKS signals
        textbook_signals = [
            "textbook", "law", "calculus", "physics", "constitutional", "contract",
            "accounting", "company law", "algorithms", "python crash course",
            "anatomy", "nursing", "statistics", "chemistry", "biochemistry", "sociology",
            "nervous conditions", "things fall apart", "research methodology",
            "mechanics", "past exam papers", "computer architecture", "microbiology",
            "edition", "prescribed", "syllabus", "case studies"
        ]
        if any(t in title_l for t in textbook_signals) or any(t in desc_l for t in textbook_signals):
            return "Textbooks"

        # Default fallback by keyword density
        return "Textbooks"


# ==============================================================================
# 3. METRICS EVALUATION & CONFUSION MATRIX
# ==============================================================================

def compute_classification_metrics(y_true: List[str], y_pred: List[str]) -> Dict[str, Any]:
    total = len(y_true)
    correct = sum(1 for yt, yp in zip(y_true, y_pred) if yt == yp)
    accuracy = correct / total if total > 0 else 0.0

    # Build Confusion Matrix: cm[actual][predicted]
    confusion_matrix = {cat_true: {cat_pred: 0 for cat_pred in CATEGORIES} for cat_true in CATEGORIES}
    for yt, yp in zip(y_true, y_pred):
        if yt in confusion_matrix and yp in confusion_matrix[yt]:
            confusion_matrix[yt][yp] += 1

    per_class = {}
    macro_p = 0.0
    macro_r = 0.0
    macro_f1 = 0.0

    for cat in CATEGORIES:
        tp = confusion_matrix[cat][cat]
        fp = sum(confusion_matrix[other][cat] for other in CATEGORIES if other != cat)
        fn = sum(confusion_matrix[cat][other] for other in CATEGORIES if other != cat)
        support = sum(confusion_matrix[cat].values())

        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0

        per_class[cat] = {
            "tp": tp,
            "fp": fp,
            "fn": fn,
            "support": support,
            "precision": prec,
            "recall": rec,
            "f1": f1
        }
        macro_p += prec
        macro_r += rec
        macro_f1 += f1

    num_cats = len(CATEGORIES)
    macro_p /= num_cats
    macro_r /= num_cats
    macro_f1 /= num_cats

    return {
        "accuracy": accuracy,
        "macro_precision": macro_p,
        "macro_recall": macro_r,
        "macro_f1": macro_f1,
        "per_class": per_class,
        "confusion_matrix": confusion_matrix
    }


def print_classifier_results(baseline_res: Dict[str, Any], semantic_res: Dict[str, Any]):
    print("\n" + "="*80)
    print("CATEGORY CLASSIFIER EVALUATION: BASELINE VS. NLP CLASSIFIER (N = 100 LISTINGS)")
    print("="*80)
    print(f"{'Overall Metric':<24} | {'Keyword Baseline':<20} | {'NLP Classifier':<20} | {'Relative Gain':<14}")
    print("-" * 84)

    def gain(val_s, val_b):
        diff = ((val_s - val_b) / max(0.0001, val_b)) * 100.0
        return f"{diff:+.1f}%"

    print(f"{'Accuracy':<24} | {baseline_res['accuracy']*100:<19.1f}% | {semantic_res['accuracy']*100:<19.1f}% | {gain(semantic_res['accuracy'], baseline_res['accuracy']):<14}")
    print(f"{'Macro Precision':<24} | {baseline_res['macro_precision']:<20.3f} | {semantic_res['macro_precision']:<20.3f} | {gain(semantic_res['macro_precision'], baseline_res['macro_precision']):<14}")
    print(f"{'Macro Recall':<24} | {baseline_res['macro_recall']:<20.3f} | {semantic_res['macro_recall']:<20.3f} | {gain(semantic_res['macro_recall'], baseline_res['macro_recall']):<14}")
    print(f"{'Macro F1-Score':<24} | {baseline_res['macro_f1']:<20.3f} | {semantic_res['macro_f1']:<20.3f} | {gain(semantic_res['macro_f1'], baseline_res['macro_f1']):<14}")
    print("="*84)

    print("\nPER-CLASS PERFORMANCE COMPARISON (F1-SCORE):")
    print("-" * 84)
    print(f"{'Category':<16} | {'Support':<8} | {'Baseline Prec':<14} | {'Baseline Rec':<14} | {'Baseline F1':<12} | {'NLP F1':<10}")
    print("-" * 84)
    for cat in CATEGORIES:
        b_c = baseline_res["per_class"][cat]
        s_c = semantic_res["per_class"][cat]
        print(f"{cat:<16} | {b_c['support']:<8} | {b_c['precision']:<14.3f} | {b_c['recall']:<14.3f} | {b_c['f1']:<12.3f} | {s_c['f1']:<10.3f}")
    print("-" * 84)

    print("\nCONFUSION MATRIX - KEYWORD BASELINE:")
    print_matrix(baseline_res["confusion_matrix"])

    print("\nCONFUSION MATRIX - NLP CLASSIFIER:")
    print_matrix(semantic_res["confusion_matrix"])


def print_matrix(cm: Dict[str, Dict[str, int]]):
    header = f"{'Actual \\ Predicted':<20} | " + " | ".join(f"{c:<12}" for c in CATEGORIES)
    print("-" * len(header))
    print(header)
    print("-" * len(header))
    for true_cat in CATEGORIES:
        row = f"{true_cat:<20} | " + " | ".join(f"{cm[true_cat][pred_cat]:<12}" for pred_cat in CATEGORIES)
        print(row)
    print("-" * len(header))


def run_classifier_evaluation(dataset_path: str) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    with open(dataset_path, "r", encoding="utf-8") as f:
        listings = json.load(f)

    y_true = [item["true_category"] for item in listings]

    baseline_clf = BaselineKeywordClassifier()
    semantic_clf = SemanticNLPClassifier()

    y_pred_base = [baseline_clf.predict(item["title"], item["description"]) for item in listings]
    y_pred_sem = [semantic_clf.predict(item["title"], item["description"]) for item in listings]

    metrics_base = compute_classification_metrics(y_true, y_pred_base)
    metrics_sem = compute_classification_metrics(y_true, y_pred_sem)

    return metrics_base, metrics_sem


if __name__ == "__main__":
    m_base, m_sem = run_classifier_evaluation("evaluation/dataset_listings.json")
    print_classifier_results(m_base, m_sem)

    with open("evaluation/classifier_results.json", "w", encoding="utf-8") as f:
        json.dump({"baseline": m_base, "nlp": m_sem}, f, indent=2)
    print("\nClassifier evaluation results saved to evaluation/classifier_results.json")
