import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Composable table primitives.
 *
 * Thin 1px borders, a quiet header row and generous row padding. Horizontal
 * overflow is contained by `TableWrap` so narrow viewports scroll the table
 * instead of the page.
 */
export function TableWrap({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-adm border border-adm-line bg-adm-surface",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Table({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full border-collapse text-left text-[13px]", className)} {...props}>
      {children}
    </table>
  );
}

export function THead({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-adm-bg-soft", className)} {...props}>
      {children}
    </thead>
  );
}

export function TBody({ className, children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-adm-line", className)} {...props}>
      {children}
    </tbody>
  );
}

export function TR({ className, children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("transition-colors duration-adm ease-adm hover:bg-adm-surface-2/60", className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TH({ className, children, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-adm-line px-adm-4 py-adm-3 text-[11px] font-medium uppercase tracking-[0.12em] text-adm-subtle",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function TD({ className, children, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-adm-4 py-adm-3 align-top text-adm-fg/90", className)} {...props}>
      {children}
    </td>
  );
}

/** Full-width centred cell for empty / loading states. */
export function TDCell({ colSpan, className, children }: { colSpan: number; className?: string; children: React.ReactNode }) {
  return (
    <td colSpan={colSpan} className={cn("px-adm-4 py-adm-8 text-center text-[12px] text-adm-muted", className)}>
      {children}
    </td>
  );
}
