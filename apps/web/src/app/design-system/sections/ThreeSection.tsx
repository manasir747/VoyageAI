import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import dynamic from "next/dynamic";

const FloatingOrb = dynamic(() => import("@/components/three/three").then((m) => m.FloatingOrb), {
  ssr: false,
});
const GradientBlob = dynamic(() => import("@/components/three/three").then((m) => m.GradientBlob), {
  ssr: false,
});
const GlowBackground = dynamic(
  () => import("@/components/three/three").then((m) => m.GlowBackground),
  { ssr: false },
);
const AnimatedGrid = dynamic(() => import("@/components/three/three").then((m) => m.AnimatedGrid), {
  ssr: false,
});
const ParticleBackground = dynamic(
  () => import("@/components/three/three").then((m) => m.ParticleBackground),
  { ssr: false },
);
const ThreeCardWrapper = dynamic(
  () => import("@/components/three/three").then((m) => m.ThreeCardWrapper),
  { ssr: false },
);

export function ThreeSection() {
  return (
    <section id="3d" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">3D & WebGL</h2>
        <p className="text-muted-foreground">Performant 3D backgrounds and interactive elements.</p>
      </div>

      <ComponentPreview
        name="Background Effects"
        description="Ambient background animations (Orb, Blob, Grid, Glow)."
      >
        <div className="border-border/70 bg-card shadow-soft relative z-0 flex h-80 w-full max-w-2xl items-center justify-center overflow-hidden rounded-3xl border">
          <GlowBackground />
          <AnimatedGrid />
          <GradientBlob className="left-1/4 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2" />
          <FloatingOrb className="right-1/4 top-1/3 h-48 w-48" />

          <div className="bg-background/80 border-border/50 shadow-glass relative z-10 rounded-2xl border p-6 text-center backdrop-blur-xl">
            <h3 className="text-lg font-semibold">Ambient Background</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Combining Grid, Glow, Blob, and Orb
            </p>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Particle Background"
        description="Three.js particle system for heroes."
      >
        <div className="border-border/70 bg-card shadow-soft relative z-0 flex h-80 w-full max-w-2xl items-center justify-center overflow-hidden rounded-3xl border">
          <ParticleBackground />
          <div className="pointer-events-none relative z-10 text-center">
            <h3 className="text-lg font-semibold">WebGL Particles</h3>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="3D Interactive Card"
        description="Card wrapper that tilts based on mouse position."
      >
        <div className="flex w-full justify-center py-12">
          <ThreeCardWrapper>
            <div className="from-primary/80 to-accent/80 shadow-strong flex h-80 w-64 flex-col justify-end rounded-2xl bg-gradient-to-br p-6 text-white">
              <h3 className="text-xl font-bold">Interactive Depth</h3>
              <p className="mt-2 text-sm opacity-90">Hover and move your mouse to tilt the card.</p>
            </div>
          </ThreeCardWrapper>
        </div>
      </ComponentPreview>
    </section>
  );
}
