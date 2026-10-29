import { tokenize, unique } from "./utils";

/**
 * Tiny, dependency-free multinomial Naive Bayes text classifier.
 *
 * This is intentionally self-contained so the project trains and predicts
 * without scikit-learn / Python. It is "good enough" to act as the second
 * routing layer behind the RAG retriever (the retriever handles semantics;
 * this classifier handles the *intent* of the message).
 *
 * Training data lives in `scripts/train-classifier.ts` which serialises a
 * `ModelBundle` JSON the API routes consume at runtime.
 */

export type Label = "admission" | "fees" | "placement" | "program" | "facility" | "scholarship" | "contact" | "campus" | "general";

export type ModelBundle = {
  version: string;
  trainedAt: string;
  labels: Label[];
  vocab: Record<string, number>; // token -> idx
  classPriors: Record<Label, number>; // log P(c)
  classWordLogProb: Record<Label, Record<number, number>>; // log P(w|c)
  alpha: number; // Laplace smoothing
  vocabSize: number;
  metrics?: {
    accuracy: number;
    precision: Record<Label, number>;
    recall: Record<Label, number>;
    f1: Record<Label, number>;
    confusion: Record<string, Record<string, number>>;
    /** Optional aggregates — present on models trained after Phase 5. */
    macro?: { precision: number; recall: number; f1: number };
    weighted?: { precision: number; recall: number; f1: number };
    perClass?: Record<string, { precision: number; recall: number; f1: number; support: number }>;
    correct?: number;
    total?: number;
    /** Where these numbers came from, e.g. "held-out test set". */
    evaluatedOn?: string;
  };
};

export type Prediction = {
  label: Label;
  confidence: number;
  scores: Record<Label, number>;
};

/**
 * Light, dependency-free stemming so plural/singular forms collapse to the same
 * feature (fees→fee, placements→placement, facilities→facility, companies→company).
 * Applied identically at train and predict time — the model stores the stemmed
 * vocabulary, so the two can never disagree.
 */
export function stem(word: string): string {
  const w = word;
  if (w.length <= 3) return w;
  if (w.endsWith("ies")) return w.slice(0, -3) + "y";
  if (w.endsWith("ses") || w.endsWith("xes") || w.endsWith("ches") || w.endsWith("shes")) {
    return w.slice(0, -2);
  }
  if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

/**
 * Feature extractor shared by training and inference: stemmed unigrams plus
 * adjacent bigrams. Bigrams give the Naive Bayes classifier phrase context
 * ("tell me about …") that unigrams alone miss.
 */
export function featurize(text: string): string[] {
  const unigrams = tokenize(text).map(stem);
  const bigrams: string[] = [];
  for (let i = 0; i < unigrams.length - 1; i++) {
    bigrams.push(`${unigrams[i]}_${unigrams[i + 1]}`);
  }
  return unique([...unigrams, ...bigrams]);
}

export class NaiveBayesClassifier {
  constructor(public model: ModelBundle) {}

  predict(text: string): Prediction {
    const tokens = featurize(text);
    const logScores: Record<string, number> = {};
    for (const c of this.model.labels) {
      let s = this.model.classPriors[c] ?? -Infinity;
      const wordLogProb = this.model.classWordLogProb[c] || {};
      for (const t of tokens) {
        const idx = this.model.vocab[t];
        if (idx !== undefined) s += wordLogProb[idx] ?? Math.log(this.model.alpha / this.model.vocabSize);
      }
      logScores[c] = s;
    }
    // Softmax to convert to probabilities
    const max = Math.max(...Object.values(logScores));
    const exps = Object.fromEntries(
      Object.entries(logScores).map(([k, v]) => [k, Math.exp(v - max)]),
    );
    const sum = Object.values(exps).reduce((a, b) => a + b, 0) || 1;
    const probs = Object.fromEntries(
      Object.entries(exps).map(([k, v]) => [k, v / sum]),
    ) as Record<Label, number>;
    const sorted = (Object.entries(probs) as [Label, number][]).sort((a, b) => b[1] - a[1]);
    return { label: sorted[0][0], confidence: sorted[0][1], scores: probs };
  }

  predictBatch(texts: string[]): Prediction[] {
    return texts.map((t) => this.predict(t));
  }
}

export function emptyModel(): ModelBundle {
  return {
    version: "0.0.0",
    trainedAt: new Date().toISOString(),
    labels: ["admission", "fees", "placement", "program", "facility", "scholarship", "contact", "campus", "general"],
    vocab: {},
    classPriors: {} as any,
    classWordLogProb: {} as any,
    alpha: 1,
    vocabSize: 0,
  };
}
