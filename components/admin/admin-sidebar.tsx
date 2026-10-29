"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ADMIN_NAV, ADMIN_NAV_GROUPS, adminNavHref } from "./nav-config";

export interface AdminSidebarProps {
  /** Desktop rail collapsed to icons only. */
  collapsed: boolean;
  /** Mobile drawer open. Ignored at `lg` and above. */
  mobileOpen: boolean;
  /** Section id currently in view. */
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function AdminSidebar({
  collapsed,
  mobileOpen,
  activeId,
  onSelect,
  onClose,
}: AdminSidebarProps) {
  const asideRef = React.useRef<HTMLElement>(null);

  // Move focus into the drawer when it opens on small screens so keyboard
  // users land inside the navigation rather than behind it.
  React.useEffect(() => {
    if (!mobileOpen) return;
    asideRef.current?.querySelector<HTMLElement>("a, button")?.focus();
  }, [mobileOpen]);

  return (
    <>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            key="admin-sidebar-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={onClose}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <aside
        id="admin-sidebar"
        ref={asideRef}
        aria-label="Admin sections"
        data-admin-chrome
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[var(--adm-sidebar-w)] flex-col",
          "border-r border-adm-line bg-adm-bg-soft",
          "transition-[transform,width] duration-adm ease-adm",
          "lg:translate-x-0 lg:visible lg:shadow-none",
          // Closed on mobile: move off-canvas *and* out of the tab order.
          mobileOpen ? "visible translate-x-0 shadow-adm" : "invisible -translate-x-full",
        )}
      >
        {/* Brand — height matches the toolbar so the two horizontals align. */}
        <div className="flex h-[var(--adm-topbar-h)] shrink-0 items-center gap-adm-3 border-b border-adm-line px-adm-4">
          <span className="grid size-8 shrink-0 place-items-center rounded-adm-sm bg-adm-accent/10 text-adm-accent">
            <GraduationCap className="size-4" aria-hidden />
          </span>
          <span className={cn("min-w-0 leading-tight", collapsed && "hidden")}>
            <span className="block truncate text-[13px] font-semibold text-adm-fg">Elzada</span>
            <span className="block truncate text-[10px] uppercase tracking-[0.16em] text-adm-subtle">
              Admission OS
            </span>
          </span>
        </div>

        <nav aria-label="Admin sections" className="flex-1 overflow-y-auto px-adm-3 py-adm-4">
          {ADMIN_NAV_GROUPS.map((group) => {
            const items = ADMIN_NAV.filter((item) => item.group === group);
            if (items.length === 0) return null;

            return (
              <div key={group} className="mb-adm-4 last:mb-0">
                <p
                  className={cn(
                    "px-adm-3 text-[10px] font-medium uppercase tracking-[0.16em] text-adm-subtle",
                    collapsed && "sr-only",
                  )}
                >
                  {group}
                </p>

                <ul className="mt-adm-2 space-y-0.5">
                  {items.map((item) => {
                    const active = item.id === activeId;
                    return (
                      <li key={item.id}>
                        <Link
                          href={adminNavHref(item.id)}
                          onClick={() => onSelect(item.id)}
                          aria-current={active ? "location" : undefined}
                          title={collapsed ? `${item.label} — ${item.description}` : item.description}
                          className={cn(
                            "group relative flex items-center gap-adm-3 rounded-adm-sm py-adm-2 text-[13px] font-medium",
                            "transition-colors duration-adm ease-adm",
                            collapsed ? "justify-center px-adm-2" : "px-adm-3",
                            active
                              ? "bg-adm-accent/10 text-adm-fg"
                              : "text-adm-muted hover:bg-adm-surface-2 hover:text-adm-fg",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn(
                              "absolute inset-y-adm-1 left-0 w-0.5 rounded-full bg-adm-accent transition-opacity duration-adm ease-adm",
                              active ? "opacity-100" : "opacity-0",
                            )}
                          />
                          <item.icon
                            className={cn(
                              "size-4 shrink-0 transition-colors duration-adm",
                              active ? "text-adm-accent" : "text-adm-subtle group-hover:text-adm-muted",
                            )}
                            aria-hidden
                          />
                          <span className={cn("truncate", collapsed && "sr-only")}>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-adm-line p-adm-3">
          <Link
            href="/"
            title={collapsed ? "View public site" : undefined}
            className={cn(
              "flex items-center gap-adm-3 rounded-adm-sm py-adm-2 text-[12px] font-medium text-adm-muted",
              "transition-colors duration-adm ease-adm hover:bg-adm-surface-2 hover:text-adm-fg",
              collapsed ? "justify-center px-adm-2" : "px-adm-3",
            )}
          >
            <ExternalLink className="size-3.5 shrink-0" aria-hidden />
            <span className={cn(collapsed && "sr-only")}>View public site</span>
          </Link>

          <p className={cn("px-adm-3 pt-adm-2 text-[10px] text-adm-subtle", collapsed && "hidden")}>
            Admission OS · v1.0
          </p>
        </div>
      </aside>
    </>
  );
}
