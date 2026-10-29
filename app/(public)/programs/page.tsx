import { ProgramFilter, type Program } from "@/components/program-filter";
import { SectionHeader } from "@/components/neu-card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StatsCards } from "@/components/stats-cards";
import { GraduationCap, BookOpen, Sparkles, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Programs | Elzada Institute of Technology",
  description:
    "Explore 28+ full-time programs at EIT Yelahanka: B.Tech (CSE, AI/ML, Data Science, VLSI, Aero, Mech, Civil), M.Tech, MBA, BBA, BCA, B.Des, BA LLB, B.Sc, and PhD. Filter and compare.",
};

const PROGRAMS: Program[] = [
  {
    name: "B.Tech – Computer Science & Engineering",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description:
      "AI-first CSE curriculum covering systems, theory, ML and cloud. Industry certifications from AWS Academy, Cisco and NVIDIA included.",
    highlights: ["6-month industry thesis", "Specialisations: AI/ML · Cybersecurity · Cloud", "Avg. CTC ₹14.2 LPA"],
    fee: "Tuition: ₹2,65,000 / year",
    ctc: "₹14.2 L avg · ₹52L high",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – AI & Machine Learning",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description:
      "Dedicated AI program with deep coverage of deep learning, computer vision, NLP, reinforcement learning and MLOps.",
    highlights: ["NVIDIA DLI certification", "GPU lab access (Year 2)", "Capstone with industry partner"],
    fee: "Tuition: ₹2,75,000 / year",
    ctc: "₹16.5 L avg · ₹52L high",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – Data Science",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description: "Statistical foundations, big data engineering, analytics and ML for business decision making.",
    highlights: ["SAS & IBM certifications", "Live analytics capstone", "Industry analytics lab"],
    fee: "Tuition: ₹2,65,000 / year",
    ctc: "₹12.6 L avg",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – Electronics & Communication",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description: "VLSI, embedded systems, signal processing and 5G/6G communications with strong lab component.",
    highlights: ["TI India partnership", "VLSI design studio", "5G testbed access"],
    fee: "Tuition: ₹2,40,000 / year",
    ctc: "₹10.1 L avg",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – Mechanical Engineering",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description: "Smart manufacturing, robotics, EV powertrains, design and thermal engineering.",
    highlights: ["Bosch partnership", "EV powertrain lab", "CAD/CAM studio"],
    fee: "Tuition: ₹2,30,000 / year",
    ctc: "₹8.8 L avg",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – Civil Engineering",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description: "Structural, geotechnical, environmental and transportation engineering with BIM focus.",
    highlights: ["Industry site visits", "Smart-city studio", "Survey camp every year"],
    fee: "Tuition: ₹2,20,000 / year",
    ctc: "₹8.4 L avg",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – Biotechnology",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Sciences",
    description:
      "Biochemistry, molecular biology, bioinformatics and bioprocess engineering with industry internships.",
    highlights: ["DBT-funded projects", "Bio-incubation access", "Industry internships"],
    fee: "Tuition: ₹2,40,000 / year",
    eligibility: "60% in XII PCB/PCM + EAT",
  },
  {
    name: "B.Tech – Aerospace Engineering",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description: "Aerodynamics, propulsion, structures and avionics with ISRO collaborations.",
    highlights: ["ISRO guest lectures", "Wind tunnel lab", "Drone lab"],
    fee: "Tuition: ₹2,55,000 / year",
    eligibility: "65% in XII PCM + EAT/JEE",
  },
  {
    name: "B.Tech – Robotics & Automation",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Engineering",
    description: "Mechatronics fundamentals with autonomous systems, ROS and Industry 4.0 focus.",
    highlights: ["ROS-driven curriculum", "Industry 4.0 lab", "Annual robotics hackathon"],
    fee: "Tuition: ₹2,60,000 / year",
    ctc: "₹11.4 L avg",
    eligibility: "60% in XII PCM + EAT/JEE",
  },
  {
    name: "M.Tech – Computer Science (Data Engineering)",
    level: "PG",
    duration: "2 years · 4 semesters",
    category: "Engineering",
    description: "Advanced data engineering, distributed systems, streaming analytics and ML platforms.",
    highlights: ["Sponsored seats", "Industry thesis", "GATE scholarship ₹12,400/mo"],
    fee: "Tuition: ₹1,85,000 / year",
    eligibility: "55% B.E/B.Tech + GATE/EAT-PG",
  },
  {
    name: "M.Tech – VLSI Design",
    level: "PG",
    duration: "2 years · 4 semesters",
    category: "Engineering",
    description: "Full-custom & semi-custom VLSI flow, FPGA prototyping, verification, tapeout.",
    highlights: ["Cadence & Synopsys tools", "TI thesis slots", "Lab-to-tapeout project"],
    fee: "Tuition: ₹1,85,000 / year",
    eligibility: "55% B.E/B.Tech ECE + GATE/EAT-PG",
  },
  {
    name: "M.Tech – Robotics & Automation",
    level: "PG",
    duration: "2 years · 4 semesters",
    category: "Engineering",
    description: "Mobile robotics, ROS, computer vision and intelligent control systems.",
    highlights: ["Industry internships", "Optional dual-degree (intl.)", "Live drone projects"],
    fee: "Tuition: ₹1,85,000 / year",
    eligibility: "55% B.E/B.Tech + GATE/EAT-PG",
  },
  {
    name: "MBA – Marketing",
    level: "PG",
    duration: "2 years · 4 semesters",
    category: "Management",
    description: "Digital marketing, brand strategy, consumer insights, sales and analytics.",
    highlights: ["Singapore / Dubai immersion", "Live consulting capstone", "3-month internship"],
    fee: "Tuition: ₹3,40,000 / year",
    ctc: "₹12.9 L avg",
    eligibility: "50% in Bachelor's + CAT/XAT/MAT/EMAT",
  },
  {
    name: "MBA – Finance",
    level: "PG",
    duration: "2 years · 4 semesters",
    category: "Management",
    description: "Corporate finance, IB, risk, FinTech specialisations with Bloomberg lab.",
    highlights: ["Bloomberg Terminal lab", "FinTech track", "CFA-aligned curriculum"],
    fee: "Tuition: ₹3,40,000 / year",
    ctc: "₹13.5 L avg",
    eligibility: "50% in Bachelor's + CAT/XAT/MAT/EMAT",
  },
  {
    name: "MBA – Business Analytics",
    level: "PG",
    duration: "2 years · 4 semesters",
    category: "Management",
    description: "Descriptive · Predictive · Prescriptive analytics with Python, R, Tableau, Power BI, SQL.",
    highlights: ["Capstone with partners", "1:1 industry mentorship", "International immersion"],
    fee: "Tuition: ₹3,40,000 / year",
    ctc: "₹14.6 L avg",
    eligibility: "50% in Bachelor's + CAT/XAT/MAT/EMAT",
  },
  {
    name: "BBA",
    level: "UG",
    duration: "3 years · 6 semesters",
    category: "Management",
    description: "Foundational business with Marketing, Finance, HR, Ops and Entrepreneurship electives.",
    highlights: ["Industry mentor (Year 1)", "Optional MBA fast-track", "Live consulting capstone"],
    fee: "Tuition: ₹1,10,000 / year",
    eligibility: "60% in Class XII (any stream)",
  },
  {
    name: "BCA",
    level: "UG",
    duration: "3 years · 6 semesters",
    category: "Sciences",
    description: "Application-oriented CS: programming, databases, web dev, and software engineering.",
    highlights: ["Industry certifications", "Annual hackathon", "Optional MCA pathway"],
    fee: "Tuition: ₹1,10,000 / year",
    eligibility: "55% in Class XII (any stream)",
  },
  {
    name: "B.Des – Industrial Design",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Design",
    description: "Product, transport and system design with strong studio practice.",
    highlights: ["Industry studio per sem", "Annual design showcase", "Maker-space access"],
    fee: "Tuition: ₹1,95,000 / year",
    eligibility: "50% in Class XII + EIT-DAT",
  },
  {
    name: "B.Des – Communication Design",
    level: "UG",
    duration: "4 years · 8 semesters",
    category: "Design",
    description: "Graphic, UI/UX, motion, branding, illustration — portfolio-first curriculum.",
    highlights: ["Adobe Creative Campus", "Live brand projects", "Annual Portfolio Week"],
    fee: "Tuition: ₹1,95,000 / year",
    eligibility: "50% in Class XII + EIT-DAT",
  },
  {
    name: "BA LLB (Integrated)",
    level: "UG",
    duration: "5 years · 10 semesters",
    category: "Law",
    description: "Integrated arts + law with Corporate, Criminal, IP and Constitutional Law tracks.",
    highlights: ["Moot court training", "Top law firm internships", "Bar Council prep"],
    fee: "Tuition: ₹1,80,000 / year",
    eligibility: "55% in Class XII + CLAT/EIT-LAT",
  },
  {
    name: "B.Sc – Physics / Chemistry / Mathematics",
    level: "UG",
    duration: "3 years · 6 semesters",
    category: "Sciences",
    description: "Core sciences with DS, Computational Physics and Materials Science electives.",
    highlights: ["Research internships (Year 2)", "Bridge to M.Sc / PhD", "Industry lab visits"],
    fee: "Tuition: ₹85,000 / year",
    eligibility: "55% in Class XII Science",
  },
  {
    name: "PhD – Engineering / Management / Sciences",
    level: "Doctoral",
    duration: "3–5 years",
    category: "Research",
    description:
      "Full-time and part-time doctoral programs across 14 research centres with research assistantships.",
    highlights: ["₹31k–₹35k monthly assistantship", "Twice-a-year intake", "International research visits"],
    fee: "Tuition: ₹60,000 / year",
    eligibility: "60% in Master's + ERAT + Interview",
  },
];

export default function ProgramsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 space-y-12">
      <ScrollReveal preset="blur">
        <header className="max-w-4xl">
          <div className="chip !text-[11px] !font-bold tracking-[0.22em] uppercase text-muted-foreground mb-4">
            <span className="size-1.5 rounded-full bg-primary" />
            Programs · Admissions 2025
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.04] text-balance">
            Find the program{" "}
            <span className="gradient-text">built for you.</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
            From engineering to management, design to law — explore 22+ full-time programs at
            <strong className="text-foreground font-semibold"> EIT Yelahanka, Bengaluru.</strong>
            Filter by level or discipline, and chat with Elzada AI for personalised recommendations.
          </p>
        </header>
      </ScrollReveal>

      <StatsCards
        columns={3}
        items={[
          { label: "Programs", value: 28, suffix: "+", hint: "UG · PG · Diploma · PhD", accent: "blue", icon: <GraduationCap className="size-5" /> },
          { label: "Industry Tie-ups", value: 72, suffix: "+", hint: "Co-designed curricula", accent: "gold", icon: <BookOpen className="size-5" /> },
          { label: "Specialised Labs", value: 56, hint: "AI, VLSI, EV, Aero, Bloomberg…", accent: "navy", icon: <Sparkles className="size-5" /> },
        ]}
      />

      <ProgramFilter programs={PROGRAMS} />

      <ScrollReveal preset="fade-up">
        <section className="neu-surface-sm p-6 sm:p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-primary/14 blur-3xl pointer-events-none" />
          <div className="grid md:grid-cols-12 gap-8 items-center relative">
            <div className="md:col-span-8 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-gold-500/25 to-gold-600/10 text-gold-600 dark:text-gold-400 shrink-0">
                  <Award className="size-5" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Scholarships up to 100% tuition waiver.
                </h2>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                Merit scholarships based on JEE/EAT percentile, Class XII marks, and category reservations.
                Defence and Kashmiri-migrant candidates enjoy full tuition waivers with hostel stipend.
              </p>
            </div>
            <div className="md:col-span-4 flex md:justify-end gap-2.5 flex-wrap">
              <Link href="/admissions" className="neu-btn-primary !px-5 !py-3 text-sm font-bold w-full sm:w-auto justify-center">
                Admissions 2025 Guide
              </Link>
              <Link href="/ask-ai" className="neu-btn !px-5 !py-3 text-sm font-semibold w-full sm:w-auto justify-center">
                <Sparkles className="size-4" /> Chat for personalised match
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
