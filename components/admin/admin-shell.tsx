"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { ADMIN_NAV } from "./nav-config";
import type { Crumb } from "./breadcrumbs";

const COLLAPSE_KEY = "elzada_admin_sidebar";

/**
 * The admin application shell.
 *
 * Owns the three pieces of shell state that every admin page needs:
 *  - `collapsed`  desktop rail width, persisted across visits
 *  - `mobileOpen` off-canvas drawer (below `lg`)
 *  - `activeId`   which dashboard section is currently in view
 *
 * It replaces the public navbar/footer entirely: this component is the root of
 * `app/admin/`, which sits outside the `(public)` route group.
 */
export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(() => ADMIN_NAV[0].id);

  const restoreFocusRef = React.useRef<HTMLElement | null>(null);

  /* --- Persisted collapse state ------------------------------------------ */
  React.useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "collapsed");
    } catch {
      /* localStorage unavailable — keep the default expanded rail */
    }
  }, []);

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      try {
        window.localStorage.setItem(COLLAPSE_KEY, next ? "collapsed" : "expanded");
      } catch {
        /* ignore write failures */
      }
      return next;
    });
  }, []);

  /* --- Drawer: open/close helpers, scroll lock, Escape ------------------- */
  const openMobile = React.useCallback(() => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setMobileOpen(true);
  }, []);

  const closeMobile = React.useCallback(() => {
    setMobileOpen(false);
    restoreFocusRef.current?.focus?.();
    restoreFocusRef.current = null;
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, closeMobile]);

  // Never leave the drawer open across a navigation.
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* --- Track which section is in view ------------------------------------ */
  React.useEffect(() => {
    const sections = ADMIN_NAV.map((item) => document.getElementById(item.id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        const ranked = Array.from(ratios.entries()).sort((a, b) => b[1] - a[1]);
        const next = ranked[0]?.[0];
        if (next) setActiveId(next);
      },
      // Discount the sticky toolbar and the bottom half of the viewport so the
      // "active" section is the one being read, not merely touching an edge.
      { rootMargin: "-88px 0px -55% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const selectSection = React.useCallback(
    (id: string) => {
      setActiveId(id);
      closeMobile();
    },
    [closeMobile],
  );

  const activeItem = ADMIN_NAV.find((item) => item.id === activeId) ?? ADMIN_NAV[0];
  const breadcrumbs: Crumb[] = [{ label: "Admin", href: "/admin" }, { label: activeItem.label }];

  return (
    <div
      data-collapsed={collapsed}
      className="adm-shell min-h-screen bg-adm-bg font-adm-sans text-adm-fg"
    >
      <a
        href="#admin-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-adm-4 focus:top-adm-4 focus:z-[70] focus:rounded-adm-sm focus:bg-adm-accent focus:px-adm-3 focus:py-adm-2 focus:text-[13px] focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        activeId={activeId}
        onSelect={selectSection}
        onClose={closeMobile}
      />

      <div className="transition-[padding-left] duration-adm ease-adm lg:pl-[var(--adm-sidebar-w)]">
        <AdminTopbar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapsed={toggleCollapsed}
          onOpenMobile={openMobile}
          breadcrumbs={breadcrumbs}
        />

        <main id="admin-content" className="mx-auto w-full max-w-[1440px] px-adm-4 py-adm-6 sm:px-adm-6">
          {children}
        </main>
      </div>
    </div>
  );
}
