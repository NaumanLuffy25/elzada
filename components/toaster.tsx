"use client";

import { Toaster as Sonner } from "sonner";
import { useTheme } from "next-themes";

export function Toaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Sonner
      theme={(resolvedTheme as "light" | "dark") ?? "system"}
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "neu-surface-sm !bg-card !text-foreground !border-border/60 rounded-xl !shadow-none",
          title: "!text-foreground !text-sm !font-medium",
          description: "!text-muted-foreground !text-xs",
          closeButton:
            "!bg-background !text-muted-foreground hover:!text-foreground !rounded-md",
          actionButton:
            "!bg-primary !text-primary-foreground hover:!opacity-95 !rounded-md !px-3 !py-1.5",
          cancelButton:
            "!bg-muted !text-muted-foreground hover:!bg-muted-foreground/10 !rounded-md !px-3 !py-1.5",
        },
      }}
      richColors
      closeButton
      expand
    />
  );
}
