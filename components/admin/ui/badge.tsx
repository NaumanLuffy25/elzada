import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-adm-2 whitespace-nowrap rounded-full border font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "border-adm-line bg-adm-surface-2 text-adm-muted",
        accent: "border-adm-accent/30 bg-adm-accent/10 text-adm-accent-hover",
        info: "border-adm-info/30 bg-adm-info/10 text-adm-info",
        success: "border-adm-ok/30 bg-adm-ok/10 text-adm-ok",
        warning: "border-adm-warn/30 bg-adm-warn/10 text-adm-warn",
        danger: "border-adm-danger/30 bg-adm-danger/10 text-adm-danger",
        outline: "border-adm-line text-adm-muted",
      },
      size: {
        sm: "px-adm-2 py-1 text-[10px] uppercase tracking-[0.1em]",
        md: "px-adm-2 py-1 text-[11px]",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

const DOT: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-adm-subtle",
  accent: "bg-adm-accent",
  info: "bg-adm-info",
  success: "bg-adm-ok",
  warning: "bg-adm-warn",
  danger: "bg-adm-danger",
  outline: "bg-adm-subtle",
};

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {
  /** Renders a small status dot before the label. */
  dot?: boolean;
}

export function Badge({ tone = "neutral", size, dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot ? (
        <span className={cn("size-1.5 shrink-0 rounded-full", DOT[tone ?? "neutral"])} aria-hidden />
      ) : null}
      {children}
    </span>
  );
}
