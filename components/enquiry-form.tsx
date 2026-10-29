"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Send, User, Phone, BookOpen, MessageSquare, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PROGRAMS = [
  "B.Tech – Computer Science",
  "B.Tech – AI & ML",
  "B.Tech – Data Science",
  "B.Tech – Electronics & Comm.",
  "B.Tech – Mechanical",
  "B.Tech – Civil",
  "M.Tech",
  "MBA",
  "BBA",
  "BCA",
  "B.Des",
  "BA LLB",
  "PhD",
  "Not sure yet",
];

type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [consent, setConsent] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    program: "",
    message: "",
  });

  const onField = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const phoneValid = (p: string) => {
    const digits = p.replace(/\D/g, "");
    return !p || (digits.length >= 10 && digits.length <= 14);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      toast.error("Please confirm the consent checkbox before submitting.");
      return;
    }
    if (!phoneValid(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    setStatus("submitting");
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Submission failed");
      setStatus("success");
      toast.success("Enquiry received", {
        description: "Our admissions team will reach out within 24 hours.",
        icon: <CheckCircle2 className="size-4 text-emerald-500" />,
      });
      setForm({ name: "", email: "", phone: "", program: "", message: "" });
      setConsent(false);
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
      setStatus("error");
      toast.error("Couldn't send enquiry", {
        description: err?.message || "Please try again later.",
      });
    }
  }

  return (
    <div className={cn("neu-surface p-5 sm:p-7 space-y-5 relative overflow-hidden", compact && "!p-4 sm:!p-5")}>
      {/* decorative halos */}
      <div className="absolute -top-20 -right-20 size-64 rounded-full bg-primary/14 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <div className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary shrink-0">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
              Talk to Admissions
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              We usually respond within 24 hours on working days.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="neu-inset p-5 sm:p-6 rounded-2xl border border-emerald-500/25"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="size-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground">Thank you — we have received your enquiry.</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Our admissions team will reach out to your phone or email within 24 hours.
                    In the meantime, feel free to ask Elzada AI any quick questions you may have.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatus("idle")}
                      className="neu-btn !px-4 !py-2 text-xs font-semibold"
                    >
                      Submit another enquiry
                    </button>
                    <a
                      href="#ask-ai"
                      className="neu-btn-primary !px-4 !py-2 text-xs font-semibold inline-flex"
                    >
                      Chat with Elzada AI
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={onSubmit}
              className="grid gap-3.5 sm:gap-4"
            >
              <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                <Field label="Full name" icon={User} required>
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={80}
                    autoComplete="name"
                    value={form.name}
                    onChange={onField}
                    className="neu-input"
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={onField}
                    className="neu-input"
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-2 gap-3.5 sm:gap-4">
                <Field label="Phone Number" icon={Phone} required>
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel-national"
                    pattern="[0-9+\-\s]{10,15}"
                    value={form.phone}
                    onChange={onField}
                    className={cn("neu-input", !phoneValid(form.phone) && form.phone && "ring-2 ring-red-500/50")}
                    placeholder="+91 98765 43210"
                  />
                </Field>
                <Field label="Interested Course" icon={BookOpen} required>
                  <select
                    name="program"
                    required
                    value={form.program}
                    onChange={onField}
                    className="neu-input appearance-none pr-9 cursor-pointer"
                  >
                    <option value="">Select a program…</option>
                    {PROGRAMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Your message" icon={MessageSquare} required>
                <textarea
                  name="message"
                  required
                  rows={4}
                  minLength={10}
                  maxLength={1000}
                  value={form.message}
                  onChange={onField}
                  className="neu-input resize-none !py-3 min-h-[110px]"
                  placeholder="Tell us about your goals, 12th marks, and what you'd like to know…"
                />
              </Field>

              <label className="flex items-start gap-3 select-none cursor-pointer group">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="neu-pressed size-5 rounded-md grid place-items-center transition-all peer-checked:bg-gradient-to-br peer-checked:from-primary peer-checked:to-elzada-700">
                    {consent && <CheckCircle2 className="size-4 text-white" />}
                  </div>
                </div>
                <span className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  I agree to Elzada Institute of Technology storing the details I have provided
                  above to contact me regarding my enquiry. I confirm I am 16+ and have read the{" "}
                  <a href="/about" className="text-primary underline underline-offset-2">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 p-3 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary" />
                  Your details are secure and never shared.
                </div>
                <button
                  disabled={status === "submitting" || !consent}
                  type="submit"
                  className="neu-btn-primary !px-6 !py-3 text-sm font-bold inline-flex w-full sm:w-auto justify-center"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send enquiry
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-foreground/85 mb-1.5 flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5 text-primary/80" />}
        {label}
        {required && <span className="text-destructive">*</span>}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
