import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Small uppercase label above the title. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Right-aligned controls (badges, buttons). */
  actions?: React.ReactNode;
  className?: string;
}

/**
 * Page heading block: eyebrow, title, description and an actions slot.
 * Shared so every admin page opens with identical rhythm and type scale.
 */
export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-adm-3 border-b border-adm-line pb-adm-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-adm-1">
        {eyebrow ? (
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-adm-accent">{eyebrow}</p>
        ) : null}
        <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-adm-fg">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-[13px] leading-relaxed text-adm-muted">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-adm-2">{actions}</div>
      ) : null}
    </header>
  );
}
