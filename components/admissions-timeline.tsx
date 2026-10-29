"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  status?: "done" | "current" | "upcoming";
}

const STATUS_META: Record<NonNullable<TimelineEvent["status"]>, {
  Icon: typeof CheckCircle2;
  ring: string;
  pill: string;
  text: string;
  dot: string;
  label: string;
}> = {
  done: {
    Icon: CheckCircle2,
    ring: "ring-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pill: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    text: "Completed",
    dot: "bg-emerald-500",
    label: "Completed",
  },
  current: {
    Icon: Clock,
    ring: "ring-primary/40 bg-primary/15 text-primary",
    pill: "bg-primary/15 text-primary border-primary/30 animate-pulse-soft",
    text: "Active",
    dot: "bg-primary",
    label: "Now",
  },
  upcoming: {
    Icon: Circle,
    ring: "ring-border bg-card text-muted-foreground",
    pill: "bg-muted text-muted-foreground border-border",
    text: "Upcoming",
    dot: "bg-muted-foreground/40",
    label: "Upcoming",
  },
};

export function AdmissionsTimeline({ events }: { events: TimelineEvent[] }) {
  const maxStatus = React.useMemo(() => {
    const order = { done: 2, current: 1, upcoming: 0 } as const;
    return Math.max(...events.map((e) => order[e.status ?? "upcoming"]));
  }, [events]);

  const hasAnyCurrent = events.some((e) => e.status === "current");

  return (
    <ScrollReveal preset="fade-up">
      <div className="relative">
        {/* Soft decorative halos */}
        <div className="absolute -top-8 left-10 size-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 size-52 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

        <ol className="relative">
          {/* Vertical gradient rail */}
          <div className="absolute left-[18px] sm:left-[22px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-gold-500/30 to-primary/10 sm:w-[3px] rounded-full" />
          {/* Progress fill line */}
          <motion.div
            initial={{ height: "0%" }}
            whileInView={{ height: `${((maxStatus === 2 ? events.filter(e => e.status === "done").length : events.filter(e => e.status === "done").length) + (hasAnyCurrent ? 0.5 : 0)) / events.length * 100}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[18px] sm:left-[22px] top-2 w-px sm:w-[3px] origin-top rounded-full"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--primary)), hsl(var(--accent)))",
            }}
          />

          <div className="space-y-6 sm:space-y-8">
            {events.map((e, i) => {
              const status = e.status ?? "upcoming";
              const meta = STATUS_META[status];
              const Icon = meta.Icon;
              return (
                <RevealItem key={i} delay={i * 0.08} preset="fade-left">
                  <li className="relative pl-14 sm:pl-16">
                    {/* Status node */}
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                        delay: i * 0.08,
                      }}
                      className={cn(
                        "absolute left-0 top-1 grid size-10 sm:size-11 place-items-center rounded-2xl ring-4",
                        meta.ring,
                      )}
                    >
                      <Icon className="size-[18px] sm:size-5" />
                      <span className={cn("absolute -bottom-1.5 size-2.5 rounded-full", meta.dot)} />
                    </motion.span>

                    <div className="neu-surface-sm p-4 sm:p-5 group">
                      <div className="flex flex-wrap items-center gap-3">
                        <h4 className="text-sm sm:text-base font-bold tracking-tight text-foreground">
                          {e.title}
                        </h4>
                        <span className={cn("chip !text-[10px] !font-semibold tracking-wider uppercase border", meta.pill)}>
                          {meta.label}
                        </span>
                        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="size-3.5" />
                          {e.date}
                        </span>
                      </div>
                      {e.description && (
                        <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                          {e.description}
                        </p>
                      )}
                    </div>
                  </li>
                </RevealItem>
              );
            })}
          </div>
        </ol>
      </div>
    </ScrollReveal>
  );
}
