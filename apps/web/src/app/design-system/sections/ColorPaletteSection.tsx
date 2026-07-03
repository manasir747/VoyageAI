import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";

export function ColorPaletteSection() {
  return (
    <section id="color-palette" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Color Palette</h2>
        <p className="text-muted-foreground">
          The semantic color tokens used for backgrounds, text, and borders.
        </p>
      </div>

      <ComponentPreview
        name="Semantic Colors"
        description="Primary, secondary, and accent colors mapped to CSS variables."
        previewClassName="bg-background"
      >
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          <ColorSwatch
            name="Background"
            className="bg-background border-border text-foreground"
            value="var(--background)"
          />
          <ColorSwatch
            name="Foreground"
            className="bg-foreground text-background"
            value="var(--foreground)"
          />
          <ColorSwatch
            name="Primary"
            className="bg-primary text-primary-foreground"
            value="var(--primary)"
          />
          <ColorSwatch
            name="Secondary"
            className="bg-secondary text-secondary-foreground"
            value="var(--secondary)"
          />
          <ColorSwatch
            name="Muted"
            className="bg-muted text-muted-foreground"
            value="var(--muted)"
          />
          <ColorSwatch
            name="Accent"
            className="bg-accent text-accent-foreground"
            value="var(--accent)"
          />
          <ColorSwatch
            name="Destructive"
            className="bg-destructive text-destructive-foreground"
            value="var(--destructive)"
          />
          <ColorSwatch name="Border" className="bg-border text-foreground" value="var(--border)" />
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Status Colors"
        description="Colors used for feedback, success, and warnings."
        previewClassName="bg-background"
      >
        <div className="flex w-full flex-wrap gap-4">
          {/* Note: Assuming these variables or standard tailwind colors exist, falling back to standard if not explicitly defined in theme */}
          <ColorSwatch
            name="Success"
            className="border border-green-500/50 bg-green-500/20 text-green-500"
            value="Success State"
          />
          <ColorSwatch
            name="Warning"
            className="border border-yellow-500/50 bg-yellow-500/20 text-yellow-500"
            value="Warning State"
          />
          <ColorSwatch
            name="Error"
            className="border border-red-500/50 bg-red-500/20 text-red-500"
            value="Error State"
          />
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Glass & Effects"
        description="Semi-transparent backgrounds for depth."
        previewClassName="bg-gradient-to-br from-primary/20 to-accent/20"
      >
        <div className="flex w-full flex-wrap justify-center gap-4">
          <div className="bg-background/50 border-border/50 shadow-glass flex h-32 w-32 flex-col items-center justify-center rounded-2xl border backdrop-blur-md">
            <span className="font-semibold">Glass Light</span>
          </div>
          <div className="bg-foreground/10 border-border/30 shadow-glass flex h-32 w-32 flex-col items-center justify-center rounded-2xl border backdrop-blur-lg">
            <span className="text-foreground font-semibold">Glass Dark</span>
          </div>
        </div>
      </ComponentPreview>
    </section>
  );
}

function ColorSwatch({
  name,
  className,
  value,
}: {
  name: string;
  className: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`flex h-24 w-full items-end rounded-2xl border p-3 shadow-sm ${className}`}>
        <span className="text-xs font-medium opacity-80">{value}</span>
      </div>
      <span className="pl-1 text-sm font-semibold">{name}</span>
    </div>
  );
}
