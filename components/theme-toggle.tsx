"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light mode" },
  { value: "system", icon: Monitor, label: "System" },
  { value: "dark", icon: Moon, label: "Dark mode" },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const current: Theme = (theme as Theme) || "system";
  const display = !mounted ? "light" : current === "system" ? resolvedTheme ?? "light" : current;

  const cycle = () => {
    const order: Theme[] = ["light", "dark", "system"];
    const idx = order.indexOf(current);
    setTheme(order[(idx + 1) % order.length]);
  };

  const ActiveIcon = !mounted ? Sun : OPTIONS.find((o) => o.value === current)?.icon ?? Sun;

  return (
    <div className={cn("flex items-center", className)}>
      <div
        role="group"
        aria-label="Theme switcher"
        className="neu-surface-xs p-0.5 flex items-center gap-0.5"
      >
        {OPTIONS.map(({ value, icon: Icon, label }) => {
          const active = mounted && current === value;
          return (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={active}
              onClick={() => setTheme(value)}
              className={cn(
                "relative p-1.5 rounded-md transition-all duration-200",
                active
                  ? "neu-pressed text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title={label}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </div>
      {/* Single clickable version retained for small / dropdown contexts */}
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={cycle}
        className="hidden"
      >
        <ActiveIcon className="size-4" />
        <span className="sr-only">{display} theme</span>
      </button>
    </div>
  );
}
