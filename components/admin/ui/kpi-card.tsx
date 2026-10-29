import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface KpiCardProps {
  label: string;
  value: React.ReactNode;
  /** Signed change, e.g. `12` or `-3`. Omit when there is no comparison. */
  delta?: number | null;
  /** e.g. "vs previous 7 days". */
  deltaLabel?: string;
  /** Supporting line under the value. */
  hint?: string;
  icon?: LucideIcon;
  /** Colour emphasis for the icon chip. */
  tone?: "neutral" | "accent" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const CHIP: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  neutral: "bg-adm-surface-2 text-adm-muted",
  accent: "bg-adm-accent/10 text-adm-accent",
  success: "bg-adm-ok/10 text-adm-ok",
  warning: "bg-adm-warn/10 text-adm-warn",
  danger: "bg-adm-danger/10 text-adm-danger",
  info: "bg-adm-info/10 text-adm-info",
};

/**
 * KPI card — the single building block for headline numbers.
 * Flat surface, hairline border, one accent chip, no glow.
 */
export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  hint,
  icon: Icon,
  tone = "neutral",
  className,
}: KpiCardProps) {
  const d = typeof delta === "number" && Number.isFinite(delta) ? delta : null;
  const DeltaIcon = d === null || d === 0 ? Minus : d > 0 ? ArrowUpRight : ArrowDownRight;
  const deltaTone = d === null || d === 0 ? "text-adm-muted" : d > 0 ? "text-adm-ok" : "text-adm-danger";

  return (
    <div
      className={cn(
        "rounded-adm border border-adm-line bg-adm-surface p-adm-4",
        "transition-colors duration-adm ease-adm hover:border-adm-line-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-adm-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-adm-subtle">{label}</p>
        {Icon ? (
          <span className={cn("grid size-7 shrink-0 place-items-center rounded-adm-sm", CHIP[tone])}>
            <Icon className="size-3.5" aria-hidden />
          </span>
        ) : null}
      </div>

      <p className="mt-adm-3 text-[24px] font-semibold leading-none tracking-tight text-adm-fg">
        {value}
      </p>

      {d !== null || hint ? (
        <div className="mt-adm-2 flex flex-wrap items-center gap-adm-2">
          {d !== null ? (
            <span className={cn("inline-flex items-center gap-0.5 text-[11px] font-medium", deltaTone)}>
              <DeltaIcon className="size-3" aria-hidden />
              {d > 0 ? "+" : ""}
              {d}
            </span>
          ) : null}
          {d !== null && deltaLabel ? (
            <span className="text-[11px] text-adm-subtle">{deltaLabel}</span>
          ) : null}
          {hint ? <span className="text-[11px] text-adm-muted">{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

/** Responsive grid wrapper so KPI rows stay aligned across breakpoints. */
export function KpiGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("grid gap-adm-3 sm:grid-cols-2 xl:grid-cols-4", className)}>{children}</div>
  );
}
