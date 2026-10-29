"use client";

import * as React from "react";
import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, IconButton } from "./ui";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/** Same key the admin modules use to read the shared dashboard token. */
const TOKEN_KEY = "elzada_admin_token";

export interface AdminTopbarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onOpenMobile: () => void;
  breadcrumbs: Crumb[];
}

/**
 * Compact admin toolbar: sidebar controls, breadcrumb trail and global
 * actions. Sticky so the trail and controls stay reachable while scanning
 * long data tables.
 */
export function AdminTopbar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onOpenMobile,
  breadcrumbs,
}: AdminTopbarProps) {
  return (
    <header
      data-admin-chrome
      className={cn(
        "sticky top-0 z-30 flex h-[var(--adm-topbar-h)] items-center gap-adm-2",
        "border-b border-adm-line bg-adm-bg/90 px-adm-3 backdrop-blur",
        "sm:px-adm-4",
      )}
    >
      <IconButton
        label="Open navigation"
        className="lg:hidden"
        onClick={onOpenMobile}
        aria-expanded={mobileOpen}
        aria-controls="admin-sidebar"
      >
        <Menu className="size-4" aria-hidden />
      </IconButton>

      <IconButton
        label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="hidden lg:inline-flex"
        onClick={onToggleCollapsed}
        aria-pressed={collapsed}
        aria-controls="admin-sidebar"
      >
        {collapsed ? (
          <PanelLeftOpen className="size-4" aria-hidden />
        ) : (
          <PanelLeftClose className="size-4" aria-hidden />
        )}
      </IconButton>

      <Breadcrumbs items={breadcrumbs} className="hidden min-w-0 sm:block" />

      <div className="ml-auto flex shrink-0 items-center gap-adm-2">
        <DataModeBadge />
      </div>
    </header>
  );
}

/**
 * Reflects the REAL connection state of the dashboard. A token merely being
 * present in `localStorage` is not enough — this performs a lightweight request
 * to `/api/admin` so the toolbar can show Connected / Token rejected / Error
 * instead of asserting "Live data" for a token the server refuses.
 */
function DataModeBadge() {
  const [state, setState] = React.useState<
    "reading" | "no-token" | "checking" | "connected" | "rejected" | "error"
  >("reading");

  React.useEffect(() => {
    let cancelled = false;

    const check = async () => {
      let token = "";
      try {
        token = window.localStorage.getItem(TOKEN_KEY) ?? "";
      } catch {
        token = "";
      }
      if (!token) {
        if (!cancelled) setState("no-token");
        return;
      }
      if (!cancelled) setState("checking");
      try {
        const res = await fetch("/api/admin?range=24h", {
          headers: { "x-admin-token": token },
          cache: "no-store",
        });
        if (cancelled) return;
        if (res.status === 401) setState("rejected");
        else if (res.ok) setState("connected");
        else setState("error");
      } catch {
        if (!cancelled) setState("error");
      }
    };

    void check();
    const onFocus = () => void check();
    window.addEventListener("focus", onFocus);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Render nothing until we have read the client-only value (avoids hydration mismatch).
  if (state === "reading") return null;

  const MAP = {
    "no-token": { tone: "warning", label: "Demo data" },
    checking: { tone: "info", label: "Checking…" },
    connected: { tone: "success", label: "Live data" },
    rejected: { tone: "danger", label: "Token rejected" },
    error: { tone: "danger", label: "Connection error" },
  } as const;

  const { tone, label } = MAP[state];
  return (
    <Badge tone={tone} dot className="hidden sm:inline-flex">
      {label}
    </Badge>
  );
}
