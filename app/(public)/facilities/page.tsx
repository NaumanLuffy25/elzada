import {
  Library, Building, Wifi, Bus, Dumbbell, FlaskConical, UtensilsCrossed, HeartPulse,
  Leaf, BedDouble, ArrowRight
} from "lucide-react";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import Link from "next/link";

export const metadata = { title: "Campus Facilities | Elzada Institute of Technology" };

const FACILITIES = [
  { icon: Library, t: "Central Library", d: "1.8 lakh volumes, 22,000 e-journals, 24/7 reading halls, digital repository." },
  { icon: Building, t: "Academic Blocks", d: "100% smart classrooms, dedicated seminar halls, departmental libraries." },
  { icon: FlaskConical, t: "Research Labs", d: "14 dedicated research centres covering AI, robotics, biotech, quantum and more." },
  { icon: Wifi, t: "Connectivity", d: "12 Gbps backbone, campus-wide Wi-Fi, 5G testbed." },
  { icon: UtensilsCrossed, t: "Mess & Cafeterias", d: "14 cafeterias serving four meals a day with multi-cuisine menus." },
  { icon: Dumbbell, t: "Sports Complex", d: "Indoor stadiums, swimming pool, cricket, football, tennis and more." },
  { icon: Bus, t: "Transportation", d: "35 shuttle buses across Bengaluru, free bicycle-sharing on campus." },
  { icon: HeartPulse, t: "Health Centre", d: "24×7 medical facility with two resident doctors, ambulance & counselling." },
];

const HOSTEL_FEATURES = ["24×7 security", "Biometric access", "Reading rooms", "Common rooms", "Gym", "TV lounge", "Indoor games", "Visitor lounge"];
const GREEN_FEATURES = ["2.4 MW solar", "Rainwater harvesting", "Zero single-use plastic", "Organic farm", "EV charging", "Smart meters"];

export default function FacilitiesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20 space-y-16 md:space-y-24">
      <ScrollReveal preset="fadeUpBlur">
        <header className="max-w-3xl">
          <span className="chip mb-4">Campus Facilities</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
            World-class infrastructure for a{" "}
            <span className="gradient-text">future-ready campus.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
            42 acres of green, sustainable, fully Wi-Fi enabled campus with everything you need to live, learn and grow — located at Allalasandra, Yelahanka, Bengaluru – 560064.
          </p>
        </header>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="On Campus" title="Everything you need, minutes away." description="From 24/7 libraries and research labs to sports, transport and healthcare." />
      </ScrollReveal>

      <ScrollReveal preset="staggerUp">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FACILITIES.map((f, i) => {
            const accents = [
              "from-primary to-primary/60", "from-accent to-accent/60",
              "from-emerald-500 to-emerald-500/60", "from-rose-500 to-rose-500/60",
              "from-sky-500 to-sky-500/60", "from-violet-500 to-violet-500/60",
              "from-amber-500 to-amber-500/60", "from-pink-500 to-pink-500/60",
            ];
            return (
              <RevealItem key={f.t}>
                <NeuCard variant="soft" hover="lift" className="p-5 h-full group">
                  <div className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${accents[i % accents.length]} text-primary-foreground shadow-lg group-hover:scale-105 transition-transform`}>
                    <f.icon className="size-5.5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{f.t}</h3>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.d}</p>
                </NeuCard>
              </RevealItem>
            );
          })}
        </div>
      </ScrollReveal>

      <ScrollReveal preset="fadeUp">
        <SectionHeader eyebrow="Residential & Green" title="A home on campus." description="Comfortable hostels, wholesome meals and a commitment to sustainability." />
      </ScrollReveal>

      <section className="grid lg:grid-cols-2 gap-6">
        <ScrollReveal preset="fadeUp">
          <NeuCard variant="flat" hover="glow" className="p-6 md:p-8 h-full">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl neu-pressed text-primary">
                <BedDouble className="size-5.5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">Hostel & Mess</h2>
                <p className="text-sm text-muted-foreground">6,000+ students · 8 hostels</p>
              </div>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Single, double and triple occupancy rooms with attached bathrooms, study desks, wardrobes and 24×7 power backup.
              The mess serves four meals a day with multi-cuisine menus curated by a student committee.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {HOSTEL_FEATURES.map((x) => (
                <div key={x} className="neu-surface-xs rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-accent" /> {x}
                </div>
              ))}
            </div>
          </NeuCard>
        </ScrollReveal>

        <ScrollReveal preset="fadeUp" delay={0.1}>
          <NeuCard variant="flat" hover="glow" className="p-6 md:p-8 h-full">
            <div className="flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-2xl neu-pressed text-emerald-500">
                <Leaf className="size-5.5" />
              </span>
              <div>
                <h2 className="text-xl font-semibold">Sustainability</h2>
                <p className="text-sm text-muted-foreground">Net zero target · 2030</p>
              </div>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              EIT is a signatory of UN PRME and has committed to net-zero campus operations by 2030. Current initiatives
              include a 2.4 MW rooftop solar plant, 100% rainwater harvesting and an on-campus 1,000 sqm organic farm.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              {GREEN_FEATURES.map((x) => (
                <div key={x} className="neu-surface-xs rounded-xl px-3 py-2 text-xs font-medium flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-500" /> {x}
                </div>
              ))}
            </div>
          </NeuCard>
        </ScrollReveal>
      </section>

      <ScrollReveal preset="fadeUpBlur">
        <NeuCard variant="elevated" hover="none" className="relative overflow-hidden p-8 md:p-12 text-center">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight">
              Experience the <span className="gradient-text">campus.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Take a virtual walk through our campus or schedule an in-person visit at Yelahanka.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/campus" className="neu-btn neu-btn-primary">
                Explore campus <ArrowRight className="size-4" />
              </Link>
              <Link href="/contact" className="neu-btn">
                Plan a visit
              </Link>
            </div>
          </div>
        </NeuCard>
      </ScrollReveal>
    </div>
  );
}
