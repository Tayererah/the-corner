#!/usr/bin/env python3
"""
Master Academic Evaluation Runner:
Executes both:
1. Information Retrieval (Search) Benchmark: Keyword Baseline vs. Semantic Search
2. Category Classification Benchmark: Baseline Keyword Matching vs. NLP Classifier
Generates consolidated console summary and updates evaluation artifacts.
"""

import os
import sys
import json
from evaluate_search import run_search_evaluation, print_search_results
from evaluate_classifier import run_classifier_evaluation, print_classifier_results

def main():
    print("\n" + "="*80)
    print("      THE CORNER (CAMPUS MARKETPLACE) — ACADEMIC EVALUATION SUITE")
    print("="*80)
    print("Corpus: 100 Labelled Campus Listings across 4 Core Categories")
    print("Query Test Set: 70 Labelled Student Queries with Ground-Truth Relevancy")
    print("="*80)

    # 1. Search Benchmark
    print("\n[PART 1/2] RUNNING RETRIEVAL & SEARCH BENCHMARK...")
    search_res = run_search_evaluation("evaluation/dataset_listings.json", "evaluation/test_queries.json")
    print_search_results(search_res)

    with open("evaluation/search_results.json", "w", encoding="utf-8") as f:
        json.dump(search_res, f, indent=2)

    # 2. Classifier Benchmark
    print("\n[PART 2/2] RUNNING CATEGORY CLASSIFIER BENCHMARK...")
    base_clf, sem_clf = run_classifier_evaluation("evaluation/dataset_listings.json")
    print_classifier_results(base_clf, sem_clf)

    with open("evaluation/classifier_results.json", "w", encoding="utf-8") as f:
        json.dump({"baseline": base_clf, "nlp": sem_clf}, f, indent=2)

    # Consolidated Master Summary
    print("\n" + "="*80)
    print("                   FINAL ACADEMIC DEMO SLIDE SUMMARY TABLE")
    print("="*80)
    b_s = search_res["baseline"]
    s_s = search_res["semantic"]

    def gain(s, b):
        return f"{((s - b) / max(0.0001, b)) * 100:+.1f}%"

    print(f"{'TASK / METRIC':<26} | {'KEYWORD BASELINE':<20} | {'SEMANTIC / NLP':<20} | {'GAIN (Δ)':<12}")
    print("-" * 84)
    print(f"{'Search Precision@1':<26} | {b_s['p@1']:<20.3f} | {s_s['p@1']:<20.3f} | {gain(s_s['p@1'], b_s['p@1']):<12}")
    print(f"{'Search Precision@3':<26} | {b_s['p@3']:<20.3f} | {s_s['p@3']:<20.3f} | {gain(s_s['p@3'], b_s['p@3']):<12}")
    print(f"{'Search Recall@3':<26} | {b_s['r@3']:<20.3f} | {s_s['r@3']:<20.3f} | {gain(s_s['r@3'], b_s['r@3']):<12}")
    print(f"{'Search Recall@5':<26} | {b_s['r@5']:<20.3f} | {s_s['r@5']:<20.3f} | {gain(s_s['r@5'], b_s['r@5']):<12}")
    print(f"{'Search MRR (Top-10)':<26} | {b_s['mrr']:<20.3f} | {s_s['mrr']:<20.3f} | {gain(s_s['mrr'], b_s['mrr']):<12}")
    print(f"{'Search MAP@5':<26} | {b_s['map@5']:<20.3f} | {s_s['map@5']:<20.3f} | {gain(s_s['map@5'], b_s['map@5']):<12}")
    print("-" * 84)
    print(f"{'Classifier Accuracy':<26} | {base_clf['accuracy']*100:<19.1f}% | {sem_clf['accuracy']*100:<19.1f}% | {gain(sem_clf['accuracy'], base_clf['accuracy']):<12}")
    print(f"{'Classifier Macro-F1':<26} | {base_clf['macro_f1']:<20.3f} | {sem_clf['macro_f1']:<20.3f} | {gain(sem_clf['macro_f1'], base_clf['macro_f1']):<12}")
    print(f"{'Services Class F1':<26} | {base_clf['per_class']['Services']['f1']:<20.3f} | {sem_clf['per_class']['Services']['f1']:<20.3f} | {gain(sem_clf['per_class']['Services']['f1'], base_clf['per_class']['Services']['f1']):<12}")
    print("="*84)
    print("Evaluation completed successfully. Artifacts generated in ./evaluation/\n")


if __name__ == "__main__":
    main()
