import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import { Button } from "@/components/ui/button";

export function AccessibilitySection() {
  return (
    <section id="accessibility" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Accessibility</h2>
        <p className="text-muted-foreground">
          Guidelines and examples for building inclusive interfaces.
        </p>
      </div>

      <ComponentPreview
        name="Focus Indicators"
        description="Clear visual feedback when elements receive keyboard focus."
      >
        <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
          <p className="text-muted-foreground mb-4 text-sm">
            Press{" "}
            <kbd className="bg-muted text-foreground rounded-md px-2 py-1 font-mono text-xs">
              Tab
            </kbd>{" "}
            to see focus rings.
          </p>
          <div className="flex justify-center gap-4">
            <Button>Focus Me</Button>
            <Button variant="outline">Or Me</Button>
            <a
              href="#"
              className="text-primary focus-visible:ring-ring focus-visible:ring-offset-background rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Link Focus
            </a>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Screen Reader Only"
        description="Content hidden visually but available to assistive technologies."
      >
        <div className="border-border/70 bg-card shadow-soft flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border p-6 text-center">
          <p className="text-sm">There is visually hidden text here for screen readers.</p>
          <span className="sr-only">
            This text is only visible to screen readers. It provides additional context that sighted
            users get visually.
          </span>

          <Button size="icon" variant="outline" aria-label="Close dialog">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x size-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            {/* The aria-label on the button makes the icon accessible without needing sr-only text inside */}
          </Button>
          <p className="text-muted-foreground text-xs">
            Icon button uses aria-label for accessibility.
          </p>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Reduced Motion"
        description="Respecting user preferences for reduced motion."
      >
        <div className="flex w-full max-w-md flex-col gap-4">
          <p className="text-muted-foreground text-sm">
            All Framer Motion animations use the <code>useReducedMotion()</code> hook from
            framer-motion to disable animations automatically when the user has requested reduced
            motion in their OS settings.
          </p>
        </div>
      </ComponentPreview>
    </section>
  );
}
