import {
  Music,
  Palette,
  Trophy,
  Users,
  Cpu,
  HeartHandshake,
  Sparkles,
  BookOpen,
  Dumbbell,
  TreePine,
  Home,
  UtensilsCrossed,
  Radio,
} from "lucide-react";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Campus Life | Elzada Institute of Technology, Yelahanka",
  description:
    "Life on the 42-acre green campus of Elzada Institute of Technology, Yelahanka, Bengaluru: 80+ clubs, Aavartan fest, sports, hostels, maker culture, auditoriums, and community impact.",
};

const HIGHLIGHTS = [
  {
    icon: Trophy,
    t: "28 Sports Disciplines",
    d: "Cricket to esports, indoor stadiums and an Olympic-length swimming pool. Annual Sports Week with inter-college tournaments.",
    acc: "from-emerald-500/25 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Music,
    t: "Aavartan Fest",
    d: "25,000+ visitors from 200 colleges for our flagship 3-day cultural + technical festival. ₹25L+ prize pool across events.",
    acc: "from-pink-500/25 to-pink-600/10 text-pink-600 dark:text-pink-400",
  },
  {
    icon: Cpu,
    t: "Maker Culture",
    d: "Maker-spaces, robotics labs, drone arena, 3D printing workshops, and the annual HackOn 48-hr hackathon with industry themes.",
    acc: "from-primary/25 to-primary/10 text-primary",
  },
  {
    icon: Users,
    t: "80+ Student Clubs",
    d: "AI Society, Finance Lab, Astronomy, Photography, Debate, Drama, Dance, Entrepreneurship, Social Impact and many more.",
    acc: "from-amber-500/25 to-amber-600/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Palette,
    t: "Performing Arts",
    d: "Three auditoriums, dedicated music rooms, and an open-air amphitheatre with 2,500 seating capacity for cultural evenings.",
    acc: "from-gold-500/25 to-gold-600/10 text-gold-600 dark:text-gold-400",
  },
  {
    icon: HeartHandshake,
    t: "Community Impact",
    d: "Mandatory social-impact capstone, 12 partner NGOs, annual Unnat Bharat rural immersion week for all students.",
    acc: "from-navy-500/25 to-navy-700/10 text-navy-700 dark:text-navy-300",
  },
];

const EVENTS = [
  { date: "Aug", t: "Freshers' Welcome", d: "Week-long onboarding with mentor-connect, ice-breakers & Raftaar talent night.", hue: "primary" },
  { date: "Oct", t: "Aavartan Fest", d: "Flagship cultural + technical fest. 25K+ visitors from 200+ colleges.", hue: "pink" },
  { date: "Feb", t: "HackOn 48hr", d: "Industry-sponsored themes, ₹10L prize pool + incubation offers.", hue: "gold" },
  { date: "Mar", t: "Sports Week", d: "Inter-department & inter-college tournaments across 28 disciplines.", hue: "emerald" },
  { date: "May", t: "Research Day", d: "Poster showcase of undergraduate research + lightning talks.", hue: "navy" },
];

const HUE_BG: Record<string, string> = {
  primary: "from-primary/25 to-primary/5 text-primary",
  pink: "from-pink-500/25 to-pink-600/5 text-pink-600 dark:text-pink-400",
  gold: "from-gold-500/25 to-gold-600/5 text-gold-600 dark:text-gold-400",
  emerald: "from-emerald-500/25 to-emerald-600/5 text-emerald-600 dark:text-emerald-400",
  navy: "from-navy-500/25 to-navy-700/5 text-navy-700 dark:text-navy-300",
};

const FACILITIES = [
  { name: "Central Library", icon: BookOpen, d: "1,20,000+ volumes, 24×7 reading halls, IEEE/Springer access." },
  { name: "Hostels", icon: Home, d: "AC / non-AC. 4 meals/day. Laundry, 24×7 security, medical." },
  { name: "Food Courts", icon: UtensilsCrossed, d: "3 main messes + 6 mini-cafés + North Indian & South Indian options." },
  { name: "Sports & Gym", icon: Dumbbell, d: "Olympic pool, cricket ground, basketball, badminton, high-performance gym." },
  { name: "Green Campus", icon: TreePine, d: "42-acre solar-powered campus with 50% green cover & rainwater harvesting." },
  { name: "Campus Radio", icon: Radio, d: "EIT Radio 90.1, student-run 24×7 with podcasts & live events." },
];

export default function CampusPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 space-y-16 md:space-y-20">
      <ScrollReveal preset="blur">
        <header className="max-w-3xl space-y-5">
          <div className="chip !text-[11px] !font-bold tracking-[0.22em] uppercase text-primary border-primary/30">
            <TreePine className="size-3.5" />
            Campus Life · Yelahanka, Bengaluru
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.04] text-balance">
            A 42-acre green campus{" "}
            <span className="gradient-text">that feels like home.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            From spirited fests to focused library nights, from late-night hackathons to sunrise at the cricket ground,
            <strong className="text-foreground font-semibold"> EIT Yelahanka</strong> is built to help you discover
            passions and make friendships that last a lifetime.
          </p>
        </header>
      </ScrollReveal>

      {/* Highlights */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Highlights"
            title="Six reasons students love EIT"
            description="Every corner of campus is designed for curiosity, creativity, and collaboration."
          />
        </ScrollReveal>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((h, i) => (
            <RevealItem key={h.t} delay={i * 0.05} preset="fade-up">
              <NeuCard hover="lift" className="p-5 sm:p-6 h-full group relative overflow-hidden">
                <div className="absolute -top-20 -right-20 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className={cn("grid size-12 place-items-center rounded-2xl bg-gradient-to-br shrink-0", h.acc)}>
                  <h.icon className="size-5.5" />
                </div>
                <h3 className="mt-4 text-lg font-extrabold tracking-tight leading-snug group-hover:text-primary transition-colors">
                  {h.t}
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{h.d}</p>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Year at a glance */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Calendar"
            title="A year at EIT at a glance"
            description="A snapshot of the big events that punctuate campus life every academic year."
          />
        </ScrollReveal>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {EVENTS.map((e, i) => (
            <RevealItem key={e.t} delay={i * 0.05} preset="fade-up">
              <NeuCard hover="pop" className="p-4 sm:p-5 h-full">
                <div className={cn("inline-flex items-center gap-1.5 chip !text-[10px] !px-2.5 !py-0.5 !font-bold tracking-[0.18em] uppercase border bg-gradient-to-br", HUE_BG[e.hue])}>
                  {e.date}
                </div>
                <div className="mt-3 text-base font-extrabold tracking-tight leading-snug">{e.t}</div>
                <div className="mt-1.5 text-xs sm:text-[13px] text-muted-foreground leading-relaxed">{e.d}</div>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Facilities */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Amenities"
            title="Campus facilities"
            description="Everything you need to live, learn, and stay well under one sky."
          />
        </ScrollReveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FACILITIES.map((f, i) => (
            <RevealItem key={f.name} delay={i * 0.05} preset="fade-up">
              <div className="neu-inset p-5 rounded-2xl flex items-start gap-4 h-full group hover:-translate-y-0.5 transition-transform">
                <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary shrink-0">
                  <f.icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold tracking-tight">{f.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.d}</p>
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Clubs */}
      <ScrollReveal preset="fade-up">
        <NeuCard className="p-6 sm:p-8 md:p-10 overflow-hidden relative">
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/16 blur-3xl pointer-events-none" />
          <div className="grid md:grid-cols-12 gap-6 items-start relative">
            <div className="md:col-span-6 lg:col-span-7 space-y-3">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                80+ student clubs at EIT.{" "}
                <span className="gradient-text">Find your tribe.</span>
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Whether you are into finance, robotics, debate, astronomy, dance, theatre, cinema, or social impact —
                you will find your people here. Club recruitment happens every August during Fresher&apos;s Week.
              </p>
            </div>
            <div className="md:col-span-6 lg:col-span-5 flex md:justify-end items-start">
              <Link href="/ask-ai" className="neu-btn-primary !px-5 !py-3 text-sm font-bold w-full sm:w-auto justify-center">
                <Sparkles className="size-4" /> Ask AI about clubs
              </Link>
            </div>
          </div>
          <div className="mt-7 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 relative">
            {[
              "Robotics", "AI Society", "Finance Lab", "Astronomy", "Photography", "Debate",
              "Dance Crew", "Music Society", "Dramatics", "Coding Club", "Quiz Club", "E-Cell",
              "Social Impact", "Literary", "Cycling", "Yoga & Meditation", "Chess", "Film Society",
            ].map((c, i) => (
              <RevealItem key={c} delay={i * 0.025} preset="zoom">
                <div className="neu-surface-xs !rounded-xl px-2.5 py-3 text-center text-xs sm:text-[13px] font-bold text-foreground/90 hover:text-primary hover:-translate-y-0.5 transition-all">
                  {c}
                </div>
              </RevealItem>
            ))}
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
