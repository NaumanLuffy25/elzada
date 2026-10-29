import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  FileCheck2,
  GraduationCap,
  ScrollText,
  BadgeDollarSign,
  IndianRupee,
  CalendarDays,
  BadgeCheck,
  FileDigit,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import { AdmissionsTimeline, type TimelineEvent } from "@/components/admissions-timeline";
import { EnquiryForm } from "@/components/enquiry-form";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Admissions 2025 | Elzada Institute of Technology",
  description:
    "Admissions 2025 at Elzada Institute of Technology, Yelahanka Bengaluru. Eligibility, steps, dates, scholarships, and 4-step transparent process. Chat with Elzada AI or submit enquiry.",
};

const TIMELINE_2025: TimelineEvent[] = [
  { date: "1 Nov 2024", title: "Applications open", description: "Apply online for B.Tech, M.Tech, MBA, B.Des, Law & PhD.", status: "done" },
  { date: "12–15 Jan 2025", title: "EAT Round 1", description: "Online Elzada Admission Test – first window.", status: "done" },
  { date: "25 Jan 2025", title: "Result – EAT 1", description: "Scorecards published on the student portal.", status: "done" },
  { date: "1 Feb – 30 May 2025", title: "Counselling & Seat Allotment", description: "Online counselling rounds across categories.", status: "current" },
  { date: "6–9 Apr 2025", title: "EAT Round 2", description: "Second attempt or first-time test-takers.", status: "upcoming" },
  { date: "20 Apr 2025", title: "Result – EAT 2", description: "Scorecards + merit list published.", status: "upcoming" },
  { date: "31 May 2025", title: "Application deadline", description: "Last date to submit applications.", status: "upcoming" },
  { date: "1 Aug 2025", title: "Classes commence", description: "Orientation & welcome week for 2025 cohort!", status: "upcoming" },
];

const STEPS = [
  {
    icon: ScrollText,
    t: "Choose your program",
    d: "Browse B.Tech, M.Tech, MBA, B.Des, BA LLB, B.Sc, BBA, BCA and PhD programs.",
    accent: "from-primary/30 to-primary/10 text-primary",
  },
  {
    icon: FileDigit,
    t: "Submit your application",
    d: "Fully online form with academic details, ID proof and passport photo.",
    accent: "from-gold-500/30 to-gold-600/10 text-gold-600 dark:text-gold-400",
  },
  {
    icon: GraduationCap,
    t: "Appear for EAT or submit JEE/CAT/GATE",
    d: "Two EAT windows per cycle; valid national exams also accepted.",
    accent: "from-emerald-500/30 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: BadgeDollarSign,
    t: "Confirm admission & pay fees",
    d: "Secure your seat with online fee payment — EMI options available via major banks.",
    accent: "from-navy-500/30 to-navy-700/10 text-navy-700 dark:text-navy-300",
  },
];

const ELIGIBILITY = [
  {
    program: "B.Tech / BCA",
    criteria: "60% in Class XII (PCM for B.Tech; any stream for BCA) + valid EAT / JEE Main score.",
    tag: "UG · Engg.",
    accent: "primary",
  },
  {
    program: "M.Tech",
    criteria: "55% in B.E/B.Tech in relevant branch + valid GATE / EAT-PG score.",
    tag: "PG · Engg.",
    accent: "gold",
  },
  {
    program: "MBA / BBA",
    criteria: "50% in Bachelor's (MBA) / Class XII (BBA) + CAT/XAT/MAT/CMAT/GMAT/EMAT.",
    tag: "Management",
    accent: "emerald",
  },
  {
    program: "B.Des",
    criteria: "50% in Class XII (any stream) + valid score in EIT-DAT or UCEED.",
    tag: "Design",
    accent: "pink",
  },
  {
    program: "BA LLB",
    criteria: "55% in Class XII (any stream) + valid score in CLAT / EIT-LAT.",
    tag: "Law",
    accent: "navy",
  },
  {
    program: "PhD",
    criteria: "60% in Master's in relevant discipline + research proposal + ERAT + interview.",
    tag: "Doctoral",
    accent: "blue",
  },
];

const RESERVATION = [
  "15% SC · 7.5% ST · 27% OBC (NCL) · 10% EWS",
  "5% PwD horizontal reservation across categories",
  "5% Defence / Ex-Servicemen quota with tuition waiver",
  "10% supernumerary seats for Kashmiri migrants",
  "25% Management / NRI quota as per guidelines",
];

const TAG_ACCENT: Record<string, string> = {
  primary: "bg-primary/15 text-primary border-primary/30",
  gold: "bg-gold-500/15 text-gold-600 dark:text-gold-400 border-gold-500/30",
  emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  pink: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
  navy: "bg-navy-500/20 text-navy-700 dark:text-navy-300 border-navy-500/30",
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
};

export default function AdmissionsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 space-y-16 md:space-y-20">
      <ScrollReveal preset="blur">
        <header className="max-w-3xl space-y-5">
          <div className="chip !text-[11px] !font-bold tracking-[0.22em] uppercase text-primary border-primary/30">
            <CalendarDays className="size-3.5" />
            Admissions · Cohort 2025
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.03] text-balance">
            Apply in 4 simple steps.
            <br />
            <span className="gradient-text">Transparent. Online. Fast.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            A fully online admissions process designed for clarity and speed. Our AI counsellor is available 24×7 to
            guide you through every step — from choosing a program to paying the first-semester fee.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <Link href="/ask-ai" className="neu-btn-primary !px-5 !py-3 text-sm font-bold">
              <Sparkles className="size-4" /> Chat with Elzada AI
            </Link>
            <Link href="/contact" className="neu-btn !px-5 !py-3 text-sm font-semibold">
              Talk to admissions <ArrowRight className="size-4" />
            </Link>
          </div>
        </header>
      </ScrollReveal>

      {/* How it works */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Process"
            title="How admissions work at EIT"
            description="A straightforward 4-step journey — from program selection to seat confirmation."
          />
        </ScrollReveal>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <RevealItem key={s.t} delay={i * 0.05} preset="fade-up">
              <NeuCard hover="lift" className="p-5 sm:p-6 h-full relative">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={cn("grid size-11 place-items-center rounded-2xl bg-gradient-to-br", s.accent)}>
                    <s.icon className="size-5" />
                  </div>
                  <div className="neu-pressed px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest text-muted-foreground">
                    0{i + 1}
                  </div>
                </div>
                <h3 className="text-base font-extrabold tracking-tight leading-snug text-foreground">
                  {s.t}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Timeline + Eligibility + Reservation */}
      <section className="grid lg:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="lg:col-span-7 space-y-5">
          <ScrollReveal preset="fade-right">
            <SectionHeader
              eyebrow="Important Dates"
              title="Every milestone for 2025"
              description="Bookmark these dates so you never miss a window. AI reminders available via Elzada chat."
            />
          </ScrollReveal>
          <AdmissionsTimeline events={TIMELINE_2025} />
        </div>

        <aside className="lg:col-span-5 space-y-5">
          <ScrollReveal preset="fade-left" delay={0.04}>
            <NeuCard className="p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 size-44 rounded-full bg-primary/14 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 relative">
                <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shrink-0">
                  <BadgeCheck className="size-5" />
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">Eligibility at a glance</h3>
              </div>
              <ul className="space-y-2.5 relative">
                {ELIGIBILITY.map((e) => (
                  <li key={e.program} className="neu-inset p-3.5 rounded-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{e.program}</h4>
                      <span className={cn("chip !text-[10px] !px-2 !py-0.5 !font-bold tracking-wider border", TAG_ACCENT[e.accent])}>
                        {e.tag}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                      {e.criteria}
                    </p>
                  </li>
                ))}
              </ul>
            </NeuCard>
          </ScrollReveal>

          <ScrollReveal preset="fade-left" delay={0.08}>
            <NeuCard className="p-5 sm:p-6 space-y-4 relative overflow-hidden">
              <div className="absolute -bottom-16 -left-16 size-44 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3 relative">
                <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-gold-500/30 to-gold-600/10 text-gold-600 dark:text-gold-400 shrink-0">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-lg font-extrabold tracking-tight">Reservation Policy</h3>
              </div>
              <ul className="space-y-2 relative">
                {RESERVATION.map((r) => (
                  <li key={r} className="flex gap-3 text-sm">
                    <span className="mt-1 shrink-0 size-2 rounded-full bg-gold-500" />
                    <span className="text-muted-foreground leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
              <div className="divider-gold" />
              <div className="flex items-center gap-3 relative">
                <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/25 to-emerald-600/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <IndianRupee className="size-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold">Merit Scholarships up to 100%</h4>
                  <p className="text-xs text-muted-foreground">
                    EAT/JEE top percentiles, Sports, Defence wards & single-girl child.
                  </p>
                </div>
              </div>
            </NeuCard>
          </ScrollReveal>
        </aside>
      </section>

      {/* Documents checklist */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Documents"
            title="Keep these ready before applying"
            description="Digitally scanned copies (PDF/JPG, under 5MB each) accepted on the admission portal."
          />
        </ScrollReveal>
        <ScrollReveal preset="fade-up" delay={0.05}>
          <NeuCard className="p-5 sm:p-7 overflow-hidden relative">
            <div className="absolute -top-24 -left-24 size-72 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative">
              {[
                { t: "Class X marksheet + certificate", icon: FileCheck2, acc: "from-primary/25 to-primary/10 text-primary" },
                { t: "Class XII marksheet (or expected)", icon: FileDigit, acc: "from-gold-500/25 to-gold-600/10 text-gold-600 dark:text-gold-400" },
                { t: "Government ID proof (Aadhaar / PAN)", icon: ShieldCheck, acc: "from-emerald-500/25 to-emerald-600/10 text-emerald-600 dark:text-emerald-400" },
                { t: "Recent passport-size photo", icon: Briefcase, acc: "from-navy-500/25 to-navy-700/10 text-navy-700 dark:text-navy-300" },
                { t: "Entrance scorecard (if any)", icon: BadgeCheck, acc: "from-pink-500/25 to-pink-600/10 text-pink-600 dark:text-pink-400" },
                { t: "Transfer / Migration certificate", icon: ScrollText, acc: "from-amber-500/25 to-amber-600/10 text-amber-600 dark:text-amber-400" },
                { t: "Category / Caste certificate", icon: GraduationCap, acc: "from-blue-500/25 to-blue-600/10 text-blue-600 dark:text-blue-400" },
                { t: "PwD / Defence / NRI proof (if applicable)", icon: Sparkles, acc: "from-rose-500/25 to-rose-600/10 text-rose-600 dark:text-rose-400" },
              ].map(({ t, icon: Icon, acc }, i) => (
                <div key={t} className="neu-surface-xs !rounded-xl px-3.5 py-3 flex items-start gap-3 hover:-translate-y-0.5 transition-transform">
                  <div className={cn("grid size-9 place-items-center rounded-xl shrink-0 bg-gradient-to-br", acc)}>
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-muted-foreground/70">
                      0{i + 1}
                    </div>
                    <p className="text-[13px] font-semibold text-foreground leading-snug">{t}</p>
                  </div>
                </div>
              ))}
            </div>
          </NeuCard>
        </ScrollReveal>
      </section>

      {/* FAQ style questions CTA + Enquiry */}
      <section className="grid lg:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="lg:col-span-5 space-y-5">
          <ScrollReveal preset="fade-right">
            <SectionHeader
              eyebrow="Get in touch"
              title="Have a question?"
              description="Submit an enquiry and our admissions team will get back within 24 hours on working days. For instant answers, chat with Elzada AI."
            />
            <div className="flex flex-wrap gap-2.5">
              <Link href="/faq" className="neu-btn !px-5 !py-3 text-sm font-semibold">
                Browse Admission FAQs
              </Link>
              <Link href="/ask-ai" className="neu-btn-primary !px-5 !py-3 text-sm font-bold">
                <Sparkles className="size-4" /> Ask Elzada AI
              </Link>
            </div>
          </ScrollReveal>
        </div>
        <div className="lg:col-span-7">
          <EnquiryForm />
        </div>
      </section>
    </div>
  );
}
