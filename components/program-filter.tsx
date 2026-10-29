"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Calendar, IndianRupee, ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export interface Program {
  name: string;
  level: "UG" | "PG" | "Doctoral";
  duration: string;
  category: string;
  description: string;
  highlights: string[];
  fee?: string;
  eligibility?: string;
  ctc?: string;
}

const FILTERS = [
  { id: "All", label: "All Programs" },
  { id: "UG", label: "UG" },
  { id: "PG", label: "PG" },
  { id: "Doctoral", label: "PhD" },
  { id: "Engineering", label: "Engineering" },
  { id: "Management", label: "Management" },
  { id: "Design", label: "Design" },
  { id: "Sciences", label: "Sciences" },
  { id: "Law", label: "Law" },
] as const;

const LEVEL_STYLE: Record<Program["level"], string> = {
  UG: "from-elzada-400/25 to-elzada-600/10 text-elzada-600 dark:text-elzada-300",
  PG: "from-gold-400/25 to-gold-600/10 text-gold-600 dark:text-gold-400",
  Doctoral: "from-navy-400/25 to-navy-700/10 text-navy-700 dark:text-navy-300",
};

function ProgramCard({ program, index }: { program: Program; index: number }) {
  const levelClass = LEVEL_STYLE[program.level];
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ delay: (index % 6) * 0.05, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group neu-surface p-5 sm:p-6 relative overflow-hidden flex flex-col h-full"
    >
      {/* Corner gradient blob */}
      <div className="absolute -top-20 -right-20 size-52 rounded-full bg-gradient-to-br from-primary/18 via-transparent to-gold-500/10 blur-3xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className={cn("grid size-11 place-items-center rounded-2xl bg-gradient-to-br", levelClass)}>
          <Sparkles className="size-5" />
        </div>
        <span className={cn("chip !text-[10px] !font-bold tracking-[0.18em] uppercase border", levelClass, "!text-current")}>
          {program.level}
        </span>
      </div>

      <div className="space-y-1.5 flex-1">
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground leading-snug group-hover:text-primary transition-colors">
          {program.name}
        </h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
          <Calendar className="size-3.5" />
          {program.duration} · {program.category}
        </p>
      </div>

      <p className="mt-3 text-sm text-muted-foreground/95 leading-relaxed line-clamp-3">
        {program.description}
      </p>

      <ul className="mt-4 space-y-1.5">
        {program.highlights.slice(0, 3).map((h) => (
          <li key={h} className="text-xs text-foreground/80 flex items-start gap-2">
            <span className="mt-1.5 size-1.5 rounded-full bg-gold-500 shrink-0" />
            <span className="leading-snug">{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 pt-4 border-t border-dashed border-border/60 flex items-end justify-between gap-3">
        <div className="space-y-1">
          {program.fee && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IndianRupee className="size-3.5 text-primary" />
              <span className="font-semibold text-foreground">{program.fee}</span>
            </div>
          )}
          {program.ctc && (
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Avg CTC: {program.ctc}
            </div>
          )}
        </div>
        <button className="neu-icon-btn !size-9 group/btn">
          <ArrowUpRight className="size-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

export function ProgramFilter({ programs }: { programs: Program[] }) {
  const [active, setActive] = React.useState<(typeof FILTERS)[number]["id"]>("All");
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    return programs.filter((p) => {
      const hay = `${p.name} ${p.description} ${p.category} ${p.level}`.toLowerCase();
      const matchQ = !q || hay.includes(q.toLowerCase());
      const matchF =
        active === "All" ||
        p.level === active ||
        p.category.toLowerCase().includes(active.toLowerCase());
      return matchQ && matchF;
    });
  }, [programs, active, q]);

  return (
    <div className="space-y-6">
      <ScrollReveal preset="fade-up">
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center xl:justify-between">
          {/* Filter chips */}
          <div className="neu-inset p-1.5 flex flex-wrap gap-1 rounded-2xl w-full xl:max-w-3xl">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={cn(
                  "relative px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200",
                  active === f.id
                    ? "neu-surface-xs text-primary"
                    : "text-muted-foreground hover:text-foreground/90",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full xl:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70 pointer-events-none" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search programs, branches…"
              className="neu-input pl-10 pr-4 py-3 rounded-2xl"
            />
          </div>
        </div>
      </ScrollReveal>

      <AnimatePresence mode="popLayout">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="neu-surface p-10 sm:p-14 text-center space-y-3"
          >
            <div className="mx-auto size-14 rounded-2xl bg-muted grid place-items-center text-muted-foreground">
              <Search className="size-6" />
            </div>
            <p className="text-base font-semibold text-foreground">No programs match your filters.</p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try clearing your search or selecting a different category. Elzada offers 28+
              programs across Engineering, Management, Design, Sciences, and Law.
            </p>
            <button
              onClick={() => {
                setQ("");
                setActive("All");
              }}
              className="neu-btn-primary !px-5 !py-2.5 mt-2 text-sm"
            >
              Reset filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((p, i) => (
              <ProgramCard key={p.name} program={p} index={i} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
