import Link from "next/link";
import { Award, BookOpen, Calendar, Globe2, Microscope, ScrollText, ArrowRight, GraduationCap } from "lucide-react";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";

export const metadata = { title: "University | Elzada Institute of Technology" };

const STAT_CARDS = [
  { icon: Award, t: "NAAC A++", s: "Highest grade from NAAC" },
  { icon: Globe2, t: "International recognition", s: "WES, AACSB, AIU" },
  { icon: ScrollText, t: "Autonomous degrees", s: "UGC authorised" },
  { icon: Microscope, t: "850+ papers / year", s: "32 patents granted" },
];

const ACADEMIC_GRID = [
  ["Two semesters", "Aug–Dec, Jan–May"],
  ["Credit system", "Choice-Based Credit System (CBCS)"],
  ["Grading", "10-point CGPA"],
  ["Distinction", "≥ 7.5 CGPA"],
  ["Passing", "≥ 5.0 CGPA"],
  ["Min. credits", "160–180 for UG programs"],
];

const RESEARCH_BULLETS = [
  "14 dedicated research centres",
  "32 patents granted, 120+ filed since 2018",
  "UGRIP programme for undergraduate research",
  "Sponsored research worth ₹80+ crore (last 5 yrs)",
];

const CALENDAR = [
  ["Orientation", "1–3 Aug"],
  ["Sem I begins", "4 Aug"],
  ["First sessional", "Sep"],
  ["End-sem exams", "Nov–Dec"],
  ["Sem II begins", "1 Jan"],
  ["Project reviews", "Mar"],
  ["End-sem exams", "Apr–May"],
  ["Convocation", "Jun"],
];

const PARTNERS = ["MIT", "NUS", "ETH", "TU Munich", "Toronto", "KAIST"];

export default function UniversityPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20 space-y-16 md:space-y-24">
      <ScrollReveal preset="fadeUpBlur">
        <header className="max-w-3xl">
          <span className="chip mb-4">The University</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
            A deemed university,{" "}
            <span className="gradient-text">recognised worldwide.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            Elzada Institute of Technology was conferred deemed-to-be-university status by the UGC in 2009. Our degrees
            are recognised globally and accepted by leading employers and graduate schools.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal preset="staggerUp">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STAT_CARDS.map((x) => (
            <RevealItem key={x.t}>
              <NeuCard variant="soft" hover="lift" className="p-5 h-full">
                <div className="grid size-11 place-items-center rounded-2xl neu-pressed text-primary">
                  <x.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-semibold">{x.t}</h3>
                <p className="text-sm text-muted-foreground mt-1">{x.s}</p>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Academics & Research" title="Rigorous curriculum, world-class output." description="A choice-based credit system with a strong research focus, supported by DST, SERB, DBT, ISRO, the European Commission and the Bill & Melinda Gates Foundation." />
      </ScrollReveal>

      <section className="grid gap-6 lg:grid-cols-12 items-start">
        <ScrollReveal className="lg:col-span-7" preset="fadeUp">
          <NeuCard variant="flat" hover="none" className="p-6 md:p-8 h-full">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl neu-pressed text-primary">
                <GraduationCap className="size-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-semibold">Academic Structure</h2>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              The university follows a Choice-Based Credit System (CBCS) with two semesters per year. Each semester has
              90 instructional days, two internal assessments, and an end-semester examination. Programs are graded on
              a 10-point CGPA scale.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {ACADEMIC_GRID.map(([t, s]) => (
                <div key={t} className="neu-surface-xs rounded-xl p-3.5">
                  <div className="text-xs text-muted-foreground">{t}</div>
                  <div className="text-sm font-semibold mt-1">{s}</div>
                </div>
              ))}
            </div>
          </NeuCard>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-5" preset="fadeUp" delay={0.1}>
          <NeuCard variant="flat" hover="none" className="p-6 md:p-8 h-full">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-2xl neu-pressed text-accent">
                <Microscope className="size-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-semibold">Research Output</h2>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              EIT publishes over 850 peer-reviewed papers annually with funding from national and international agencies.
              Our 14 research centres cover AI, quantum, biotech, robotics, sustainable energy and more.
            </p>
            <ul className="mt-5 space-y-2.5">
              {RESEARCH_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm">
                  <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
              Learn more about EIT <ArrowRight className="size-4" />
            </Link>
          </NeuCard>
        </ScrollReveal>
      </section>

      <ScrollReveal preset="fadeUpBlur">
        <NeuCard variant="elevated" hover="none" className="relative overflow-hidden p-6 md:p-10">
          <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="grid size-11 place-items-center rounded-2xl neu-pressed text-primary">
                <Calendar className="size-5" />
              </span>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Academic Calendar · 2025</h2>
                <p className="text-sm text-muted-foreground">Key dates for the upcoming academic year</p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {CALENDAR.map(([t, d], i) => (
                <div
                  key={t}
                  className="neu-surface-sm rounded-2xl p-4 transition-transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">{t}</span>
                    <span className="chip !px-2 !py-0.5 !text-[10px]">#{i + 1}</span>
                  </div>
                  <div className="mt-2 text-base font-semibold text-foreground">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Global" title="International Partnerships" description="120+ MoUs with universities across 35 countries — enabling student exchange, dual-degree and joint-research opportunities." />
      </ScrollReveal>

      <ScrollReveal preset="staggerUp">
        <NeuCard variant="flat" hover="none" className="p-6 md:p-8">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PARTNERS.map((p) => (
              <RevealItem key={p}>
                <div className="neu-surface rounded-xl p-5 text-center font-semibold text-foreground/90 hover:text-primary hover:scale-[1.03] transition-all">
                  {p}
                </div>
              </RevealItem>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-border/70">
            <p className="text-sm text-muted-foreground max-w-xl">
              Recent partners also include UC Berkeley, Imperial College London, NTU Singapore, University of Melbourne and Technical University of Denmark.
            </p>
            <Link href="/ask-ai" className="neu-btn neu-btn-accent">
              <BookOpen className="size-4" /> Ask about exchange programmes
            </Link>
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
