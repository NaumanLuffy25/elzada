import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Crumb = {
  label: string;
  href?: string;
};

/**
 * Compact breadcrumb trail for the admin toolbar.
 * The final crumb is the current location and is marked `aria-current`.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex min-w-0 items-center gap-adm-1 text-[12px]">
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-adm-1">
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="truncate rounded-adm-xs px-adm-1 py-0.5 text-adm-muted transition-colors duration-adm hover:text-adm-fg"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn("truncate px-adm-1 py-0.5", isLast ? "text-adm-fg" : "text-adm-muted")}
                >
                  {crumb.label}
                </span>
              )}

              {!isLast ? (
                <ChevronRight className="size-3 shrink-0 text-adm-subtle/70" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
