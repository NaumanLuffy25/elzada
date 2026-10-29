"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Admin button.
 *
 * Variants:
 *  - primary    single, high-intent action per region
 *  - secondary  default — bordered, low emphasis
 *  - outline    bordered, no fill
 *  - ghost      toolbar / icon actions
 *  - danger     destructive
 *  - link       inline text action
 *
 * Focus is handled by the shared admin focus ring (`styles/admin.css`), so no
 * per-component ring utilities are needed.
 */
export const buttonVariants = cva(
  [
    "inline-flex select-none items-center justify-center gap-adm-2 whitespace-nowrap",
    "rounded-adm-sm font-medium leading-none",
    "transition-colors duration-adm ease-adm",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: "bg-adm-accent text-white hover:bg-adm-accent-hover",
        secondary:
          "border border-adm-line bg-adm-surface-2 text-adm-fg hover:border-adm-line-strong hover:bg-adm-surface-3",
        outline:
          "border border-adm-line text-adm-fg hover:border-adm-line-strong hover:bg-adm-surface-2",
        ghost: "text-adm-muted hover:bg-adm-surface-2 hover:text-adm-fg",
        danger:
          "border border-adm-danger/35 bg-adm-danger/10 text-adm-danger hover:bg-adm-danger/20",
        link: "h-auto px-0 text-adm-accent underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-adm-3 text-[12px]",
        md: "h-9 px-adm-3 text-[13px]",
        lg: "h-10 px-adm-4 text-[13px]",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: { variant: "secondary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Swaps the label for a spinner and disables interaction. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, loading = false, disabled, children, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden />
        ) : null}
        {children}
      </button>
    );
  },
);

/**
 * Icon-only button. Requires an accessible label because it has no text.
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, "children"> & { label: string; children: React.ReactNode }
>(function IconButton({ label, className, variant = "ghost", size = "icon-sm", ...props }, ref) {
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      aria-label={label}
      title={label}
      className={className}
      {...props}
    />
  );
});
