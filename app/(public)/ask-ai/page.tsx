import { Sparkles, Bot, ShieldCheck, Zap, BrainCircuit, ArrowRight } from "lucide-react";
import { Chatbot } from "@/components/chatbot";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import Link from "next/link";

export const metadata = { title: "Ask Elzada AI | Elzada Institute of Technology" };

const TIPS = [
  { icon: Sparkles, t: "Be specific", d: "Mention the program and year you're interested in for the most accurate answers.", accent: "text-primary" },
  { icon: Bot, t: "Ask follow-ups", d: "Elzada remembers context within a conversation — keep going!", accent: "text-accent" },
  { icon: ShieldCheck, t: "Verified knowledge", d: "Answers are grounded in our verified knowledge base with citations.", accent: "text-emerald-500" },
  { icon: Zap, t: "24×7", d: "Available any time, even outside admissions office hours.", accent: "text-amber-500" },
];

const PIPELINE = [
  { t: "Intent detection", d: "Naive Bayes classifier routes your question to the right context bucket." },
  { t: "Knowledge retrieval", d: "Vector similarity search over our verified RAG knowledge base of 1000+ entries." },
  { t: "Answer synthesis", d: "LLM composes a grounded answer with citations to the original source documents." },
  { t: "Continuous improvement", d: "Every interaction is evaluated for accuracy, relevance and user satisfaction." },
];

export default function AskAIPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 space-y-14 md:space-y-20">
      <ScrollReveal preset="fadeUpBlur">
        <header className="max-w-3xl">
          <span className="chip chip-accent mb-4">
            <Sparkles className="size-3" /> Elzada AI Assistant
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
            Your personal{" "}
            <span className="gradient-text">admission counsellor.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Powered by a Retrieval-Augmented Generation pipeline over our verified knowledge base, with a Naive Bayes
            intent classifier routing your questions to the right context. Ask about admissions, programs, fees,
            placements or campus life.
          </p>
        </header>
      </ScrollReveal>

      <div className="grid gap-6 lg:grid-cols-12 items-start">
        <ScrollReveal className="lg:col-span-8" preset="fadeUp">
          <NeuCard variant="elevated" hover="none" className="p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/70 bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary via-primary/70 to-accent text-primary-foreground">
                    <BrainCircuit className="size-4.5" />
                  </div>
                  <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Elzada AI</div>
                  <div className="text-xs text-muted-foreground">Online · Average response 1.8s</div>
                </div>
              </div>
              <span className="chip !text-[10px] !py-0.5">RAG · v2.4</span>
            </div>
            <div className="p-4 sm:p-5">
              <Chatbot embedded />
            </div>
          </NeuCard>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-4 space-y-3" preset="staggerUp" delay={0.04}>
          {TIPS.map((tip) => (
            <RevealItem key={tip.t}>
              <NeuCard variant="soft" hover="none" className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`grid size-9 shrink-0 place-items-center rounded-xl neu-pressed ${tip.accent}`}>
                    <tip.icon className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{tip.t}</h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{tip.d}</p>
                  </div>
                </div>
              </NeuCard>
            </RevealItem>
          ))}

          <RevealItem>
            <NeuCard variant="elevated" hover="none" className="p-4 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
              <div className="relative flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent/20 text-accent">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Privacy first</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Conversations are stored with a session ID only to improve answers. We never share your data with
                    third parties.
                  </p>
                </div>
              </div>
            </NeuCard>
          </RevealItem>
        </ScrollReveal>
      </div>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="How it works" title="Under the hood of Elzada AI" description="A four-stage RAG pipeline designed for accuracy, groundedness and speed." />
      </ScrollReveal>

      <ScrollReveal preset="staggerUp" delay={0.05}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, i) => (
            <RevealItem key={step.t}>
              <NeuCard variant="flat" hover="lift" className="p-5 h-full relative">
                <div className="absolute -top-3 -left-3 grid size-8 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm shadow-lg shadow-primary/30">
                  {i + 1}
                </div>
                <h3 className="mt-3 font-semibold">{step.t}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{step.d}</p>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal preset="fadeUpBlur">
        <NeuCard variant="elevated" hover="none" className="relative overflow-hidden p-8 md:p-12 text-center">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Prefer to talk to a <span className="gradient-text">human?</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our admissions office is available Monday to Saturday at the Yelahanka campus — or email us anytime.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/contact" className="neu-btn neu-btn-primary">
                Contact admissions <ArrowRight className="size-4" />
              </Link>
              <Link href="/programs" className="neu-btn">
                Browse programs
              </Link>
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
