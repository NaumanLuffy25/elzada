import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Panel — the standard content container for the console.
 * One hairline border, one flat surface, minimal elevation.
 */
export function Panel({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      // min-w-0 so a Panel used as a grid/flex child can shrink below its
      // content's min-content size instead of overflowing the track (a wide
      // table would otherwise blow out the whole page).
      className={cn("min-w-0 rounded-adm border border-adm-line bg-adm-surface", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export interface PanelHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  className?: string;
}

export function PanelHeader({ title, description, icon: Icon, actions, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-adm-3 border-b border-adm-line px-adm-5 py-adm-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-adm-3">
        {Icon ? (
          <span className="grid size-8 shrink-0 place-items-center rounded-adm-sm bg-adm-accent/10 text-adm-accent">
            <Icon className="size-4" aria-hidden />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="truncate text-[13px] font-semibold text-adm-fg">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-[12px] leading-relaxed text-adm-muted">{description}</p>
          ) : null}
        </div>
      </div>

      {actions ? <div className="flex shrink-0 items-center gap-adm-2">{actions}</div> : null}
    </div>
  );
}

export function PanelBody({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-adm-5", className)} {...props}>
      {children}
    </div>
  );
}

export function PanelFooter({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-adm-3 border-t border-adm-line px-adm-5 py-adm-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * SectionAnchor — wraps a dashboard section so the sidebar can target it and
 * the sticky topbar never covers the heading when jumped to.
 */
export function SectionAnchor({
  id,
  className,
  children,
}: {
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      data-admin-section={id}
      // min-w-0: grid children default to min-width:auto, so a section holding
      // a wide table forces the track wider than the viewport on tablet.
      className={cn("min-w-0 scroll-mt-[calc(var(--adm-topbar-h)+1rem)]", className)}
    >
      {children}
    </section>
  );
}
