"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <PageWash key={pathname + "-wash"} />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

function PageWash() {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleY: 1 }}
      animate={{ scaleY: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-top"
      style={{
        background:
          "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
      }}
    />
  );
}
