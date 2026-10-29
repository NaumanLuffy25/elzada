import type { Metadata } from "next";
import "@/styles/admin.css";
import { AdminShell } from "@/components/admin/admin-shell";

/**
 * Dedicated admin-console layout.
 *
 * `/admin` lives outside the `(public)` route group, so the website navbar,
 * footer and floating AI counsellor are never rendered here. The console has
 * its own shell (sidebar + toolbar) and its own token layer
 * (`styles/admin.css` → `.adm-shell`).
 */
export const metadata: Metadata = {
  title: {
    default: "Admin console",
    template: "%s | EIT Admin",
  },
  description: "Operations console for the Elzada AI admission counsellor.",
  // Operational tooling — keep it out of search indexes.
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
