import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Cpu,
  Globe2,
  GraduationCap,
  LineChart,
  Microscope,
  Sparkles,
  Users,
  IndianRupee,
  TrendingUp,
  Building,
  CalendarDays,
} from "lucide-react";
import { Hero } from "@/components/hero";
import { StatsCards } from "@/components/stats-cards";
import { AdmissionsTimeline, type TimelineEvent } from "@/components/admissions-timeline";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";

const PROGRAM_HIGHLIGHTS = [
  { name: "B.Tech – Computer Science & Engineering", icon: Cpu, text: "AI-first CSE with industry certifications from AWS, NVIDIA, Cisco.", accent: "blue" as const },
  { name: "B.Tech – AI & Machine Learning", icon: Sparkles, text: "Dedicated AI curriculum with 6-month industry thesis.", accent: "navy" as const },
  { name: "B.Tech – Data Science", icon: LineChart, text: "Analytics, ML and big-data stack taught by industry faculty.", accent: "gold" as const },
  { name: "B.Tech – Electronics & VLSI", icon: Microscope, text: "Industry-grade labs and tie-ups with Texas Instruments.", accent: "blue" as const },
  { name: "B.Tech – Mechanical", icon: Building2, text: "Smart manufacturing, robotics and EV labs.", accent: "amber" as const },
  { name: "MBA – Business Analytics", icon: GraduationCap, text: "Two-year MBA with Bloomberg lab & international immersion.", accent: "pink" as const },
];

const RECRUITERS = [
  "Microsoft",
  "Google",
  "Amazon",
  "Atlassian",
  "Adobe",
  "Salesforce",
  "Uber",
  "JP Morgan",
  "NVIDIA",
  "Qualcomm",
  "Bosch",
  "TCS",
];

const TIMELINE: TimelineEvent[] = [
  { date: "1 Nov 2024", title: "Applications open for 2025", description: "Apply online for B.Tech, M.Tech, MBA and PhD.", status: "done" },
  { date: "12–15 Jan 2025", title: "EAT Round 1", description: "Online Elzada Admission Test – first window.", status: "done" },
  { date: "6–9 Apr 2025", title: "EAT Round 2", description: "Second attempt or first-time test-takers.", status: "current" },
  { date: "31 May 2025", title: "Application deadline", description: "Last date to submit your application.", status: "upcoming" },
  { date: "1 Aug 2025", title: "Classes commence", description: "Welcome to the 2025 cohort!", status: "upcoming" },
];

export default function HomePage() {
  return (
    <div className="space-y-20 md:space-y-28">
      <Hero />

      {/* Programs preview */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Academics"
            title="Programs built for the next decade"
            description="From B.Tech to PhD, every program at EIT is co-designed with industry and reviewed annually to stay ahead of the curve."
          />
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRAM_HIGHLIGHTS.map((p, i) => (
            <RevealItem key={p.name} delay={i * 0.06} preset="fade-up">
              <NeuCard hover="pop" className="p-5 sm:p-6 h-full group">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary shrink-0">
                    <p.icon className="size-5" />
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-muted-foreground/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
                  {p.name}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  {p.text}
                </p>
                <Link
                  href="/programs"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all"
                >
                  Explore program <ArrowRight className="size-3.5" />
                </Link>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="By the numbers"
            title="Why students choose Elzada"
            description="Three decades of academic excellence, a thriving alumni network, and outcomes that speak for themselves."
          />
        </ScrollReveal>
        <StatsCards
          items={[
            { label: "Years of legacy", value: 22, suffix: "+", hint: "Est. 2003 · NAAC A++", accent: "blue", icon: <Award className="size-5" /> },
            { label: "Campus size", value: 42, suffix: " acres", hint: "Green, solar, Wi-Fi-enabled", accent: "green", icon: <Building className="size-5" /> },
            { label: "Active students", value: 9500, suffix: "+", hint: "From 28 states & 18 countries", accent: "gold", icon: <Users className="size-5" /> },
            { label: "Patents granted", value: 32, hint: "120+ filed since 2018", accent: "pink", icon: <Sparkles className="size-5" /> },
          ]}
        />
      </section>

      {/* Placements preview */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <ScrollReveal preset="fade-up">
          <NeuCard className="p-6 md:p-10 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/18 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 size-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
            <div className="grid lg:grid-cols-12 gap-10 items-center relative">
              <div className="lg:col-span-7 space-y-5">
                <span className="chip border-gold-500/30 text-gold-600 dark:text-gold-400 !font-bold">
                  <Award className="size-3.5" /> Placements · Class of 2024
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-balance">
                  96% of eligible students placed.{" "}
                  <span className="gradient-text">Highest CTC ₹52 LPA.</span>
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                  Over 320 companies recruited from EIT in the 2023–24 cycle, including 28 new recruiters across product,
                  consulting, finance and core engineering. Our Career Development Centre delivers 1,200+ hours of
                  structured training from Year 1.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "Avg. CTC (CSE)", value: "₹14.2 L", Icon: IndianRupee },
                    { label: "Recruiters", value: "320+", Icon: Building2 },
                    { label: "Internships", value: "100%", Icon: CalendarDays },
                    { label: "International", value: "12", Icon: Globe2 },
                  ].map(({ label, value, Icon }) => (
                    <div key={label} className="neu-inset p-3.5 rounded-xl">
                      <div className="flex items-center gap-2 text-xs text-primary font-bold">
                        <Icon className="size-3.5" />
                        {label}
                      </div>
                      <div className="mt-1 text-xl font-extrabold tracking-tight text-foreground">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/placements"
                  className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:gap-2 transition-all"
                >
                  Read the full placement report <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="lg:col-span-5">
                <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
                  <TrendingUp className="size-3.5 text-primary" /> Top Recruiters
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {RECRUITERS.map((r) => (
                    <div
                      key={r}
                      className="neu-surface-xs !rounded-xl px-3 py-3 text-center text-xs sm:text-sm font-semibold text-foreground/85 hover:text-primary transition-colors"
                    >
                      {r}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </NeuCard>
        </ScrollReveal>
      </section>

      {/* Admissions timeline */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <ScrollReveal preset="fade-up" className="lg:col-span-5">
            <SectionHeader
              eyebrow="Admissions 2025"
              title="A simple, transparent timeline."
              description="No hidden steps. Track every milestone from application to enrolment with our admissions team and 24×7 AI counsellor."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/admissions" className="neu-btn-primary !px-5 !py-3 text-sm font-bold">
                View full admissions guide
              </Link>
              <Link href="/ask-ai" className="neu-btn !px-5 !py-3 text-sm font-semibold">
                <Sparkles className="size-4" /> Ask the AI counsellor
              </Link>
            </div>
          </ScrollReveal>
          <div className="lg:col-span-7">
            <AdmissionsTimeline events={TIMELINE} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 pb-4">
        <ScrollReveal preset="zoom">
          <NeuCard className="p-6 sm:p-10 md:p-14 overflow-hidden relative">
            <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  Ready to take the next step?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground max-w-lg">
                  Chat with Elzada AI for instant answers, or book a campus tour to experience Yelahanka campus in
                  person. Our admissions team responds within 24 hours.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 md:justify-end">
                <Link href="/ask-ai" className="neu-btn-primary !px-5 !py-3.5 text-sm font-bold">
                  <Sparkles className="size-4" /> Chat with Elzada AI
                </Link>
                <Link href="/contact" className="neu-btn !px-5 !py-3.5 text-sm font-semibold">
                  <Users className="size-4" /> Talk to admissions
                </Link>
                <Link href="/about" className="neu-btn !px-5 !py-3.5 text-sm font-semibold">
                  <BookOpen className="size-4" /> Discover EIT
                </Link>
              </div>
            </div>
          </NeuCard>
        </ScrollReveal>
      </section>
    </div>
  );
}
