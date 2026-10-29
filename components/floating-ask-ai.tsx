"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Sparkles, X, Bot } from "lucide-react";
import { Chatbot } from "./chatbot";

export function FloatingAskAI() {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [hintVisible, setHintVisible] = React.useState(true);

  React.useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setHintVisible(false), 7500);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="fab"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 group"
            aria-label="Open AI counsellor"
          >
            <div className="relative">
              {/* Soft pulse halo */}
              <span className="absolute inset-0 rounded-full bg-primary/40 blur-lg opacity-60 animate-pulse-soft group-hover:opacity-100 transition-opacity" />
              <span className="relative neu-surface-sm flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full overflow-hidden">
                <span className="relative grid size-9 place-items-center rounded-xl overflow-hidden shrink-0">
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-elzada-400 via-elzada-600 to-navy-800 animate-gradient-x bg-200" />
                  <Bot className="relative size-4.5 text-white" />
                  <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-card animate-pulse-soft" />
                </span>
                <span className="text-sm font-bold tracking-tight pr-1 text-foreground">
                  Ask Elzada AI
                </span>
                <Sparkles className="size-4 text-gold-500 animate-pulse-soft" />
              </span>

              {/* Speech hint bubble */}
              <AnimatePresence>
                {hintVisible && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.96 }}
                    transition={{ delay: 0.4 }}
                    className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden sm:block whitespace-nowrap"
                  >
                    <div className="neu-surface-xs px-3 py-2 rounded-xl text-xs font-semibold text-foreground/90 shadow-lg">
                      👋 Need help with admissions?
                    </div>
                    <span className="absolute right-[-5px] top-1/2 -translate-y-1/2 size-3 rotate-45 rounded-r bg-card" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.button
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 40, scale: 0.96, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96, transformOrigin: "bottom right" }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="fixed bottom-6 right-6 z-50 w-[min(408px,calc(100vw-1.5rem))] max-h-[calc(100dvh-6rem)]"
          >
            <Chatbot onClose={() => setOpen(false)} initialOpen={true} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
