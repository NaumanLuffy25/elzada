import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, CheckCircle2, Inbox, Info, Loader2, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-adm-sm bg-adm-surface-2", className)} />;
}

/** Required wrapper so assistive tech announces busy regions. */
export function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center justify-center gap-adm-2 px-adm-5 py-adm-8 text-[12px] text-adm-muted", className)}
    >
      <Loader2 className="size-4 animate-spin text-adm-subtle" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty / error                                                              */
/* -------------------------------------------------------------------------- */

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-adm-2 px-adm-6 py-adm-8 text-center",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-full border border-adm-line bg-adm-surface-2 text-adm-subtle">
        <Icon className="size-4" aria-hidden />
      </span>
      <p className="text-[13px] font-medium text-adm-fg">{title}</p>
      {description ? (
        <p className="max-w-sm text-[12px] leading-relaxed text-adm-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-adm-1">{action}</div> : null}
    </div>
  );
}

export interface ErrorStateProps extends Omit<EmptyStateProps, "icon" | "action"> {
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  retryLabel = "Try again",
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-adm-2 rounded-adm border border-adm-danger/25 bg-adm-danger/5 px-adm-6 py-adm-8 text-center",
        className,
      )}
    >
      <span className="grid size-10 place-items-center rounded-full bg-adm-danger/10 text-adm-danger">
        <XCircle className="size-4" aria-hidden />
      </span>
      <p className="text-[13px] font-medium text-adm-fg">{title}</p>
      {description ? (
        <p className="max-w-sm text-[12px] leading-relaxed text-adm-muted">{description}</p>
      ) : null}
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-adm-1">
          <RotateCcw className="size-3.5" aria-hidden />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Inline alert                                                               */
/* -------------------------------------------------------------------------- */

const ALERT: Record<
  NonNullable<AlertProps["tone"]>,
  { wrap: string; icon: string; Icon: LucideIcon }
> = {
  info: { wrap: "border-adm-info/25 bg-adm-info/5", icon: "text-adm-info", Icon: Info },
  success: { wrap: "border-adm-ok/25 bg-adm-ok/5", icon: "text-adm-ok", Icon: CheckCircle2 },
  warning: { wrap: "border-adm-warn/25 bg-adm-warn/5", icon: "text-adm-warn", Icon: AlertTriangle },
  danger: { wrap: "border-adm-danger/25 bg-adm-danger/5", icon: "text-adm-danger", Icon: XCircle },
};

export interface AlertProps {
  tone?: "info" | "success" | "warning" | "danger";
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function Alert({ tone = "info", title, children, className }: AlertProps) {
  const { wrap, icon, Icon } = ALERT[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex items-start gap-adm-3 rounded-adm border px-adm-4 py-adm-3", wrap, className)}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", icon)} aria-hidden />
      <div className="min-w-0 space-y-0.5">
        {title ? <p className="text-[12px] font-medium text-adm-fg">{title}</p> : null}
        {children ? (
          <div className="text-[12px] leading-relaxed text-adm-muted">{children}</div>
        ) : null}
      </div>
    </div>
  );
}
