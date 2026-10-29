"use client";

import Link from "next/link";
import * as React from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Award,
  CalendarCheck,
  ChevronRight,
  GraduationCap,
  IndianRupee,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = ["B.Tech", "M.Tech", "MBA", "BBA", "BCA", "B.Des", "PhD"];

const HERO_STATS = [
  { label: "Programs", value: 28, suffix: "+", hint: "UG · PG · Research", accent: "primary" },
  { label: "Top Recruiters", value: 320, suffix: "+", hint: "Product, Finance, Core", accent: "gold" },
  { label: "Highest CTC", value: 52, prefix: "₹", suffix: " LPA", hint: "CSE 2024 batch", accent: "navy" },
  { label: "NAAC", value: null, badge: "A++", hint: "NIRF Top 50 Private", accent: "mint" },
];

const AT_A_GLANCE = [
  { icon: Award, label: "Accreditation", value: "NAAC A++ · NIRF Top 50 Private" },
  { icon: MapPin, label: "Campus", value: "Yelahanka, Bengaluru" },
  { icon: GraduationCap, label: "Programs", value: "28+ UG, PG and research degrees" },
  { icon: Sparkles, label: "Admission support", value: "24×7 AI counsellor + faculty" },
];

function AnimatedCount({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function Hero() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const t = setInterval(
      () => setIndex((i) => (i + 1) % ROLES.length),
      2400,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative pt-6 md:pt-10 pb-16 md:pb-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Eyebrow chip */}
            <div className="inline-flex items-center gap-2 neu-surface-xs !rounded-full px-4 py-1.5 text-xs">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
              <span className="font-semibold text-foreground/90">
                Admissions 2025 · Now Open
              </span>
              <span className="text-muted-foreground">
                EAT Round 2 · 6–9 Apr 2025
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.04] text-foreground">
                Shape your future at
                <br />
                <span className="font-extrabold">Elzada Institute</span>
              </h1>

              <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                A <strong className="text-foreground font-semibold">NAAC A++</strong>{" "}
                deemed university in Yelahanka, Bengaluru. Pursue{" "}
                <strong className="font-semibold text-foreground">
                  {ROLES[index]}
                </strong>{" "}
                from 28+ career-focused programs, guided by our 24×7 AI admission
                counsellor and senior faculty.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admissions"
                className="neu-btn-primary group !px-6 !py-3.5 text-sm md:text-base font-bold"
              >
                Apply for 2025 Batch
                <ArrowRight className="size-4 md:size-4.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/programs"
                className="neu-btn !px-6 !py-3.5 text-sm md:text-base font-semibold"
              >
                Explore Programs
                <ChevronRight className="size-4 md:size-4.5" />
              </Link>
              <Link
                href="/ask-ai"
                className="neu-btn !px-6 !py-3.5 text-sm md:text-base font-semibold border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
              >
                Ask AI Counsellor
              </Link>
            </div>

            {/* Mini highlights */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {[
                { Icon: CalendarCheck, label: "Apply by 31 May 2025" },
                { Icon: IndianRupee, label: "Merit Scholarships up to 100%" },
                { Icon: Users, label: "9,500+ students on campus" },
              ].map(({ Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
                >
                  <span className="neu-pressed size-8 rounded-lg grid place-items-center text-primary">
                    <Icon className="size-4" />
                  </span>
                  {label}
                </div>
              ))}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
              {HERO_STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                  className="neu-surface-xs p-4 sm:p-4.5"
                >
                  <div
                    className={cn(
                      "text-2xl sm:text-3xl font-extrabold tracking-tight",
                      s.accent === "primary" && "text-primary",
                      s.accent === "gold" && "text-gold-600 dark:text-gold-400",
                      s.accent === "navy" && "text-navy-700 dark:text-navy-200",
                      s.accent === "mint" && "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    {s.value !== null && typeof s.value === "number" ? (
                      <AnimatedCount
                        value={s.value}
                        prefix={s.prefix || ""}
                        suffix={s.suffix || ""}
                      />
                    ) : (
                      <span className="tracking-tight">{s.badge}</span>
                    )}
                  </div>
                  <div className="mt-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground/70">
                    {s.hint}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: at-a-glance card */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
            aria-label="Elzada Institute at a glance"
          >
            <div className="neu-surface p-6">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
                    At a glance
                  </p>
                  <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
                    Elzada Institute of Technology
                  </p>
                </div>
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <GraduationCap className="size-5" aria-hidden />
                </div>
              </div>

              <dl className="mt-4 space-y-4">
                {AT_A_GLANCE.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-sm font-medium text-foreground">
                        {value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="mt-5 rounded-xl border border-border bg-muted/40 px-4 py-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Applications for the 2025 intake close on{" "}
                  <span className="font-semibold text-foreground">31 May 2025</span>.
                  Speak to our AI admission counsellor any time, or send an enquiry and
                  our team will respond within 24 hours.
                </p>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
