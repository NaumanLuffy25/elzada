"use client";

import Link from "next/link";
import * as React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin, Phone, Twitter, Instagram, Youtube, GraduationCap, Sparkles } from "lucide-react";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import { ThemeToggle } from "@/components/theme-toggle";

const COLUMNS = [
  {
    title: "Admissions",
    links: [
      { href: "/admissions", label: "Admissions 2025" },
      { href: "/programs", label: "Programs" },
      { href: "/faq", label: "FAQ" },
      { href: "/ask-ai", label: "Ask AI Counsellor" },
      { href: "/contact", label: "Contact Admissions" },
    ],
  },
  {
    title: "Campus Life",
    links: [
      { href: "/campus", label: "Campus Life" },
      { href: "/facilities", label: "Facilities & Labs" },
      { href: "/placements", label: "Placements" },
      { href: "/about", label: "About EIT" },
      { href: "/university", label: "Governance" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/programs", label: "Prospectus" },
      { href: "/admissions", label: "Fee Structure" },
      { href: "/placements", label: "Placement Report" },
      { href: "/admin", label: "Admin Dashboard" },
    ],
  },
];

const SOCIALS = [
  { Icon: Twitter, href: "#", label: "Twitter" },
  { Icon: Linkedin, href: "#", label: "LinkedIn" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Youtube, href: "#", label: "YouTube" },
  { Icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  const year = React.useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="relative mt-16">
      {/* Soft glow divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 -z-0 opacity-60 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-10 space-y-12 relative z-10">
        <ScrollReveal preset="fade-up">
          {/* Brand row */}
          <div className="grid gap-10 lg:grid-cols-12 items-start">
            <div className="lg:col-span-4 space-y-5">
              <Link href="/" className="flex items-center gap-2.5 group">
                <span className="relative grid size-10 place-items-center rounded-xl overflow-hidden">
                  <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-elzada-400 via-elzada-600 to-navy-800" />
                  <GraduationCap className="relative size-5 text-white" />
                </span>
                <div className="leading-tight">
                  <div className="text-base font-bold tracking-tight text-foreground">
                    Elzada Institute of Technology
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Est. 2003 · NAAC A++
                  </div>
                </div>
              </Link>

              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                A premier deemed university in Yelahanka, Bengaluru. Engineering,
                management, design, sciences, and law — powered by an AI-first campus
                experience and an industry-co-designed curriculum.
              </p>

              <ul className="space-y-2.5 text-sm">
                <li className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="size-4 mt-0.5 text-gold-500 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-medium">
                      Campus:
                    </strong>{" "}
                    Allalasandra, Yelahanka, Bengaluru – 560064, Karnataka, India
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="size-4 text-gold-500 shrink-0" />
                  <span>
                    <strong className="text-foreground/90 font-medium">
                      Admissions:
                    </strong>{" "}
                    +91-80-6123-4567
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <Mail className="size-4 text-gold-500 shrink-0" />
                  <a
                    href="mailto:admissions@elzada.edu.in"
                    className="hover:text-primary transition-colors"
                  >
                    admissions@elzada.edu.in
                  </a>
                </li>
              </ul>

              <div className="flex items-center gap-2">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="neu-icon-btn size-9"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:pl-6">
              {COLUMNS.map((c, colIdx) => (
                <RevealItem key={c.title} delay={colIdx * 0.06} preset="fade-up">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-gold-500 shadow-gold-glow" />
                      {c.title}
                    </h4>
                    <ul className="space-y-2">
                      {c.links.map((l, i) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                          >
                            <span className="w-0 group-hover:w-3 h-px bg-gold-500 transition-all duration-300 shrink-0" />
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* AI CTA strip */}
        <ScrollReveal preset="fade-up" delay={0.1}>
          <div className="neu-surface p-5 md:p-6 grid gap-5 md:grid-cols-12 items-center overflow-hidden relative">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-primary/10 blur-3xl" />
            <div className="md:col-span-7 space-y-1.5 relative">
              <div className="flex items-center gap-2">
                <span className="chip border-primary/30 text-primary">
                  <Sparkles className="size-3" />
                  Elzada AI Counsellor
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Live 24×7 · Admissions queries, programs, fees, and more
                </span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                Get instant answers to 150+ admission questions.
              </p>
              <p className="text-sm text-muted-foreground">
                Confused about eligibility, fees, or placements? Start a conversation with
                Elzada AI — it pulls answers directly from our knowledge base.
              </p>
            </div>
            <div className="md:col-span-5 flex md:justify-end gap-2.5 relative">
              <Link
                href="/ask-ai"
                className="neu-btn-primary !px-5 !py-3 text-sm font-semibold"
              >
                <Sparkles className="size-4" /> Chat with Elzada AI
              </Link>
              <Link
                href="/contact"
                className="neu-btn !px-5 !py-3 text-sm font-medium"
              >
                Talk to Admissions
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Bottom bar */}
        <div className="divider-gold" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {year} Elzada Institute of Technology. All rights reserved.
            <span className="hidden sm:inline mx-2 text-border">·</span>
            <span className="sm:hidden block" />
            <Link href="/about" className="hover:text-primary">
              Privacy Policy
            </Link>
            <span className="mx-2 text-border">·</span>
            <Link href="/admissions" className="hover:text-primary">
              Terms of Admission
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right">
            Crafted with <span className="text-gold-500">♥</span> in Bengaluru ·
            Next.js · Supabase · RAG AI
          </p>
        </div>
      </div>
    </footer>
  );
}
