import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { generateAnswer } from "../lib/rag";
import { evaluateRag, evaluateClassifier } from "../lib/evaluation";
import type { ModelBundle } from "../lib/ml-classifier";
import {
  CLASSIFIER_TARGETS,
  CLASSIFIER_TEST_SET,
  RAG_EVAL_FIXTURES,
  type RagEvalExample,
} from "../lib/eval-fixtures";

/**
 * End-to-end evaluation. Runs the RAG pipeline and the intent classifier against
 * the shared fixtures in `lib/eval-fixtures.ts` (the same ones the runtime API
 * uses) and writes a Markdown report.
 *
 * Run with:  npm run evaluate  |  npx tsx scripts/evaluate-models.ts
 */

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

async function main() {
  console.log("==> Evaluating RAG pipeline");
  const ragMetrics = await evaluateRag(RAG_EVAL_FIXTURES as RagEvalExample[], generateAnswer);
  console.log(
    `    fixtures=${ragMetrics.total}  answered=${ragMetrics.answered}  top1=${pct(ragMetrics.top1Accuracy)}  ` +
      `exact=${pct(ragMetrics.exactAnswerRate)}  p95=${ragMetrics.p95LatencyMs}ms`,
  );

  const modelPath = path.join(process.cwd(), "lib", "classifier.model.json");
  let classifierSection = "(skipped — run `npm run train` first)";
  let classifierMarkdown = "";

  if (fs.existsSync(modelPath)) {
    const model = JSON.parse(fs.readFileSync(modelPath, "utf-8")) as ModelBundle;
    const trained = model.vocabSize > 0 && !String(model.version).includes("placeholder");

    if (!trained) {
      console.log("==> Classifier: bundled model is a placeholder — run `npm run train` first.");
      classifierSection = "(placeholder model — run `npm run train`)";
    } else {
      console.log("==> Evaluating intent classifier on the held-out test set");
      const m = evaluateClassifier(model, CLASSIFIER_TEST_SET);
      console.log(m.report);
      classifierSection = m.report;

      const cmp = [
        ["Accuracy", m.accuracy, CLASSIFIER_TARGETS.accuracy],
        ["Precision (macro)", m.macro.precision, CLASSIFIER_TARGETS.precision],
        ["Recall (macro)", m.macro.recall, null],
        ["F1 (macro)", m.macro.f1, CLASSIFIER_TARGETS.f1],
      ] as const;

      classifierMarkdown = [
        `Model version: ${model.version} (trained ${model.trainedAt}, ${model.vocabSize} features)`,
        `Test set: ${CLASSIFIER_TEST_SET.length} held-out examples (disjoint from training)`,
        "",
        "| Metric | Measured | Target | Status |",
        "| --- | --- | --- | --- |",
        ...cmp.map(([name, measured, target]) =>
          target === null
            ? `| ${name} | ${pct(measured)} | (none) | — |`
            : `| ${name} | ${pct(measured)} | ${pct(target)} | ${measured >= target ? "met" : "below target"} |`,
        ),
        "",
        "> Targets are project goals, not measured model performance.",
      ].join("\n");
    }
  }

  const report = [
    "# Elzada AI – Model Evaluation Report",
    "",
    `Generated at: ${new Date().toISOString()}`,
    "",
    "## RAG Pipeline",
    "",
    "```json",
    JSON.stringify(ragMetrics, null, 2),
    "```",
    "",
    "## Intent Classifier",
    "",
    classifierMarkdown || "```\n" + classifierSection + "\n```",
    "",
    "## Raw classifier report",
    "",
    "```",
    classifierSection,
    "```",
    "",
  ].join("\n");

  const outPath = path.join(process.cwd(), "evaluation-report.md");
  fs.writeFileSync(outPath, report);
  console.log(`==> Wrote ${outPath}`);
}

main().catch((err) => {
  console.error("[evaluate] Fatal:", err);
  process.exit(1);
});
