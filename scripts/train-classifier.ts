import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { NaiveBayesClassifier, emptyModel, featurize, type Label, type ModelBundle } from "../lib/ml-classifier";
import { evaluateClassifier } from "../lib/evaluation";
import {
  CLASSIFIER_TARGETS,
  CLASSIFIER_TEST_SET,
  assertDisjoint,
} from "../lib/eval-fixtures";

/**
 * Trains a multinomial Naive Bayes intent classifier on the seed corpus below,
 * measures it on the HELD-OUT test set (`lib/eval-fixtures.ts`), and writes the
 * serialised model to `lib/classifier.model.json` for the runtime to load.
 *
 * Evaluation is deterministic: the model is always scored on the same disjoint
 * test set, so `npm run train` and `npm run evaluate` agree and repeated runs
 * do not drift. The disjointness guard throws if a test string ever leaks into
 * the training corpus, which would inflate the reported accuracy.
 *
 * Run with:  npm run train  |  npx tsx scripts/train-classifier.ts
 */

const TRAINING_DATA: { text: string; label: Label }[] = [
  // admission
  { text: "How do I apply for B.Tech at Elzada?", label: "admission" },
  { text: "What is the eligibility for MBA admissions?", label: "admission" },
  { text: "Tell me the entrance exam dates", label: "admission" },
  { text: "When does the application form open?", label: "admission" },
  { text: "What is the cutoff for computer science?", label: "admission" },
  { text: "Can I get direct admission through management quota?", label: "admission" },
  { text: "What documents are needed at the time of admission?", label: "admission" },
  { text: "How to apply for lateral entry B.Tech?", label: "admission" },
  { text: "I want to know about the entrance test syllabus", label: "admission" },
  { text: "Is there an entrance exam for PhD?", label: "admission" },
  { text: "When is the last date to submit the application?", label: "admission" },
  { text: "Tell me about the counselling process", label: "admission" },
  { text: "Do I need to appear for an interview?", label: "admission" },
  { text: "How can I register for the entrance test?", label: "admission" },
  { text: "What is the selection process for engineering?", label: "admission" },
  { text: "Is admission open for the new academic year?", label: "admission" },
  { text: "Can I apply online for admission?", label: "admission" },
  { text: "What are the eligibility criteria for BBA?", label: "admission" },

  // fees
  { text: "What is the fee structure for B.Tech?", label: "fees" },
  { text: "How much is the tuition fee?", label: "fees" },
  { text: "Do you have EMI options for fees?", label: "fees" },
  { text: "Is there any fee concession for girl students?", label: "fees" },
  { text: "What is the hostel fee?", label: "fees" },
  { text: "Tell me about the education loan partners", label: "fees" },
  { text: "What is the application fee?", label: "fees" },
  { text: "How much do international students pay?", label: "fees" },
  { text: "Are there any hidden charges in the fee?", label: "fees" },
  { text: "What is the annual tuition amount?", label: "fees" },
  { text: "How do I pay the semester fee?", label: "fees" },
  { text: "Is the fee refundable if I withdraw?", label: "fees" },
  { text: "What is the exam fee per semester?", label: "fees" },
  { text: "Do you charge for the hostel mess separately?", label: "fees" },
  { text: "How much is the registration amount?", label: "fees" },
  { text: "What is the total cost of the MBA programme?", label: "fees" },

  // scholarship
  { text: "Are there merit scholarships available?", label: "scholarship" },
  { text: "Tell me about financial aid options", label: "scholarship" },
  { text: "Can I get a scholarship based on JEE rank?", label: "scholarship" },
  { text: "What is the girl child scholarship?", label: "scholarship" },
  { text: "Is there a sports scholarship?", label: "scholarship" },
  { text: "How do I apply for a scholarship?", label: "scholarship" },
  { text: "Are there scholarships for minority students?", label: "scholarship" },
  { text: "What is the eligibility for a merit scholarship?", label: "scholarship" },
  { text: "Do you offer scholarships to top rankers?", label: "scholarship" },
  { text: "Is there any concession for defence wards?", label: "scholarship" },
  { text: "Are there research fellowships available?", label: "scholarship" },
  { text: "What financial support do you give to needy students?", label: "scholarship" },
  { text: "Can I avail a government scholarship here?", label: "scholarship" },
  { text: "Is there a tuition waiver for SC ST candidates?", label: "scholarship" },

  // placement
  { text: "What is the highest CTC offered last year?", label: "placement" },
  { text: "Tell me about the placement statistics", label: "placement" },
  { text: "Which companies recruit from campus?", label: "placement" },
  { text: "What is the average package for CSE?", label: "placement" },
  { text: "Do you provide internship support?", label: "placement" },
  { text: "How many students got placed last year?", label: "placement" },
  { text: "Is there a placement for MBA students?", label: "placement" },
  { text: "What is the median salary for graduates?", label: "placement" },
  { text: "Do you have a training and placement office?", label: "placement" },
  { text: "Which IT companies hire from your college?", label: "placement" },
  { text: "What is the placement percentage for 2024?", label: "placement" },
  { text: "Do companies offer pre placement offers?", label: "placement" },
  { text: "How many recruiters visit every year?", label: "placement" },
  { text: "What roles are offered to freshers?", label: "placement" },
  { text: "Is there campus hiring for core branches?", label: "placement" },
  { text: "What is the lowest package offered?", label: "placement" },

  // program
  { text: "What programs are offered at Elzada?", label: "program" },
  { text: "Tell me about the B.Tech specialisations", label: "program" },
  { text: "Do you have an MBA program?", label: "program" },
  { text: "Is there a BBA course?", label: "program" },
  { text: "What is the duration of M.Tech?", label: "program" },
  { text: "Tell me about the BCA curriculum", label: "program" },
  { text: "Do you offer a design degree?", label: "program" },
  { text: "What undergraduate courses are available?", label: "program" },
  { text: "Is there a PhD program in physics?", label: "program" },
  { text: "What specialisations does the MBA offer?", label: "program" },
  { text: "Do you have a course in artificial intelligence?", label: "program" },
  { text: "What is the syllabus for mechanical engineering?", label: "program" },
  { text: "Is there a part time degree option?", label: "program" },
  { text: "Which departments does the college have?", label: "program" },
  { text: "What is the curriculum for data science?", label: "program" },
  { text: "Do you offer a masters in computer applications?", label: "program" },

  // facility
  { text: "Tell me about hostel facilities", label: "facility" },
  { text: "Is there a swimming pool on campus?", label: "facility" },
  { text: "How is the library?", label: "facility" },
  { text: "Do you have labs for AI?", label: "facility" },
  { text: "Is there a sports ground?", label: "facility" },
  { text: "What about transportation from the city?", label: "facility" },
  { text: "Do you have a cafeteria and mess?", label: "facility" },
  { text: "Are there medical facilities on campus?", label: "facility" },
  { text: "Is the campus wifi enabled?", label: "facility" },
  { text: "Do the hostels have laundry service?", label: "facility" },
  { text: "What sports facilities are available?", label: "facility" },
  { text: "Is there a gymnasium for students?", label: "facility" },
  { text: "Do you have seminar halls and auditoriums?", label: "facility" },
  { text: "Are the classrooms equipped with projectors?", label: "facility" },
  { text: "Is there a bank or ATM inside the campus?", label: "facility" },
  { text: "Do you provide shuttle service to the hostel?", label: "facility" },

  // contact
  { text: "What is your contact number?", label: "contact" },
  { text: "Can you share your email id?", label: "contact" },
  { text: "What is the address of the college?", label: "contact" },
  { text: "How do I reach the campus?", label: "contact" },
  { text: "Can I book a campus visit?", label: "contact" },
  { text: "What is the helpline number for admission?", label: "contact" },
  { text: "How can I get in touch with the registrar?", label: "contact" },
  { text: "Who is the point of contact for admissions?", label: "contact" },
  { text: "What is the official email address?", label: "contact" },
  { text: "Where can I find directions to the university?", label: "contact" },
  { text: "Can I call the admissions office directly?", label: "contact" },
  { text: "Is there a whatsapp number for queries?", label: "contact" },
  { text: "How do I contact the placement cell?", label: "contact" },
  { text: "What is the mailing address of the institute?", label: "contact" },

  // campus
  { text: "Tell me about student life at Elzada", label: "campus" },
  { text: "What clubs can I join?", label: "campus" },
  { text: "When is the annual cultural fest?", label: "campus" },
  { text: "Are there entrepreneurship programs?", label: "campus" },
  { text: "What events happen on campus?", label: "campus" },
  { text: "Is there a student council or union?", label: "campus" },
  { text: "Tell me about the sports and cultural clubs", label: "campus" },
  { text: "Are there technical societies for students?", label: "campus" },
  { text: "What is the campus culture like?", label: "campus" },
  { text: "Do you organise hackathons?", label: "campus" },
  { text: "Is there a music or drama club?", label: "campus" },
  { text: "How active is the student community?", label: "campus" },
  { text: "What extracurricular activities exist?", label: "campus" },
  { text: "Are there student chapters of professional bodies?", label: "campus" },

  // general
  { text: "Hello", label: "general" },
  { text: "Hi there", label: "general" },
  { text: "Thanks", label: "general" },
  { text: "Thank you for the information", label: "general" },
  { text: "Who are you?", label: "general" },
  { text: "What can you do?", label: "general" },
  { text: "Hey", label: "general" },
  { text: "Good evening", label: "general" },
  { text: "Okay thanks", label: "general" },
  { text: "That is helpful", label: "general" },
  { text: "Are you a bot?", label: "general" },
  { text: "Nice to meet you", label: "general" },
];

function buildVocab(examples: { text: string }[]) {
  const vocab: Record<string, number> = {};
  let idx = 0;
  for (const ex of examples) {
    for (const t of featurize(ex.text)) {
      if (!(t in vocab)) vocab[t] = idx++;
    }
  }
  return { vocab, vocabSize: idx };
}

function buildModel(alpha = 1): ModelBundle {
  const model = emptyModel();
  model.alpha = alpha;
  const { vocab, vocabSize } = buildVocab(TRAINING_DATA);
  model.vocab = vocab;
  model.vocabSize = vocabSize;

  const counts: Record<string, number> = {};
  const classWordCounts: Record<string, Record<number, number>> = {};
  for (const l of model.labels) {
    counts[l] = 0;
    classWordCounts[l] = {};
  }

  for (const ex of TRAINING_DATA) {
    counts[ex.label] = (counts[ex.label] ?? 0) + 1;
    for (const t of featurize(ex.text)) {
      const i = vocab[t];
      if (i === undefined) continue;
      classWordCounts[ex.label][i] = (classWordCounts[ex.label][i] ?? 0) + 1;
    }
  }

  const N = TRAINING_DATA.length;
  for (const c of model.labels) {
    model.classPriors[c] = Math.log((counts[c] ?? 0) / N);
    const totalWords = Object.values(classWordCounts[c]).reduce((a, b) => a + b, 0);
    const denominator = totalWords + alpha * vocabSize;
    const wordLogProb: Record<number, number> = {};
    for (let i = 0; i < vocabSize; i++) {
      const num = (classWordCounts[c][i] ?? 0) + alpha;
      wordLogProb[i] = Math.log(num / denominator);
    }
    model.classWordLogProb[c] = wordLogProb;
  }
  model.version = "1.1.0";
  model.trainedAt = new Date().toISOString();
  return model;
}

function pct(v: number) {
  return `${(v * 100).toFixed(1)}%`;
}

function main() {
  // Fail loudly if a held-out example ever appears in the training corpus.
  assertDisjoint(TRAINING_DATA, CLASSIFIER_TEST_SET);

  console.log(
    `[train] corpus=${TRAINING_DATA.length} examples · held-out test set=${CLASSIFIER_TEST_SET.length} examples (disjoint)`,
  );

  const model = buildModel();
  const m = evaluateClassifier(model, CLASSIFIER_TEST_SET);

  console.log("");
  console.log(m.report);
  console.log("");
  console.log("Measured (held-out) vs project target");
  console.log(
    `  accuracy   measured ${pct(m.accuracy).padStart(6)}   target ${pct(CLASSIFIER_TARGETS.accuracy).padStart(6)}   ${
      m.accuracy >= CLASSIFIER_TARGETS.accuracy ? "MET" : "below target"
    }`,
  );
  console.log(
    `  precision  measured ${pct(m.macro.precision).padStart(6)}   target ${pct(CLASSIFIER_TARGETS.precision).padStart(6)}   ${
      m.macro.precision >= CLASSIFIER_TARGETS.precision ? "MET" : "below target"
    }`,
  );
  console.log(
    `  recall     measured ${pct(m.macro.recall).padStart(6)}   target ${"(none)".padStart(6)}`,
  );
  console.log(
    `  f1         measured ${pct(m.macro.f1).padStart(6)}   target ${pct(CLASSIFIER_TARGETS.f1).padStart(6)}   ${
      m.macro.f1 >= CLASSIFIER_TARGETS.f1 ? "MET" : "below target"
    }`,
  );

  model.metrics = {
    accuracy: m.accuracy,
    precision: m.precision as Record<Label, number>,
    recall: m.recall as Record<Label, number>,
    f1: m.f1 as Record<Label, number>,
    confusion: m.confusion,
    macro: m.macro,
    weighted: m.weighted,
    perClass: Object.fromEntries(
      Object.entries(m.perClass).map(([k, v]) => [
        k,
        { precision: v.precision, recall: v.recall, f1: v.f1, support: v.support },
      ]),
    ),
    correct: m.correct,
    total: m.total,
    evaluatedOn: `held-out test set (${CLASSIFIER_TEST_SET.length} examples, lib/eval-fixtures.ts)`,
  };

  const outPath = path.join(process.cwd(), "lib", "classifier.model.json");
  fs.writeFileSync(outPath, JSON.stringify(model, null, 2));
  console.log(`[train] Wrote ${outPath}`);

  // Quick sanity check across a few arbitrary phrasings.
  const clf = new NaiveBayesClassifier(model);
  for (const q of [
    "How much is the MBA fee?",
    "When does admission open?",
    "Tell me about placements",
    "What is the hostel like?",
  ]) {
    const p = clf.predict(q);
    console.log(`  "${q}" -> ${p.label} (${(p.confidence * 100).toFixed(1)}%)`);
  }
}

main();
