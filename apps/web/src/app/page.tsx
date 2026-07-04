"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { PageWrapper, Navbar, HeroWrapper, Container, Grid } from "@/components/layout/layout";
import { Fade, Stagger } from "@/components/motion/motion";
import { ThemeToggle } from "@/theme/theme-toggle";

const FloatingOrb = dynamic(() => import("@/components/three/three").then((m) => m.FloatingOrb), {
  ssr: false,
});
const GlowBackground = dynamic(
  () => import("@/components/three/three").then((m) => m.GlowBackground),
  { ssr: false },
);

export default function LandingPage() {
  const brand = (
    <div className="flex items-center gap-3">
      <div className="from-primary to-accent shadow-glow size-8 rounded-xl bg-gradient-to-br" />
      <span className="font-display text-xl font-bold tracking-tight">VoyageAI</span>
    </div>
  );

  const navLinks = (
    <>
      <a
        href="#features"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        Features
      </a>
      <a
        href="#pricing"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        Pricing
      </a>
      <a
        href="#testimonials"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        Testimonials
      </a>
    </>
  );

  const actions = (
    <>
      <ThemeToggle className="hidden sm:inline-flex" />
      <Button variant="default">Get Started</Button>
    </>
  );

  return (
    <PageWrapper>
      <Navbar brand={brand} actions={actions}>
        {navLinks}
      </Navbar>

      <HeroWrapper className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="absolute inset-0 z-0">
          <GlowBackground />
        </div>

        <Container className="relative z-10 py-12">
          <Grid columns={12} className="items-center gap-12 lg:gap-8">
            <div className="col-span-12 lg:col-span-6">
              <Stagger className="flex flex-col gap-8">
                <Fade>
                  <div className="rounded-pill border-border/60 bg-muted/40 text-primary shadow-soft inline-flex items-center border px-3 py-1.5 text-sm font-medium backdrop-blur-md">
                    <span className="relative mr-2 flex size-2">
                      <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                      <span className="bg-primary relative inline-flex size-2 rounded-full"></span>
                    </span>
                    VoyageAI 2.0 is now live
                  </div>
                </Fade>
                <Fade>
                  <h1 className="font-display text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    Build AI-Native Apps <br />
                    <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                      at Light Speed
                    </span>
                  </h1>
                </Fade>
                <Fade>
                  <p className="text-muted-foreground max-w-xl text-balance text-lg sm:text-xl">
                    The ultimate foundation for modern SaaS. Beautiful, accessible, and performant
                    components designed specifically for the AI era.
                  </p>
                </Fade>
                <Fade>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Button variant="default" size="lg" className="w-full sm:w-auto">
                      Start Building Free
                    </Button>
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explore Documentation
                    </Button>
                  </div>
                </Fade>
              </Stagger>
            </div>

            <div className="col-span-12 hidden lg:col-span-6 lg:block">
              <Fade delay={0.4}>
                <div className="relative aspect-square w-full">
                  <FloatingOrb />
                </div>
              </Fade>
            </div>
          </Grid>
        </Container>
      </HeroWrapper>
    </PageWrapper>
  );
}
