import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import {
  Fade,
  Slide,
  Scale,
  Rotate,
  Hover,
  MagneticButton,
  FloatingElements,
  MouseFollow,
  TextReveal,
  CounterAnimation,
} from "@/components/motion/motion";

export function MotionSection() {
  return (
    <section id="motion" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Motion & Animation</h2>
        <p className="text-muted-foreground">
          Reusable animation components built on Framer Motion.
        </p>
      </div>

      <ComponentPreview
        name="Entrance Animations"
        description="Basic entrance animations for revealing content."
      >
        <div className="flex min-h-[120px] w-full max-w-2xl flex-wrap items-center justify-center gap-8">
          <Fade className="bg-card border-border/70 shadow-soft rounded-xl border p-4">Fade</Fade>
          <Slide className="bg-card border-border/70 shadow-soft rounded-xl border p-4">
            Slide Up
          </Slide>
          <Scale className="bg-card border-border/70 shadow-soft rounded-xl border p-4">
            Scale In
          </Scale>
          <Rotate className="bg-card border-border/70 shadow-soft rounded-xl border p-4">
            Rotate In
          </Rotate>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Interactive Animations"
        description="Animations that respond to user input."
      >
        <div className="flex min-h-[120px] w-full max-w-2xl flex-wrap items-center justify-center gap-8">
          <Hover className="bg-card border-border/70 shadow-soft cursor-pointer rounded-xl border p-4">
            Hover Me
          </Hover>
          <MagneticButton variant="default">Magnetic Button</MagneticButton>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Continuous Animations"
        description="Ongoing animations for ambient movement."
      >
        <div className="flex min-h-[120px] w-full max-w-lg items-center justify-center gap-8">
          <FloatingElements amplitude={10}>
            <div className="bg-primary/20 border-primary/50 flex h-16 w-16 items-center justify-center rounded-full border">
              Float
            </div>
          </FloatingElements>
        </div>
      </ComponentPreview>

      <ComponentPreview name="Text Reveal" description="Staggered text reveal for headings.">
        <div className="flex min-h-[120px] w-full max-w-lg items-center justify-center">
          <TextReveal text="Discover the World" className="text-3xl font-bold tracking-tight" />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Counter Animation" description="Smoothly animate numeric values.">
        <div className="flex w-full max-w-lg flex-col items-center justify-center gap-2">
          <span className="text-muted-foreground text-sm">Total Users</span>
          <CounterAnimation value={25430} className="text-4xl font-bold tracking-tight" />
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Mouse Follow"
        description="Creates a subtle glow effect tracking the cursor."
      >
        <div className="w-full max-w-md">
          <MouseFollow
            className="border-border/70 bg-card shadow-soft flex h-48 flex-col justify-end rounded-2xl border p-6"
            glowClassName="bg-primary/20"
          >
            <h3 className="relative z-10 text-lg font-semibold">Hover over this card</h3>
            <p className="text-muted-foreground relative z-10 text-sm">
              Notice the soft glow following your cursor.
            </p>
          </MouseFollow>
        </div>
      </ComponentPreview>
    </section>
  );
}
