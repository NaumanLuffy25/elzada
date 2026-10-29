import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  Cpu,
  Database,
  LayoutDashboard,
  Mail,
  MessagesSquare,
  ServerCog,
} from "lucide-react";

/**
 * Single source of truth for the admin sidebar.
 *
 * The console currently exposes one route (`/admin`), so each entry targets a
 * section *anchor* on that page instead of inventing routes that do not exist
 * yet. When the dashboard is split into real sub-routes later, only `href`
 * needs to change — active/collapsed/mobile behaviour is driven by `id`.
 */
export type AdminNavItem = {
  /** Must match the section element id on the admin page. */
  id: string;
  label: string;
  group: AdminNavGroup;
  icon: LucideIcon;
  /** Used for tooltips and assistive text. */
  description: string;
};

export type AdminNavGroup = "Monitor" | "Operations" | "Intelligence";

export const ADMIN_NAV_GROUPS: AdminNavGroup[] = ["Monitor", "Operations", "Intelligence"];

export const ADMIN_NAV: AdminNavItem[] = [
  {
    id: "intent-model",
    label: "Intent model",
    group: "Monitor",
    icon: Cpu,
    description: "Classifier metric cards and measured evaluation",
  },
  {
    id: "overview",
    label: "Overview",
    group: "Monitor",
    icon: LayoutDashboard,
    description: "Headline KPIs, volume and recent activity",
  },
  {
    id: "analytics",
    label: "Analytics",
    group: "Monitor",
    icon: BarChart3,
    description: "Conversation and enquiry trends, intent mix",
  },
  {
    id: "enquiries",
    label: "Enquiries",
    group: "Operations",
    icon: Mail,
    description: "Inbound enquiry inbox",
  },
  {
    id: "conversations",
    label: "Conversations",
    group: "Operations",
    icon: MessagesSquare,
    description: "Counsellor chat transcript log",
  },
  {
    id: "knowledge-base",
    label: "Knowledge base",
    group: "Operations",
    icon: Database,
    description: "Retrieval corpus and chunk browser",
  },
  {
    id: "rag-health",
    label: "RAG health",
    group: "Intelligence",
    icon: Activity,
    description: "Retrieval quality and latency (separate from the classifier)",
  },
  {
    id: "system-health",
    label: "System health",
    group: "Intelligence",
    icon: ServerCog,
    description: "Supabase, embeddings and provider status",
  },
];

export function getAdminNavItem(id: string): AdminNavItem | undefined {
  return ADMIN_NAV.find((item) => item.id === id);
}

export function adminNavHref(id: string): string {
  return `/admin#${id}`;
}
