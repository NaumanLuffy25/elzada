import type { ModelBundle, Prediction } from "./ml-classifier";
import { NaiveBayesClassifier } from "./ml-classifier";
import type { RagResult } from "./rag";

/**
 * Offline evaluation utilities for the RAG pipeline and the intent
 * classifier. Designed to run as part of `scripts/evaluate-models.ts`.
 */

export type RagExample = {
  question: string;
  expectedAnswerContains?: string[];
  expectedCategory?: string;
  expectedIntent?: string;
};

export type RagMetrics = {
  total: number;
  answered: number;
  refusalRate: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  avgConfidence: number;
  top1Accuracy: number; // did top source match expected category?
  exactAnswerRate: number; // did answer contain all expected substrings?
  perCategory: Record<string, { count: number; top1: number }>;
  perIntent: Record<string, { count: number; top1: number }>;
};

export async function evaluateRag(
  examples: RagExample[],
  run: (q: string) => Promise<RagResult>,
): Promise<RagMetrics> {
  const results: { ex: RagExample; r: RagResult }[] = [];
  for (const ex of examples) {
    const r = await run(ex.question);
    results.push({ ex, r });
  }

  const latencies = results.map((x) => x.r.latency_ms).sort((a, b) => a - b);
  const p = (q: number) => latencies[Math.min(latencies.length - 1, Math.floor(q * latencies.length))];

  const answered = results.filter((x) => !/don't have specific information/i.test(x.r.answer)).length;
  const top1 = results.filter((x) => {
    if (!x.ex.expectedCategory) return false;
    return x.r.sources[0]?.doc.category === x.ex.expectedCategory;
  }).length;
  const exact = results.filter((x) => {
    if (!x.ex.expectedAnswerContains?.length) return false;
    const lower = x.r.answer.toLowerCase();
    return x.ex.expectedAnswerContains.every((s) => lower.includes(s.toLowerCase()));
  }).length;

  const perCategory: Record<string, { count: number; top1: number }> = {};
  const perIntent: Record<string, { count: number; top1: number }> = {};
  for (const { ex, r } of results) {
    if (ex.expectedCategory) {
      const c = ex.expectedCategory;
      perCategory[c] ??= { count: 0, top1: 0 };
      perCategory[c].count += 1;
      if (r.sources[0]?.doc.category === c) perCategory[c].top1 += 1;
    }
    if (ex.expectedIntent) {
      const i = ex.expectedIntent;
      perIntent[i] ??= { count: 0, top1: 0 };
      perIntent[i].count += 1;
      if (r.intent === i) perIntent[i].top1 += 1;
    }
  }

  return {
    total: results.length,
    answered,
    refusalRate: 1 - answered / Math.max(1, results.length),
    avgLatencyMs: Math.round(latencies.reduce((a, b) => a + b, 0) / Math.max(1, latencies.length)),
    p50LatencyMs: p(0.5),
    p95LatencyMs: p(0.95),
    avgConfidence: Number(
      (results.reduce((a, x) => a + x.r.confidence, 0) / Math.max(1, results.length)).toFixed(3),
    ),
    top1Accuracy: top1 / Math.max(1, results.filter((x) => x.ex.expectedCategory).length),
    exactAnswerRate: exact / Math.max(1, results.filter((x) => x.ex.expectedAnswerContains).length),
    perCategory,
    perIntent,
  };
}

// ---------------- Classifier metrics ----------------

/** Per-class precision / recall / F1 plus the class's support (true count). */
export type ClassScore = {
  precision: number;
  recall: number;
  f1: number;
  support: number;
  predicted: number;
};

export type ClassifierMetrics = {
  /** Fraction of examples whose predicted label equals the true label. */
  accuracy: number;
  correct: number;
  total: number;
  /** Unweighted mean of the per-class scores (classes present in truth or predictions). */
  macro: { precision: number; recall: number; f1: number };
  /** Support-weighted mean of the per-class scores. */
  weighted: { precision: number; recall: number; f1: number };
  /** Detailed per-class breakdown. */
  perClass: Record<string, ClassScore>;
  /** Flat maps kept for existing consumers (label → score). */
  precision: Record<string, number>;
  recall: Record<string, number>;
  f1: Record<string, number>;
  /** confusion[actual][predicted] = count. */
  confusion: Record<string, Record<string, number>>;
  /** Human-readable text report (same numbers as the fields above). */
  report: string;
};

const safeDiv = (num: number, den: number): number => (den === 0 ? 0 : num / den);

/**
 * Multinomial Naive Bayes evaluation with correct precision / recall / F1,
 * macro and support-weighted aggregates, and a full confusion matrix.
 *
 * Every reported number is derived from the confusion matrix built here, so the
 * dashboard can never disagree with the underlying evaluation.
 */
export function evaluateClassifier(
  model: ModelBundle,
  examples: { text: string; label: string }[],
): ClassifierMetrics {
  const clf = new NaiveBayesClassifier(model);
  const labels = model.labels;
  const cm: Record<string, Record<string, number>> = {};
  for (const a of labels) cm[a] = Object.fromEntries(labels.map((b) => [b, 0]));

  let correct = 0;
  for (const ex of examples) {
    const p: Prediction = clf.predict(ex.text);
    if (p.label === ex.label) correct++;
    if (cm[ex.label]) cm[ex.label][p.label] = (cm[ex.label][p.label] ?? 0) + 1;
  }

  const precision: Record<string, number> = {};
  const recall: Record<string, number> = {};
  const f1: Record<string, number> = {};
  const perClass: Record<string, ClassScore> = {};

  for (const l of labels) {
    // Truth row = support, predicted column = number of times it was output.
    const support = labels.reduce((acc, b) => acc + (cm[l]?.[b] ?? 0), 0);
    const predicted = labels.reduce((acc, a) => acc + (cm[a]?.[l] ?? 0), 0);
    const tp = cm[l]?.[l] ?? 0;
    const p = safeDiv(tp, predicted);
    const r = safeDiv(tp, support);
    const f = p + r === 0 ? 0 : (2 * p * r) / (p + r);
    precision[l] = p;
    recall[l] = r;
    f1[l] = f;
    perClass[l] = { precision: p, recall: r, f1: f, support, predicted };
  }

  // Macro over classes that are actually present (truth or prediction) so an
  // absent class never drags the average toward zero.
  const present = labels.filter((l) => (perClass[l]?.support ?? 0) + (perClass[l]?.predicted ?? 0) > 0);
  const denom = present.length || 1;
  const macro = {
    precision: present.reduce((a, l) => a + precision[l], 0) / denom,
    recall: present.reduce((a, l) => a + recall[l], 0) / denom,
    f1: present.reduce((a, l) => a + f1[l], 0) / denom,
  };

  const totalSupport = present.reduce((a, l) => a + perClass[l].support, 0);
  const weighted = {
    precision: safeDiv(present.reduce((a, l) => a + precision[l] * perClass[l].support, 0), totalSupport),
    recall: safeDiv(present.reduce((a, l) => a + recall[l] * perClass[l].support, 0), totalSupport),
    f1: safeDiv(present.reduce((a, l) => a + f1[l] * perClass[l].support, 0), totalSupport),
  };

  const total = examples.length;
  const accuracy = safeDiv(correct, total);

  const lines: string[] = [];
  lines.push(`examples: ${total}   accuracy: ${accuracy.toFixed(4)}`);
  lines.push(
    `macro   precision: ${macro.precision.toFixed(4)}   recall: ${macro.recall.toFixed(4)}   f1: ${macro.f1.toFixed(4)}`,
  );
  lines.push(
    `weighted precision: ${weighted.precision.toFixed(4)}   recall: ${weighted.recall.toFixed(4)}   f1: ${weighted.f1.toFixed(4)}`,
  );
  lines.push("");
  lines.push("label         support   precision  recall   f1");
  for (const l of labels) {
    lines.push(
      `${l.padEnd(12)} ${String(perClass[l].support).padStart(7)}   ${precision[l]
        .toFixed(3)
        .padStart(8)}  ${recall[l].toFixed(3).padStart(6)}  ${f1[l].toFixed(3).padStart(6)}`,
    );
  }

  return {
    accuracy,
    correct,
    total,
    macro,
    weighted,
    perClass,
    precision,
    recall,
    f1,
    confusion: cm,
    report: lines.join("\n"),
  };
}
