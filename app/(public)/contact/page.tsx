import { Mail, MapPin, Phone, Clock, MessageSquare, Globe2, IndianRupee, Share2 } from "lucide-react";
import { EnquiryForm } from "@/components/enquiry-form";
import { NeuCard, SectionHeader } from "@/components/neu-card";
import { ScrollReveal, RevealItem } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Contact Us | Elzada Institute of Technology, Yelahanka Bengaluru",
  description:
    "Contact Elzada Institute of Technology, Allalasandra, Yelahanka, Bengaluru – 560064. Admissions phone, email, working hours, and enquiry form. We respond within 24 hours.",
};

const CONTACT_BLOCKS = [
  {
    icon: MapPin,
    t: "Campus Address",
    accent: "from-primary/30 to-primary/10 text-primary",
    lines: [
      "Elzada Institute of Technology",
      "Allalasandra, Yelahanka",
      "Bengaluru – 560064",
      "Karnataka, India",
    ],
    link: "https://maps.google.com/?q=Yelahanka+Bengaluru",
    linkLabel: "View on Google Maps",
  },
  {
    icon: Phone,
    t: "Phone",
    accent: "from-emerald-500/30 to-emerald-600/10 text-emerald-600 dark:text-emerald-400",
    lines: [
      "Admissions: +91-80-6123-4567",
      "International: +91-80-6123-4590",
      "Campus Reception: +91-80-6123-4500",
      "Hostel & Transport: +91-80-6123-4570",
    ],
  },
  {
    icon: Mail,
    t: "Email",
    accent: "from-gold-500/30 to-gold-600/10 text-gold-600 dark:text-gold-400",
    lines: [
      "admissions@elzada.edu.in",
      "global@elzada.edu.in (international)",
      "placements@elzada.edu.in",
      "info@elzada.edu.in (general)",
    ],
  },
  {
    icon: Clock,
    t: "Working Hours",
    accent: "from-navy-500/30 to-navy-700/10 text-navy-700 dark:text-navy-300",
    lines: [
      "Monday – Friday: 9:00 AM – 5:30 PM IST",
      "Saturday: 9:00 AM – 2:30 PM IST",
      "Sunday & Public Holidays: Closed",
      "AI Counsellor: Available 24×7",
    ],
  },
];

const QUICK_LINKS = [
  { icon: IndianRupee, t: "Fee Structure", href: "/admissions", desc: "Tuition, hostel, scholarships & EMIs" },
  { icon: Globe2, t: "International Students", href: "/admissions", desc: "NRI / PIO / Foreign nationals" },
  { icon: Share2, t: "Careers @ EIT", href: "/about", desc: "Faculty & staff openings" },
  { icon: MessageSquare, t: "Media & Press", href: "/contact", desc: "pr@elzada.edu.in" },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-10 md:py-16 space-y-16 md:space-y-20">
      <ScrollReveal preset="blur">
        <header className="max-w-3xl space-y-5">
          <div className="chip !text-[11px] !font-bold tracking-[0.22em] uppercase text-primary border-primary/30">
            <MessageSquare className="size-3.5" />
            Contact Admissions
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.04] text-balance">
            We&apos;d love to{" "}
            <span className="gradient-text">hear from you.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Reach the admissions office at EIT Yelahanka, book a campus visit, or submit your enquiry below.
            We typically respond within <strong className="text-foreground font-semibold">24 hours</strong> on working days.
          </p>
        </header>
      </ScrollReveal>

      {/* Contact blocks */}
      <section>
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {CONTACT_BLOCKS.map((b, i) => (
            <RevealItem key={b.t} delay={i * 0.05} preset="fade-up">
              <NeuCard hover="lift" className="p-5 sm:p-6 h-full relative overflow-hidden">
                <div className="absolute -top-20 -right-20 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                <div className={cn("grid size-11 place-items-center rounded-2xl bg-gradient-to-br shrink-0", b.accent)}>
                  <b.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-base font-extrabold tracking-tight">{b.t}</h3>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground leading-relaxed">
                  {b.lines.map((l) => (
                    <div key={l}>{l}</div>
                  ))}
                </div>
                {b.link && (
                  <a
                    href={b.link}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-4 text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-1.5 transition-all"
                  >
                    {b.linkLabel}
                    <Share2 className="size-3" />
                  </a>
                )}
              </NeuCard>
            </RevealItem>
          ))}
        </div>
      </section>

      {/* Enquiry form + map / quick links */}
      <section className="grid lg:grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="lg:col-span-5 space-y-6">
          <ScrollReveal preset="fade-right">
            <div>
              <SectionHeader
                eyebrow="Map & Campus"
                title="Visit us in Yelahanka"
                description="Nestled in North Bengaluru, 10 minutes from Yelahanka New Town on the Doddaballapura road."
              />
            </div>
            <NeuCard className="overflow-hidden h-[340px] sm:h-[380px] relative group">
              {/* Placeholder for map - styled "Visit campus" card with prompt */}
              <div className="absolute inset-0 grid-bg opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-gold-500/10" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                <div className="neu-surface-xs !rounded-full size-16 grid place-items-center group-hover:scale-105 transition-transform">
                  <MapPin className="size-7 text-primary" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-xl font-extrabold tracking-tight">
                    Elzada Institute of Technology
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Allalasandra, Yelahanka, Bengaluru – 560064, Karnataka, India
                  </p>
                </div>
                <a
                  href="https://maps.google.com/?q=Allalasandra+Yelahanka+Bengaluru"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="neu-btn-primary !px-5 !py-2.5 text-sm font-bold"
                >
                  Open in Google Maps
                </a>
              </div>
            </NeuCard>
          </ScrollReveal>

          <ScrollReveal preset="fade-right" delay={0.05}>
            <div className="grid sm:grid-cols-2 gap-3.5">
              {QUICK_LINKS.map((q, i) => (
                <a
                  key={q.t}
                  href={q.href}
                  className="neu-inset p-4 rounded-2xl flex items-start gap-3 h-full hover:-translate-y-0.5 transition-transform group"
                >
                  <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary/25 to-primary/10 text-primary shrink-0">
                    <q.icon className="size-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-extrabold tracking-tight group-hover:text-primary transition-colors">
                      {q.t}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{q.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </ScrollReveal>
        </div>

        <div className="lg:col-span-7">
          <ScrollReveal preset="fade-left">
            <NeuCard className="p-5 sm:p-7 md:p-8">
              <div className="flex items-start gap-3 mb-6">
                <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shrink-0">
                  <MessageSquare className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                    Submit an enquiry
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our admissions team will reach out on WhatsApp or email within 24 hours.
                  </p>
                </div>
              </div>
              <EnquiryForm compact />
            </NeuCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
