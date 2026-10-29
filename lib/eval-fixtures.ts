import type { Label } from "./ml-classifier";

/**
 * Canonical evaluation fixtures — one source of truth for BOTH the offline
 * scripts (`npm run train`, `npm run evaluate`) and the runtime API
 * (`/api/evaluation`). Keeping them here is what makes the dashboard numbers
 * reproducible: the CLI and the UI evaluate the exact same examples.
 *
 * IMPORTANT — provenance rules:
 *  - `CLASSIFIER_TEST_SET` is a HELD-OUT set. Its strings are deliberately
 *    disjoint from the training corpus in `scripts/train-classifier.ts`. The
 *    training script asserts this, so a held-out accuracy can never be inflated
 *    by evaluating on data the model memorised.
 *  - `CLASSIFIER_TARGETS` are PROJECT GOALS, not measurements. They are surfaced
 *    in the UI as targets and must never be presented as measured performance.
 */

/** Human-facing names for the nine intent labels (order matches the label union). */
export const CATEGORY_DISPLAY: Record<Label, string> = {
  admission: "Admission",
  fees: "Fees",
  placement: "Placement",
  program: "Programs",
  facility: "Facility",
  scholarship: "Scholarship",
  contact: "Contact",
  campus: "Campus",
  general: "General",
};

/** Display order used by the dashboard table. */
export const CATEGORY_ORDER: Label[] = [
  "admission",
  "fees",
  "placement",
  "program",
  "facility",
  "scholarship",
  "contact",
  "campus",
  "general",
];

/** A single labelled example for the intent classifier. */
export type ClassifierExample = { text: string; label: Label };

/**
 * Target/goal values for the classifier. These are NOT measured model outputs —
 * the UI labels them explicitly as targets and compares the measured values
 * against them.
 */
export const CLASSIFIER_TARGETS: {
  accuracy: number;
  precision: number;
  recall: number | null;
  f1: number;
  note: string;
} = {
  accuracy: 0.98,
  precision: 0.97,
  recall: null,
  f1: 0.91,
  note:
    "Project target values (Accuracy 98%, Precision 97%, F1 91%). Targets are goals, " +
    "not measured model performance — compare them against the measured column.",
};

/**
 * Held-out test set: 6 examples per category × 9 categories = 54 examples.
 * None of these strings appear in the training corpus.
 */
export const CLASSIFIER_TEST_SET: ClassifierExample[] = [
  // admission
  { text: "What are the admission requirements for B.Tech?", label: "admission" },
  { text: "Is there an entrance exam I need to clear?", label: "admission" },
  { text: "When can I submit my application form?", label: "admission" },
  { text: "Do you accept state level entrance scores?", label: "admission" },
  { text: "How do I apply for the M.Tech programme?", label: "admission" },
  { text: "What is the last date for MBA admissions?", label: "admission" },

  // fees
  { text: "How much does the B.Tech course cost per year?", label: "fees" },
  { text: "Are there any instalment plans for tuition?", label: "fees" },
  { text: "What is the total fee including hostel?", label: "fees" },
  { text: "Do you charge extra for lab usage?", label: "fees" },
  { text: "Can I pay the fees in two parts?", label: "fees" },
  { text: "What is the cost of the application form?", label: "fees" },

  // placement
  { text: "What salary can I expect after graduation?", label: "placement" },
  { text: "Which companies visited the campus last year?", label: "placement" },
  { text: "Tell me about the internship opportunities.", label: "placement" },
  { text: "What is the placement rate for MBA?", label: "placement" },
  { text: "Do you have a career development cell?", label: "placement" },
  { text: "How many offers were made in the last drive?", label: "placement" },

  // program
  { text: "Which undergraduate courses do you offer?", label: "program" },
  { text: "Do you have a course in data science?", label: "program" },
  { text: "What specialisations are available in engineering?", label: "program" },
  { text: "Is there a diploma programme?", label: "program" },
  { text: "What subjects are taught in BCA?", label: "program" },
  { text: "How long is the B.Des course?", label: "program" },

  // facility
  { text: "Is there a gym on the campus?", label: "facility" },
  { text: "How big is the central library?", label: "facility" },
  { text: "Do you provide bus transport?", label: "facility" },
  { text: "Are the hostels air conditioned?", label: "facility" },
  { text: "Is there wifi in the classrooms?", label: "facility" },
  { text: "Do you have a medical centre?", label: "facility" },

  // scholarship
  { text: "Do you offer any fee waivers?", label: "scholarship" },
  { text: "Is there financial help for meritorious students?", label: "scholarship" },
  { text: "What scholarships can a first year student get?", label: "scholarship" },
  { text: "Is there any support for economically weaker sections?", label: "scholarship" },
  { text: "Do you give tuition discounts for toppers?", label: "scholarship" },
  { text: "Are there grants for research students?", label: "scholarship" },

  // contact
  { text: "What is the phone number of the admissions office?", label: "contact" },
  { text: "How can I email the university?", label: "contact" },
  { text: "Where is the college located?", label: "contact" },
  { text: "Can I schedule a visit to the campus?", label: "contact" },
  { text: "What is the official website address?", label: "contact" },
  { text: "Who should I contact for admission queries?", label: "contact" },

  // campus
  { text: "What is student life like at Elzada?", label: "campus" },
  { text: "Are there any student clubs or societies?", label: "campus" },
  { text: "Tell me about the annual fest.", label: "campus" },
  { text: "Is there a student council?", label: "campus" },
  { text: "What extracurricular activities are available?", label: "campus" },
  { text: "Do you have a robotics club?", label: "campus" },

  // general
  { text: "Good morning", label: "general" },
  { text: "Can you help me?", label: "general" },
  { text: "What are you?", label: "general" },
  { text: "Bye", label: "general" },
  { text: "Thank you so much", label: "general" },
  { text: "I have a question", label: "general" },
];

/** RAG evaluation fixtures, shared by the CLI and `/api/evaluation`. */
export type RagEvalExample = {
  question: string;
  expectedAnswerContains?: string[];
  expectedCategory?: string;
  expectedIntent?: string;
};

export const RAG_EVAL_FIXTURES: RagEvalExample[] = [
  { question: "How can I apply for B.Tech at Elzada?", expectedCategory: "Admissions", expectedIntent: "admission", expectedAnswerContains: ["EAT", "JEE"] },
  { question: "What is the fee structure for B.Tech?", expectedCategory: "Fees & Scholarships", expectedIntent: "fees", expectedAnswerContains: ["2,65,000", "B.Tech"] },
  { question: "Tell me about placement highlights last year", expectedCategory: "Placements", expectedIntent: "placement", expectedAnswerContains: ["52 LPA", "Microsoft"] },
  { question: "Do you have hostel facilities?", expectedCategory: "Campus & Facilities", expectedIntent: "facility", expectedAnswerContains: ["hostel", "room"] },
  { question: "When does the application open for MBA?", expectedCategory: "Admissions", expectedIntent: "admission", expectedAnswerContains: ["28 February 2025"] },
  { question: "Are scholarships available?", expectedCategory: "Fees & Scholarships", expectedIntent: "scholarship", expectedAnswerContains: ["scholarship"] },
  { question: "How do I contact the admissions office?", expectedCategory: "Contact", expectedIntent: "contact", expectedAnswerContains: ["admissions@elzada.edu"] },
  { question: "What programs are offered at Elzada?", expectedCategory: "Programs", expectedIntent: "program" },
  { question: "Tell me about campus life and clubs", expectedCategory: "Campus & Facilities", expectedIntent: "campus", expectedAnswerContains: ["Aavartan"] },
  { question: "How much is the highest CTC offered last year?", expectedCategory: "Placements", expectedIntent: "placement", expectedAnswerContains: ["52 LPA"] },
];

/**
 * Guards the held-out invariant: throws if any test string also appears in the
 * training corpus. Call this from the training script before measuring.
 */
export function assertDisjoint(
  training: { text: string }[],
  test: { text: string }[] = CLASSIFIER_TEST_SET,
): void {
  const normalise = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
  const trainSet = new Set(training.map((e) => normalise(e.text)));
  const overlap = test.filter((e) => trainSet.has(normalise(e.text)));
  if (overlap.length > 0) {
    throw new Error(
      `[eval] Held-out test set overlaps the training corpus (${overlap.length} duplicate(s)): ` +
        overlap.map((e) => JSON.stringify(e.text)).join(", "),
    );
  }
}
