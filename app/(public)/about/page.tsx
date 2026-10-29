import Link from "next/link";
import {
  Award,
  BookOpen,
  Globe2,
  GraduationCap,
  Sparkles,
  Target,
  Lightbulb,
  Users,
  Microscope,
  Flame,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { StatsCards } from "@/components/stats-cards";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "About Elzada Institute of Technology | Yelahanka, Bengaluru",
  description:
    "Learn about Elzada Institute of Technology (EIT), a NAAC A++ accredited deemed university in Yelahanka, Bengaluru. Vision, mission, leadership, faculty, and 22+ years of academic excellence.",
};

const VALUES = [
  {
    icon: Target,
    title: "Outcome-based education",
    text: "Every program maps learning outcomes to industry-recognised competencies, reviewed annually with our Academic Council.",
    accent: "from-primary/25 to-primary/10 text-primary",
  },
  {
    icon: Sparkles,
    title: "Interdisciplinary research",
    text: "14 research centres covering AI, sustainability, quantum computing, aerospace engineering and material science.",
    accent: "from-gold-500/25 to-gold-600/10 text-gold-600 dark:text-gold-400",
  },
  {
    icon: Lightbulb,
    title: "Entrepreneurial mindset",
    text: "Incubation support, seed grants up to ₹50L, and a vibrant student-startup ecosystem with 18+ alumni ventures.",
    accent: "from-emerald-500/25 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Globe2,
    title: "Global outlook",
    text: "120+ international partner universities and 28 student-exchange programs across 22 countries.",
    accent: "from-navy-500/25 to-navy-700/10 text-navy-700 dark:text-navy-300",
  },
];

const PILLARS = [
  { icon: Users, title: "480+ Faculty", d: "78% PhD ratio from IITs, IISc, Stanford, MIT." },
  { icon: Microscope, title: "14 Research Centres", d: "From AI & Quantum to Smart Cities & Aero." },
  { icon: Flame, title: "1400+ Publications", d: "Scopus-indexed; growing at 22% YoY." },
  { icon: ShieldCheck, title: "Industry Tie-ups", d: "72 MoUs with global & domestic leaders." },
  { icon: GraduationCap, title: "Alumni", d: "30,000+ alumni across 35 countries." },
  { icon: HeartHandshake, title: "Social Impact", d: "Mandatory capstone with 12+ partner NGOs." },
];

const LEADERS = [
  {
    name: "Dr. Anita Rao",
    role: "Chairperson, Elzada Foundation",
    bio: "Former IIT Bombay professor and Padma Shri awardee for contributions to higher education. PhD from UC Berkeley.",
  },
  {
    name: "Prof. Karthik Iyer",
    role: "Vice-Chancellor",
    bio: "PhD (Stanford); previously Dean of Engineering at a top-10 Indian university. 100+ international publications.",
  },
  {
    name: "Dr. Meera Subramanian",
    role: "Pro Vice-Chancellor – Academics",
    bio: "Architect of the CBCS curriculum and outcome-based education framework at EIT. PhD from IISC Bangalore.",
  },
  {
    name: "Dr. Rajeev Menon",
    role: "Dean – Research & Innovation",
    bio: "Former DRDO director with 30+ years in aerospace R&D. PhD from IIT Madras.",
  },
];

const ACCREDITATIONS = [
  "NAAC A++ Accredited",
  "NIRF Top 50 Private Engineering",
  "AICTE Approved",
  "UGC Deemed University",
  "AIU Member University",
  "WES Credential Recognised",
  "AACSB Aligned (Management)",
  "32 Patents Granted",
];

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 space-y-20 md:space-y-24">
      <ScrollReveal preset="blur">
        <header className="max-w-3xl">
          <div className="chip !text-[11px] !font-bold tracking-[0.22em] uppercase text-muted-foreground">
            <span className="size-1.5 rounded-full bg-gold-500 shadow-gold-glow" />
            About EIT
          </div>
          <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
            Twenty-two years of{" "}
            <span className="gradient-text">engineering futures.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed text-pretty">
            Elzada Institute of Technology is a NAAC A++ accredited deemed university founded in 2003.
            Nestled on a 42-acre green campus in <strong className="text-foreground font-semibold">Yelahanka, Bengaluru</strong>,
            we are home to 9,500+ students, 480 faculty, and a thriving community of researchers, athletes, artists and entrepreneurs.
          </p>
        </header>
      </ScrollReveal>

      <StatsCards
        items={[
          { label: "Founded", value: "2003", hint: "22+ years of legacy", accent: "blue", icon: <Award className="size-5" /> },
          { label: "Students on campus", value: 9500, suffix: "+", hint: "28 states · 18 countries", accent: "green", icon: <Users className="size-5" /> },
          { label: "Faculty members", value: 480, hint: "PhD ratio 78%", accent: "gold", icon: <GraduationCap className="size-5" /> },
          { label: "Patents granted", value: 32, suffix: "+", hint: "120+ filed since 2018", accent: "pink", icon: <Microscope className="size-5" /> },
        ]}
      />

      {/* Vision & Mission + Accreditation */}
      <section className="grid lg:grid-cols-2 gap-5 sm:gap-6">
        <ScrollReveal preset="fade-right">
          <NeuCard className="p-6 sm:p-7 h-full space-y-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 size-56 rounded-full bg-primary/16 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 relative">
              <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shrink-0">
                <Target className="size-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Vision & Mission
              </h2>
            </div>

            <div className="space-y-2 relative">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Our Vision</h3>
              <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                To be a globally recognised institution producing socially responsible technologists,
                scientists and leaders who advance knowledge for the equitable benefit of humanity.
              </p>
            </div>

            <div className="divider-gold" />

            <div className="space-y-3 relative">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-gold-600 dark:text-gold-400">Our Mission</h3>
              <ul className="space-y-2.5 text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
                {[
                  "Deliver outcome-based, interdisciplinary education aligned with industry and global standards.",
                  "Foster rigorous research that addresses real-world challenges facing India and the world.",
                  "Cultivate entrepreneurial thinking, ethical leadership, and inclusiveness across disciplines.",
                  "Build a sustainable, diverse, and engaged campus community that lives by our values.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-1 shrink-0 grid size-5 place-items-center rounded-full neu-pressed text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </NeuCard>
        </ScrollReveal>

        <ScrollReveal preset="fade-left" delay={0.06}>
          <NeuCard className="p-6 sm:p-7 h-full space-y-4 relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 size-56 rounded-full bg-gold-500/12 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-3 relative">
              <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-gold-500/30 to-gold-600/10 text-gold-600 dark:text-gold-400 shrink-0">
                <Award className="size-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Accreditation & Recognition
              </h2>
            </div>
            <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed relative">
              Elzada Institute of Technology is recognised by statutory bodies and ranked among
              India&apos;s top private technical universities.
            </p>
            <div className="grid sm:grid-cols-2 gap-2.5 relative">
              {ACCREDITATIONS.map((a) => (
                <div
                  key={a}
                  className="neu-surface-xs !rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] font-semibold text-foreground/90 flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Award className="size-3.5 text-primary shrink-0" />
                  {a}
                </div>
              ))}
            </div>

            <div className="divider-gold" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 relative">
              {PILLARS.map((p) => (
                <div key={p.title} className="neu-inset p-3 rounded-xl text-center">
                  <div className="mx-auto grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary mb-1.5">
                    <p.icon className="size-4.5" />
                  </div>
                  <div className="text-[11px] font-bold text-foreground leading-tight">{p.title}</div>
                  <div className="text-[10px] text-muted-foreground/85 mt-0.5 leading-snug">{p.d}</div>
                </div>
              ))}
            </div>
          </NeuCard>
        </ScrollReveal>
      </section>

      {/* Values */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Academic Philosophy"
            title="What we stand for"
            description="Four pillars define our culture and every decision we make — from curriculum to community."
          />
        </ScrollReveal>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <RevealItem key={v.title} delay={i * 0.06} preset="fade-up">
              <NeuCard hover="lift" className="p-5 sm:p-6 h-full group">
                <div className={cn("grid size-11 place-items-center rounded-2xl bg-gradient-to-br", v.accent)}>
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-bold tracking-tight leading-snug text-foreground group-hover:text-primary transition-colors">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Leadership */}
      <section>
        <ScrollReveal preset="fade-up">
          <SectionHeader
            eyebrow="Governance"
            title="Leadership"
            description="Guided by distinguished academicians and leaders from across the world."
          />
        </ScrollReveal>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {LEADERS.map((p, i) => {
            const initials = p.name
              .split(" ")
              .filter((_, idx, arr) => idx === 0 || idx === arr.length - 1)
              .map((w) => w[0])
              .join("")
              .toUpperCase();
            const grad = [
              "from-elzada-400 via-elzada-600 to-navy-800",
              "from-gold-400 via-gold-500 to-gold-700",
              "from-navy-400 via-navy-600 to-navy-800",
              "from-emerald-400 via-emerald-600 to-emerald-800",
            ][i % 4];
            return (
              <RevealItem key={p.name} delay={i * 0.06} preset="fade-up">
                <NeuCard hover="pop" className="p-5 sm:p-6 h-full text-center">
                  <div
                    className={cn(
                      "mx-auto size-16 sm:size-20 grid place-items-center rounded-full bg-gradient-to-br text-white font-bold text-lg sm:text-xl shadow-md",
                      grad,
                    )}
                  >
                    {initials}
                  </div>
                  <h3 className="mt-4 text-base font-extrabold tracking-tight leading-snug text-foreground">
                    {p.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-bold text-primary">{p.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.bio}</p>
                </NeuCard>
              </RevealItem>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <ScrollReveal preset="zoom">
        <NeuCard className="p-6 sm:p-8 overflow-hidden relative">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/18 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative">
            <div className="max-w-xl space-y-2">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
                Want to dig deeper?
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Read our annual Impact Report, talk to current students, or chat with the Elzada AI counsellor for
                instant answers about programs, admissions, and life at EIT Yelahanka.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/ask-ai" className="neu-btn-primary !px-5 !py-3 text-sm font-bold">
                <Sparkles className="size-4" /> Ask Elzada AI
              </Link>
              <Link href="/contact" className="neu-btn !px-5 !py-3 text-sm font-semibold">
                Contact us
              </Link>
              <Link href="/campus" className="neu-btn !px-5 !py-3 text-sm font-semibold">
                <Globe2 className="size-4" /> Campus life
              </Link>
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
