import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import { ThemeToggle } from "@/theme/theme-toggle";

export function ThemeSection() {
  return (
    <section id="theme" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Theme</h2>
        <p className="text-muted-foreground">
          Dark mode, light mode, and system preference support.
        </p>
      </div>

      <ComponentPreview
        name="Theme Switcher"
        description="Component to toggle between light, dark, and system themes."
      >
        <div className="bg-card shadow-soft flex items-center justify-center rounded-2xl border p-8">
          <ThemeToggle />
        </div>
      </ComponentPreview>
    </section>
  );
}
