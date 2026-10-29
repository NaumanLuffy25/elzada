"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full rounded-adm-sm border border-adm-line bg-adm-bg-soft text-adm-fg",
  "placeholder:text-adm-subtle",
  "transition-colors duration-adm ease-adm",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "aria-[invalid=true]:border-adm-danger/60",
].join(" ");

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn(fieldBase, "h-9 px-adm-3 text-[13px]", className)} {...props} />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-20 resize-y px-adm-3 py-adm-2 text-[13px]", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, children, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(fieldBase, "h-9 pr-adm-8 pl-adm-3 text-[13px]", className)}
      {...props}
    >
      {children}
    </select>
  );
});

export interface FieldProps {
  /** Visible label. Also becomes the accessible name of the control. */
  label?: string;
  /** Helper text shown when there is no error. */
  hint?: string;
  /** Error message; also marks the control invalid via `aria-describedby`. */
  error?: string;
  /** `id` of the control this field labels. */
  htmlFor?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Label + control + hint/error. Presentational wrapper only — it does not
 * clone the control, so pair it with `id` / `aria-describedby` via `htmlFor`
 * and the control's own props.
 */
export function Field({
  label,
  hint,
  error,
  htmlFor,
  required,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn("space-y-adm-1", className)}>
      {label ? (
        <label
          htmlFor={htmlFor}
          className="block text-[11px] font-medium uppercase tracking-[0.14em] text-adm-muted"
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-adm-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
      ) : null}

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} className="text-[11px] text-adm-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-[11px] text-adm-subtle">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Inline search input with a leading icon, as used in admin data tables. */
export const SearchInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { wrapperClassName?: string }
>(function SearchInput({ className, wrapperClassName, ...props }, ref) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="pointer-events-none absolute left-adm-3 top-1/2 size-3.5 -translate-y-1/2 text-adm-subtle"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        ref={ref}
        type="search"
        className={cn(fieldBase, "h-9 pl-adm-8 pr-adm-3 text-[13px]", className)}
        {...props}
      />
    </div>
  );
});
