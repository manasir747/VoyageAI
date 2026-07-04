"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Laptop, MoonStar, SunMedium } from "lucide-react";
import { useTheme, type ThemeMode } from "@/theme/theme-provider";
import { cn } from "@/lib/utils";

const options: Array<{ value: ThemeMode; label: string; icon: typeof SunMedium }> = [
  { value: "light", label: "Light", icon: SunMedium },
  { value: "dark", label: "Dark", icon: MoonStar },
  { value: "system", label: "System", icon: Laptop },
];

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "rounded-pill border-border/60 bg-glass/80 shadow-glass inline-flex items-center border p-1 text-sm backdrop-blur-xl",
        className,
      )}
      role="tablist"
      aria-label="Theme switcher"
    >
      {options.map((option) => {
        const Icon = option.icon;
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setTheme(option.value)}
            className={cn(
              "rounded-pill relative isolate flex cursor-pointer items-center gap-2 px-3 py-2 text-xs font-medium transition-all duration-300",
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
            )}
          >
            {active ? (
              <motion.span
                layoutId="voyageai-theme-toggle-pill"
                className="rounded-pill bg-background shadow-medium border-border/40 absolute inset-0 -z-10 border"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            ) : null}
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={option.value}
                initial={{ opacity: 0, scale: 0.88, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: -2 }}
                transition={{ duration: 0.18 }}
                className="inline-flex items-center gap-2"
              >
                <Icon className="size-3.5" aria-hidden="true" />
                <span>{option.label}</span>
              </motion.span>
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
