"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Variant } from "framer-motion";
import { cn } from "@/lib/utils";

/** Canonical preset names (kebab-case). */
type BasePreset =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom"
  | "blur"
  | "slide-up";

/**
 * Camel-case aliases kept for call sites written against an earlier API.
 * Prefer the kebab-case names.
 *
 * TODO(design-system): normalise call sites to kebab-case, then delete these.
 */
type PresetAlias = "fadeUp" | "fadeUpBlur" | "staggerUp";

type Preset = BasePreset | PresetAlias;

const BASE_PRESETS: Record<BasePreset, { hidden: Variant; show: Variant }> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  },
  "fade-up": {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  "fade-left": {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  "fade-right": {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 16 },
    show: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  },
  "slide-up": {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
    },
  },
};

const PRESETS: Record<Preset, { hidden: Variant; show: Variant }> = {
  ...BASE_PRESETS,
  fadeUp: BASE_PRESETS["fade-up"],
  fadeUpBlur: BASE_PRESETS.blur,
  staggerUp: BASE_PRESETS["fade-up"],
};

export type ScrollRevealProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  preset?: Preset;
  delay?: number;
  amount?: number;
  once?: boolean;
  stagger?: number;
  className?: string;
  as?: React.ElementType;
};

export function ScrollReveal({
  children,
  preset = "fade-up",
  delay = 0,
  amount = 0.2,
  once = true,
  stagger,
  className,
  ...rest
}: ScrollRevealProps) {
  const { hidden, show } = PRESETS[preset];
  const showVariant = stagger
    ? {
        ...show,
        transition: {
          ...(show as any).transition,
          staggerChildren: stagger,
          delayChildren: delay,
        },
      }
    : {
        ...show,
        transition: { ...(show as any).transition, delay },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden, show: showVariant }}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  preset = "fade-up",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  preset?: Preset;
  delay?: number;
}) {
  const { hidden, show } = PRESETS[preset];
  const showWithDelay = {
    ...show,
    transition: { ...(show as any).transition, delay },
  };
  return (
    <motion.div
      variants={{ hidden, show: showWithDelay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
