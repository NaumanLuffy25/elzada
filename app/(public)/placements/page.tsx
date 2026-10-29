import { Award, TrendingUp, Users, Briefcase, Building2, ArrowRight } from "lucide-react";
import { StatsCards } from "@/components/stats-cards";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import Link from "next/link";

export const metadata = { title: "Placements | Elzada Institute of Technology" };

const RECRUITERS = [
  "Microsoft", "Google", "Amazon", "Atlassian", "Adobe", "Salesforce", "Uber", "Flipkart",
  "Razorpay", "Zerodha", "JP Morgan", "Goldman Sachs", "Deloitte", "Accenture", "TCS", "Infosys",
  "Wipro", "Cognizant", "Qualcomm", "Intel", "NVIDIA", "Texas Instruments", "Bosch", "Mercedes-Benz R&D",
  "Tata Motors", "Reliance Jio", "Airtel", "ICICI Bank", "HDFC Bank", "Paytm", "PhonePe",
];

const TESTIMONIALS = [
  { name: "Riya Bhattacharya", program: "B.Tech CSE '24", company: "Microsoft, Redmond", ctc: "USD 145,000" },
  { name: "Aditya Menon", program: "B.Tech CSE '24", company: "Atlassian", ctc: "₹52 LPA" },
  { name: "Sneha Patel", program: "MBA '24", company: "Goldman Sachs", ctc: "₹32 LPA" },
  { name: "Karthik Nair", program: "B.Tech ECE '24", company: "Qualcomm", ctc: "₹28 LPA" },
];

const PROFILES = [
  { role: "SDE", companies: "Microsoft, Amazon, Atlassian, Flipkart", avg: "₹18.5 LPA" },
  { role: "Data Scientist", companies: "Google, Uber, Razorpay, Coinbase", avg: "₹17.2 LPA" },
  { role: "ML Engineer", companies: "NVIDIA, Qualcomm, Samsung Research", avg: "₹16.8 LPA" },
  { role: "Business Analyst", companies: "Deloitte, EY, JP Morgan, ICICI Bank", avg: "₹12.4 LPA" },
  { role: "Core Engineer", companies: "Mercedes-Benz, Tata Motors, Bosch", avg: "₹9.6 LPA" },
];

const HIGHLIGHTS = [
  { icon: Award, label: "Mock Interviews", desc: "Weekly GDs and technical rounds" },
  { icon: TrendingUp, label: "Industry Electives", desc: "Taught by visiting professionals" },
  { icon: Users, label: "Alumni Mentors", desc: "200+ via ELAN Bridge network" },
  { icon: Briefcase, label: "Intl. Placements", desc: "Dedicated global careers team" },
];

export default function PlacementsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20 space-y-16 md:space-y-24">
      <ScrollReveal preset="fadeUpBlur">
        <header className="max-w-3xl">
          <span className="chip mb-4">Placements & Careers</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
            Where talent meets{" "}
            <span className="gradient-text">opportunity.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            The Career Development Centre (CDC) at EIT has placed over 38,000 alumni across the world. In 2023–24 we
            recorded our highest-ever placement season with 96% of eligible students placed across 320+ recruiters.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp" delay={0.05}>
        <StatsCards
          items={[
            { label: "Placement rate", value: "96%", hint: "Of eligible students", accent: "green", trend: "+2%" },
            { label: "Highest CTC (domestic)", value: "₹52 LPA", hint: "Atlassian", accent: "blue", trend: "+12%" },
            { label: "Highest CTC (international)", value: "$145k", hint: "Microsoft, Redmond", accent: "pink", trend: "+18%" },
            { label: "Recruiters", value: "320+", hint: "Including 28 new", accent: "amber", trend: "+9%" },
          ]}
        />
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Career Development Centre" title="Structured support, from Year 1." description="1,200+ hours of structured training delivered across your degree — aptitude, communication, domain-specific mock interviews and 1:1 mentorship with industry professionals." />
      </ScrollReveal>

      <section className="grid gap-6 lg:grid-cols-12 items-start">
        <ScrollReveal className="lg:col-span-5 space-y-4" preset="fadeUp">
          <NeuCard variant="soft" hover="none" className="p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Building2 className="size-5 text-primary" /> How the CDC prepares you
            </h3>
            <ul className="mt-4 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <RevealItem key={h.label} className="flex gap-3 items-start">
                  <span className="grid size-10 place-items-center shrink-0 rounded-xl neu-pressed text-primary">
                    <h.icon className="size-4.5" />
                  </span>
                  <div>
                    <div className="font-medium text-sm">{h.label}</div>
                    <div className="text-sm text-muted-foreground">{h.desc}</div>
                  </div>
                </RevealItem>
              ))}
            </ul>
          </NeuCard>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-7" preset="fadeUp" delay={0.08}>
          <NeuCard variant="flat" hover="none" className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-semibold">Placement profiles · 2024</h3>
              <span className="chip chip-accent">Average CTCs</span>
            </div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 text-muted-foreground">
                    <th className="text-left px-4 py-3 font-medium">Role</th>
                    <th className="text-left px-4 py-3 font-medium">Top recruiters</th>
                    <th className="text-right px-4 py-3 font-medium">Avg CTC</th>
                  </tr>
                </thead>
                <tbody>
                  {PROFILES.map((p) => (
                    <tr key={p.role} className="border-t border-border/70 transition-colors hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{p.role}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.companies}</td>
                      <td className="px-4 py-3 text-right font-semibold text-primary">{p.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </NeuCard>
        </ScrollReveal>
      </section>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Student Stories" title="Recent placement highlights" description="A few of our graduating students who landed their dream roles this season." />
      </ScrollReveal>

      <ScrollReveal preset="staggerUp">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map((t) => (
            <RevealItem key={t.name}>
              <NeuCard variant="soft" hover="lift" className="p-5 h-full">
                <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground font-semibold shadow-lg shadow-primary/20">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="mt-4 font-semibold">{t.name}</h3>
                <p className="text-xs text-muted-foreground">{t.program}</p>
                <div className="divider-gold my-4" />
                <p className="text-sm text-muted-foreground">
                  Placed at <strong className="text-foreground">{t.company}</strong>
                </p>
                <p className="text-base font-semibold text-accent mt-1.5">{t.ctc}</p>
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Top Recruiters" title="320+ companies hiring from EIT" description="From FAANG and global consultancies to Indian unicorns and core engineering firms." />
      </ScrollReveal>

      <ScrollReveal preset="staggerUp">
        <NeuCard variant="elevated" hover="none" className="p-6 md:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {RECRUITERS.map((r) => (
              <RevealItem key={r}>
                <div className="neu-surface-xs rounded-xl p-3 text-center text-xs sm:text-sm font-medium text-foreground/85 transition-all duration-300 hover:scale-[1.03] hover:text-primary">
                  {r}
                </div>
              </RevealItem>
            ))}
          </div>
        </NeuCard>
      </ScrollReveal>

      <ScrollReveal preset="fadeUpBlur">
        <NeuCard variant="elevated" hover="none" className="relative overflow-hidden p-8 md:p-12 text-center">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Ready to start your <span className="gradient-text">journey?</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Explore the programs that align with your career goals or chat with our AI counsellor for personalised guidance.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/programs" className="neu-btn neu-btn-primary">
                Explore programs <ArrowRight className="size-4" />
              </Link>
              <Link href="/ask-ai" className="neu-btn neu-btn-accent">
                Chat with Elzada AI
              </Link>
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
