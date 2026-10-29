"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variant } from "framer-motion";
import { cn } from "@/lib/utils";

export type NeuCardProps = HTMLMotionProps<"div"> & {
  variant?: "flat" | "elevated" | "inset" | "soft";
  hover?: "lift" | "glow" | "pop" | "none";
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
};

const VARIANTS: Record<NonNullable<NeuCardProps["variant"]>, string> = {
  flat: "neu-surface",
  elevated: "neu-surface border border-primary/20",
  inset: "neu-inset",
  soft: "neu-surface-sm",
};

const HOVER: Record<NonNullable<NeuCardProps["hover"]>, Variant> = {
  lift: { y: -5, transition: { type: "spring", stiffness: 260, damping: 20 } },
  glow: {
    boxShadow: "0 0 0 2px hsl(var(--primary) / 0.25), 0 18px 50px -12px hsl(var(--primary) / 0.35)",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  pop: {
    scale: 1.015,
    y: -2,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
  none: {},
};

export function NeuCard({
  variant = "flat",
  hover = "lift",
  className,
  children,
  ...rest
}: NeuCardProps) {
  return (
    <motion.div
      initial="initial"
      whileHover={hover !== "none" ? "hover" : undefined}
      variants={{
        initial: {},
        hover: HOVER[hover],
      }}
      className={cn(VARIANTS[variant], "overflow-hidden", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl mb-8 md:mb-12 space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "inline-flex items-center gap-2 chip !text-[11px] !px-3.5 !font-semibold",
            align === "center" && "mx-auto",
          )}
        >
          <span className="size-1.5 rounded-full bg-gold-500 shadow-gold-glow" />
          <span className="tracking-[0.22em] uppercase text-muted-foreground">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
          {description}
        </p>
      )}
    </div>
  );
}
