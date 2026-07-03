import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";

export function SpacingSection() {
  return (
    <section id="spacing" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Spacing & Structure</h2>
        <p className="text-muted-foreground">Standardized spacing, border radius, and shadows.</p>
      </div>

      <ComponentPreview name="Radius Scale" description="Corner rounding standard values.">
        <div className="flex w-full flex-wrap items-end justify-center gap-6">
          <RadiusBox name="sm" className="rounded-sm" />
          <RadiusBox name="md" className="rounded-md" />
          <RadiusBox name="lg" className="rounded-lg" />
          <RadiusBox name="xl" className="rounded-xl" />
          <RadiusBox name="2xl" className="rounded-2xl" />
          <RadiusBox name="3xl" className="rounded-3xl" />
          <RadiusBox name="full" className="h-20 w-20 rounded-full" />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Shadow Scale" description="Elevation and depth tokens.">
        <div className="flex w-full flex-wrap items-center justify-center gap-8">
          <div className="bg-background flex h-24 w-24 items-center justify-center rounded-2xl border text-sm font-medium shadow-sm">
            sm
          </div>
          <div className="bg-background flex h-24 w-24 items-center justify-center rounded-2xl border text-sm font-medium shadow-md">
            md
          </div>
          <div className="bg-background flex h-24 w-24 items-center justify-center rounded-2xl border text-sm font-medium shadow-lg">
            lg
          </div>
          <div className="bg-background shadow-soft flex h-24 w-24 items-center justify-center rounded-2xl border text-sm font-medium">
            soft
          </div>
          <div className="bg-background shadow-strong flex h-24 w-24 items-center justify-center rounded-2xl border text-sm font-medium">
            strong
          </div>
        </div>
      </ComponentPreview>
    </section>
  );
}

function RadiusBox({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`bg-primary/20 border-primary/50 h-16 w-20 border ${className}`} />
      <span className="text-muted-foreground font-mono text-xs">{name}</span>
    </div>
  );
}
