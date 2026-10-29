"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, GraduationCap, ChevronRight, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/admissions", label: "Admissions" },
  { href: "/campus", label: "Campus" },
  { href: "/placements", label: "Placements" },
  { href: "/facilities", label: "Facilities" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);
  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isAdmin = pathname?.startsWith("/admin");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled
          ? "py-2.5"
          : "py-4",
      )}
    >
      <div
        className={cn(
          "container mx-auto max-w-7xl px-3 sm:px-5 transition-all duration-500",
        )}
      >
        <div
          className={cn(
            "neu-surface-sm relative z-50 flex h-14 items-center justify-between gap-2 px-2.5 sm:h-16 sm:px-3.5 transition-all duration-500",
            isAdmin && "ring-1 ring-primary/40",
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative grid size-9 sm:size-10 place-items-center rounded-xl overflow-hidden">
              <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-elzada-400 via-elzada-600 to-navy-800 animate-gradient-x bg-200" />
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-gold-glow" />
              <GraduationCap className="relative size-4.5 sm:size-5 text-white" />
            </span>
            <div className="leading-tight hidden sm:block">
              <div className="text-[0.9rem] font-semibold tracking-tight text-foreground">
                Elzada
              </div>
              <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                Institute of Technology
              </div>
            </div>
            <div className="leading-tight sm:hidden">
              <div className="text-sm font-bold tracking-tight text-foreground">
                EIT
              </div>
              <div className="text-[8px] uppercase tracking-wider text-muted-foreground">
                Bengaluru
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-sm rounded-md transition-colors group"
                >
                  <span
                    className={cn(
                      "relative z-10 transition-colors",
                      active
                        ? "text-primary font-medium"
                        : "text-foreground/75 group-hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 neu-pressed rounded-md"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle className="hidden sm:flex" />
            <Link
              href="/ask-ai"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-primary/25 hover:from-primary/90 hover:to-violet-500/90 transition-all duration-200"
              aria-label="Ask AI Counsellor"
            >
              <Sparkles className="size-3.5" />
              <span>Ask AI</span>
            </Link>
            <Link
              href="/admin-access"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
              aria-label="Admin access"
            >
              <Shield className="size-3.5" />
              <span>Admin</span>
            </Link>
            <Link
              href="/admissions"
              className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-2.5 text-xs font-semibold text-gold-300 hover:bg-gold-400/20 hover:border-gold-400/60 transition-all duration-200"
            >
              Apply Now
              <ChevronRight className="size-3.5" />
            </Link>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="neu-icon-btn xl:hidden size-10"
            >
              {open ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-black/60 xl:hidden"
            />
            <motion.div
              initial={{ y: -10, opacity: 0, height: 0 }}
              animate={{ y: 0, opacity: 1, height: "auto" }}
              exit={{ y: -10, opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-50 container mx-auto max-w-7xl px-3 sm:px-5 mt-2 xl:hidden overflow-hidden"
            >
              <div className="rounded-2xl border border-white/10 bg-navy-950/95 p-5 space-y-4 shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.15em] text-slate-400 font-medium">
                    Navigate
                  </span>
                  <ThemeToggle />
                </div>

                {/* Navigation links - vertical list for better alignment */}
                <nav className="space-y-1.5">
                  {NAV_LINKS.map((link, i) => {
                    const active =
                      pathname === link.href ||
                      (link.href !== "/" && pathname?.startsWith(link.href));
                    return (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.03 * i, duration: 0.25 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border",
                            active
                              ? "bg-primary/10 border-primary/30 text-white"
                              : "bg-white/[0.03] border-white/5 text-slate-200 hover:bg-white/5 hover:border-white/10 hover:text-white"
                          )}
                        >
                          <span>{link.label}</span>
                          <ChevronRight
                            className={cn(
                              "size-4",
                              active ? "text-primary" : "text-slate-400",
                            )}
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Action buttons - aligned with consistent heights */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <Link
                    href="/ask-ai"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-primary to-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:from-primary/90 hover:to-violet-500/90 transition-all duration-200"
                  >
                    <Sparkles className="size-4" />
                    <span>Ask AI Counsellor</span>
                  </Link>
                  <Link
                    href="/admin-access"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                  >
                    <Shield className="size-4" />
                    <span>Admin</span>
                  </Link>
                  <Link
                    href="/admissions"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-xl border border-gold-400/40 bg-gold-400/10 px-4 py-3 text-sm font-semibold text-gold-300 hover:bg-gold-400/20 hover:border-gold-400/60 transition-all duration-200"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
