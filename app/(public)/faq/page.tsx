"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Sparkles, HelpCircle, Phone, Mail, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const FAQS = [
  { q: "Is EIT approved by AICTE and accredited?", a: "Yes. EIT is AICTE-approved, NAAC A++ accredited and a UGC-recognised deemed university. Many of our engineering programs are ABET-aligned." },
  { q: "What is the medium of instruction?", a: "English is the medium of instruction for all programs at EIT." },
  { q: "Are hostel facilities guaranteed for first-year students?", a: "Yes, hostel allocation is guaranteed for all first-year students who apply before the deadline." },
  { q: "Can I change my branch after first year?", a: "Yes, branch change is permitted after the first year based on merit (CGPA) and seat availability." },
  { q: "What entrance exams are accepted?", a: "EIT accepts EAT, JEE Main (B.Tech), GATE (M.Tech), and CAT/XAT/MAT/CMAT/GMAT/EMAT (MBA). International applicants can submit SAT/ACT/IB/A-Levels." },
  { q: "Are there scholarships available?", a: "Yes. We offer merit-cum-means scholarships up to 100% tuition waiver, sports scholarships, girl-child scholarships and defence quota waivers." },
  { q: "Is there a placement guarantee?", a: "While we don't guarantee a placement, our Career Development Centre supports every eligible student. In 2023-24, 96% of eligible students were placed." },
  { q: "What is the fee structure?", a: "B.Tech tuition is ₹2,65,000/year; M.Tech is ₹1,85,000/year; MBA is ₹3,40,000/year. Hostel + mess is ₹95,000/year. EMI option is available." },
  { q: "How can I contact the admissions office?", a: "Email admissions@elzada.edu.in or call +91-80-6123-4567 (Mon–Sat, 9:30 AM – 5:30 PM IST). You can also chat with our AI counsellor 24/7." },
  { q: "Is there a dress code?", a: "There is no formal dress code on campus. Lab-appropriate attire is required in laboratories." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-20 space-y-14 md:space-y-20">
      <ScrollReveal preset="fadeUpBlur">
        <header className="max-w-3xl">
          <span className="chip mb-4">FAQ</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
            Frequently asked{" "}
            <span className="gradient-text">questions.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Quick answers to the most common questions about admissions, programs and campus life. Can&apos;t find what
            you&apos;re looking for? Chat with our AI counsellor — it&apos;s available 24/7.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/ask-ai" className="neu-btn neu-btn-accent">
              <Sparkles className="size-4" /> Ask Elzada AI
            </Link>
            <Link href="/admissions" className="neu-btn">
              Admissions overview <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Questions" title="All the answers, in one place." />
      </ScrollReveal>

      <ScrollReveal preset="staggerUp" delay={0.02}>
        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <NeuCard
                key={f.q}
                variant="soft"
                hover="none"
                className={cn("!p-0 overflow-hidden", isOpen && "ring-1 ring-primary/30")}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 md:px-6 md:py-5 text-left"
                >
                  <span className="flex items-start gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-lg neu-pressed text-primary mt-0.5">
                      <HelpCircle className="size-3.5" />
                    </span>
                    <span className="font-medium text-sm md:text-base leading-relaxed">{f.q}</span>
                  </span>
                  <span
                    className={cn(
                      "grid size-8 shrink-0 place-items-center rounded-full neu-surface-xs transition-transform duration-300",
                      isOpen && "rotate-180 bg-accent/15 text-accent"
                    )}
                  >
                    <ChevronDown className="size-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-5 pb-5 md:px-6 md:pb-6">
                        <div className="ml-10 md:ml-11 pl-3 border-l-2 border-accent/40 text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                          {f.a}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </NeuCard>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal preset="fadeUpBlur">
        <NeuCard variant="elevated" hover="none" className="relative overflow-hidden p-8 md:p-10">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight">
                Still have questions? <span className="gradient-text">We&apos;re here.</span>
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Reach out to our admissions team directly or drop by the campus at Allalasandra, Yelahanka, Bengaluru.
              </p>
            </div>
            <div className="space-y-3">
              <Link href="tel:+918061234567" className="neu-btn w-full justify-center">
                <Phone className="size-4" /> +91-80-6123-4567
              </Link>
              <Link href="mailto:admissions@elzada.edu.in" className="neu-btn neu-btn-primary w-full justify-center">
                <Mail className="size-4" /> admissions@elzada.edu.in
              </Link>
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
