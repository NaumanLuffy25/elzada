"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export type StatItem = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "blue" | "green" | "amber" | "pink" | "navy" | "gold";
  /**
   * Either an icon component reference (`icon: Award`) or an already-rendered
   * element (`icon: <Award className="size-5" />`).
   *
   * Server Components **must** use the element form: a component reference is a
   * function and cannot be serialized across the Server → Client boundary.
   */
  icon?: React.ReactNode | React.ComponentType<{ className?: string }>;
  suffix?: string;
  prefix?: string;
  /** Optional deltas supplied by callers (not yet rendered). */
  trend?: string;
};

const ACCENT_MAP: Record<NonNullable<StatItem["accent"]>, string> = {
  blue: "from-elzada-400/30 to-elzada-600/10 text-elzada-500 dark:text-elzada-300",
  green: "from-emerald-400/25 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  amber: "from-amber-400/25 to-amber-600/10 text-amber-600 dark:text-amber-400",
  pink: "from-pink-400/25 to-pink-600/10 text-pink-600 dark:text-pink-400",
  navy: "from-navy-400/25 to-navy-700/10 text-navy-700 dark:text-navy-300",
  gold: "from-gold-400/30 to-gold-600/10 text-gold-600 dark:text-gold-400",
};

/**
 * Normalises the two supported `icon` shapes into a node that can be rendered
 * inside the accent chip. Kept here so both call styles keep working.
 */
function renderStatIcon(icon: StatItem["icon"]): React.ReactNode {
  if (icon === null || icon === undefined) {
    return <div className="w-2 h-5 rounded-full bg-current opacity-70" />;
  }
  if (React.isValidElement(icon)) return icon;

  const Icon = icon as React.ComponentType<{ className?: string }>;
  return <Icon className="size-5" />;
}

function Counter({
  target,
  suffix = "",
  prefix = "",
  duration = 1.8,
}: {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);

  const isInteger = Number.isInteger(target);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {isInteger ? Math.round(value).toLocaleString("en-IN") : value.toFixed(1)}
      {suffix}
    </span>
  );
}

export function StatsCards({
  items,
  columns = 4,
}: {
  items: StatItem[];
  columns?: 2 | 3 | 4;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  return (
    <ScrollReveal preset="fade-up">
      <div className={cn("grid gap-3.5 sm:gap-4", cols)}>
        {items.map((s, i) => {
          const accentClass = ACCENT_MAP[s.accent ?? "blue"];
          const numericValue =
            typeof s.value === "number"
              ? s.value
              : typeof s.value === "string"
              ? Number(String(s.value).replace(/[^0-9.]/g, ""))
              : NaN;
          const useCounter = !Number.isNaN(numericValue) && numericValue > 0;

          return (
            <motion.div
              key={s.label}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="neu-surface p-5 sm:p-6 group relative overflow-hidden"
            >
              {/* decorative corner accent */}
              <div className="absolute -top-12 -right-12 size-28 rounded-full bg-gradient-to-br opacity-70 blur-2xl pointer-events-none group-hover:opacity-100 transition-opacity"
                style={{
                  background: s.accent === "gold"
                    ? "linear-gradient(135deg, hsl(var(--accent) / 0.35), transparent)"
                    : "linear-gradient(135deg, hsl(var(--primary) / 0.25), transparent)",
                }}
              />

              <div className="flex items-start justify-between gap-3 relative">
                <div
                  className={cn(
                    "grid size-11 place-items-center rounded-xl bg-gradient-to-br",
                    accentClass,
                  )}
                >
                  {renderStatIcon(s.icon)}
                </div>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
                  0{i + 1}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <div className="text-3xl sm:text-3.5xl font-extrabold tracking-tight text-foreground leading-none">
                  {useCounter ? (
                    <Counter
                      target={numericValue}
                      suffix={s.suffix ?? (typeof s.value === "string" ? s.value.replace(/[0-9.,+\s]/g, "") : "")}
                      prefix={s.prefix ?? ""}
                    />
                  ) : (
                    <>
                      {s.prefix}
                      {s.value}
                      {s.suffix}
                    </>
                  )}
                </div>
                <div className="text-sm font-semibold text-foreground/90">
                  {s.label}
                </div>
                {s.hint && (
                  <div className="text-[11px] sm:text-xs text-muted-foreground leading-snug pt-0.5">
                    {s.hint}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </ScrollReveal>
  );
}
