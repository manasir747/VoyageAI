import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";

export function TypographySection() {
  return (
    <section id="typography" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Typography</h2>
        <p className="text-muted-foreground">
          The typographic scale and text utilities used across the application.
        </p>
      </div>

      <ComponentPreview
        name="Headings & Display"
        description="Core heading styles from display down to h4."
        usageGuidelines={[
          "Use Display for landing page heroes.",
          "Use H1 for page titles.",
          "Use H2-H4 for section structures.",
        ]}
        previewClassName="items-start"
      >
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-5xl .font-extrabold .tracking-tight (Display)
            </span>
            <div className="text-5xl font-extrabold tracking-tight">Discover the World</div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-4xl .font-bold .tracking-tight (H1)
            </span>
            <h1 className="text-4xl font-bold tracking-tight">Your Next Adventure</h1>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-3xl .font-semibold .tracking-tight (H2)
            </span>
            <h2 className="text-3xl font-semibold tracking-tight">Popular Destinations</h2>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-2xl .font-semibold .tracking-tight (H3)
            </span>
            <h3 className="text-2xl font-semibold tracking-tight">Trip Details</h3>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-xl .font-semibold .tracking-tight (H4)
            </span>
            <h4 className="text-xl font-semibold tracking-tight">Flight Information</h4>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Body & Utilities"
        description="Standard body text, captions, labels, and monospace."
        previewClassName="items-start"
      >
        <div className="flex w-full max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-lg .text-muted-foreground (Lead)
            </span>
            <p className="text-muted-foreground text-lg">
              VoyageAI helps you plan your next perfect trip with intelligent recommendations.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">.text-base (Body)</span>
            <p className="text-base">
              This is standard body text. It is used for long-form content, paragraphs, and general
              descriptions across the interface.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-sm .font-medium (Label)
            </span>
            <label className="text-sm font-medium">Email Address</label>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-sm .text-muted-foreground (Caption)
            </span>
            <p className="text-muted-foreground text-sm">
              This is caption text used for secondary information or helper text.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground font-mono text-xs">
              .text-sm .font-mono (Monospace)
            </span>
            <p className="bg-muted/40 w-fit rounded-md px-1 py-0.5 font-mono text-sm">
              console.log(&quot;Hello World&quot;)
            </p>
          </div>
        </div>
      </ComponentPreview>
    </section>
  );
}
