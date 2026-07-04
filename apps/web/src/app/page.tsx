"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import {
  PageWrapper,
  Navbar,
  HeroWrapper,
  Container,
  Grid,
  Section,
  Footer,
} from "@/components/layout/layout";
import { Fade, Stagger, ScrollReveal } from "@/components/motion/motion";
import { ThemeToggle } from "@/theme/theme-toggle";
import { FeatureCard, GlassCard, Card } from "@/components/ui/card";
import {
  Plane,
  Map as MapIcon,
  Hotel,
  Wallet,
  Users,
  Compass,
  Star,
  MapPin,
  Check,
} from "lucide-react";

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
        href="#home"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        Home
      </a>
      <a
        href="#features"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        Features
      </a>
      <a
        href="#how-it-works"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        How It Works
      </a>
      <a
        href="#pricing"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        Pricing
      </a>
      <a
        href="#about"
        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
      >
        About
      </a>
    </>
  );

  const actions = (
    <>
      <ThemeToggle className="hidden sm:inline-flex" />
      <Button variant="default">Plan My Trip</Button>
    </>
  );

  const footerLinks = (
    <div className="flex flex-wrap items-center gap-6">
      <a href="#about" className="text-muted-foreground hover:text-foreground text-sm">
        About
      </a>
      <a href="#privacy" className="text-muted-foreground hover:text-foreground text-sm">
        Privacy Policy
      </a>
      <a href="#terms" className="text-muted-foreground hover:text-foreground text-sm">
        Terms
      </a>
      <a href="#contact" className="text-muted-foreground hover:text-foreground text-sm">
        Contact
      </a>
      <a href="https://github.com" className="text-muted-foreground hover:text-foreground text-sm">
        GitHub
      </a>
    </div>
  );

  return (
    <PageWrapper>
      <Navbar brand={brand} actions={actions}>
        {navLinks}
      </Navbar>

      <div id="home">
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
                      VoyageAI Travel 2.0
                    </div>
                  </Fade>
                  <Fade>
                    <h1 className="font-display text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                      Plan Your Perfect Trip <br />
                      <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
                        with AI
                      </span>
                    </h1>
                  </Fade>
                  <Fade>
                    <p className="text-muted-foreground max-w-xl text-balance text-lg sm:text-xl">
                      The intelligent travel platform. Generate personalized itineraries, discover
                      perfect hotels, find optimal flights, and track budgets automatically.
                    </p>
                  </Fade>
                  <Fade>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <Button variant="default" size="lg" className="w-full sm:w-auto">
                        Plan My Trip
                      </Button>
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Explore Features
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
      </div>

      <Section id="features" className="bg-muted/10">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need for seamless travel
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Our AI handles the logistics so you can focus on the experience.
            </p>
          </div>
        </ScrollReveal>

        <Grid columns={12} className="gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<Compass className="text-primary size-6" />}
                title="AI Trip Planner"
                description="Instantly generate custom, day-by-day itineraries based on your interests and travel style."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.2}>
              <FeatureCard
                icon={<MapIcon className="text-primary size-6" />}
                title="Smart Itinerary Generator"
                description="Automatically sequence activities to minimize travel time and maximize enjoyment."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.3}>
              <FeatureCard
                icon={<Plane className="text-primary size-6" />}
                title="Flight Recommendations"
                description="Discover optimal flight routes and track price drops with intelligent forecasting."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.4}>
              <FeatureCard
                icon={<Hotel className="text-primary size-6" />}
                title="Hotel Discovery"
                description="Find accommodations that perfectly match your vibe, budget, and desired location."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <FeatureCard
                icon={<MapPin className="text-primary size-6" />}
                title="Interactive Maps"
                description="Visualize your entire trip on interactive maps with real-time routing and points of interest."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.2}>
              <FeatureCard
                icon={<Wallet className="text-primary size-6" />}
                title="Budget Planning"
                description="Keep track of expenses and receive smart suggestions to stay within your travel budget."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.3}>
              <FeatureCard
                icon={<Users className="text-primary size-6" />}
                title="Collaborative Planning"
                description="Invite friends and family to vote on activities and plan the perfect group getaway."
              />
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.4}>
              <FeatureCard
                icon={<Star className="text-primary size-6" />}
                title="Real-time Insights"
                description="Get localized travel alerts, weather updates, and curated local recommendations."
              />
            </ScrollReveal>
          </div>
        </Grid>
      </Section>

      <Section id="testimonials">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by travelers everywhere
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              See how VoyageAI is changing the way people explore the world.
            </p>
          </div>
        </ScrollReveal>

        <Grid columns={12} className="gap-6">
          <div className="col-span-12 lg:col-span-4">
            <ScrollReveal delay={0.1}>
              <GlassCard className="flex h-full flex-col justify-between p-8">
                <div>
                  <div className="text-warning mb-4 flex gap-1">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "VoyageAI planned a 14-day trip to Japan for me in under two minutes. The
                    itinerary was perfectly balanced and took us to hidden gems we never would have
                    found ourselves."
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="bg-primary/20 text-primary flex size-10 items-center justify-center rounded-full font-bold">
                    SJ
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Sarah Jenkins</p>
                    <p className="text-muted-foreground text-xs">Frequent Traveler</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ScrollReveal delay={0.2}>
              <GlassCard className="relative flex h-full flex-col justify-between overflow-hidden p-8">
                <div className="absolute right-0 top-0 p-8 opacity-5">
                  <Compass className="size-24" />
                </div>
                <div className="relative z-10">
                  <div className="text-warning mb-4 flex gap-1">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "The interactive map feature combined with budget tracking saved our family
                    vacation. It was so easy to collaborate and vote on activities together."
                  </p>
                </div>
                <div className="relative z-10 mt-6 flex items-center gap-3">
                  <div className="bg-accent/20 text-accent flex size-10 items-center justify-center rounded-full font-bold">
                    MR
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Mark Roberts</p>
                    <p className="text-muted-foreground text-xs">Family Explorer</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <ScrollReveal delay={0.3}>
              <GlassCard className="flex h-full flex-col justify-between p-8">
                <div>
                  <div className="text-warning mb-4 flex gap-1">
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                    <Star className="size-4 fill-current" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "I used to spend weeks researching flights and hotels. VoyageAI did it instantly
                    and even tracked flight prices to make sure I got the best deal. Incredible
                    platform."
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="bg-success/20 text-success flex size-10 items-center justify-center rounded-full font-bold">
                    AL
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Amanda Lee</p>
                    <p className="text-muted-foreground text-xs">Digital Nomad</p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </Grid>
      </Section>

      <Section id="pricing" className="bg-muted/10">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Start planning for free, upgrade when you need more power.
            </p>
          </div>
        </ScrollReveal>

        <Grid columns={12} className="mx-auto max-w-5xl gap-6">
          <div className="col-span-12 md:col-span-4">
            <ScrollReveal delay={0.1}>
              <Card className="flex h-full flex-col p-8">
                <h3 className="text-xl font-semibold">Wanderer</h3>
                <p className="text-muted-foreground mt-2 text-sm">Perfect for weekend getaways.</p>
                <div className="my-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <div className="text-muted-foreground flex-1 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Up to 3 itineraries/month
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Basic flight & hotel search
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Interactive maps
                  </div>
                </div>
                <Button variant="outline" className="mt-8 w-full">
                  Start for Free
                </Button>
              </Card>
            </ScrollReveal>
          </div>

          <div className="col-span-12 md:col-span-4">
            <ScrollReveal delay={0.2}>
              <Card className="border-primary shadow-glow relative flex h-full flex-col p-8">
                <div className="absolute right-6 top-0 -translate-y-1/2">
                  <span className="bg-primary text-primary-foreground rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-xl font-semibold">Explorer</h3>
                <p className="text-muted-foreground mt-2 text-sm">For the frequent traveler.</p>
                <div className="my-6">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <div className="text-foreground flex-1 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Unlimited itineraries
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Smart flight price tracking
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Collaborative planning
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Budget optimization
                  </div>
                </div>
                <Button variant="default" className="mt-8 w-full">
                  Upgrade to Explorer
                </Button>
              </Card>
            </ScrollReveal>
          </div>

          <div className="col-span-12 md:col-span-4">
            <ScrollReveal delay={0.3}>
              <Card className="flex h-full flex-col p-8">
                <h3 className="text-xl font-semibold">Voyager</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  For travel professionals & agencies.
                </p>
                <div className="my-6">
                  <span className="text-4xl font-bold">$49</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <div className="text-muted-foreground flex-1 space-y-4 text-sm">
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Everything in Explorer
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> White-labeled itineraries
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Priority support
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-primary size-4" /> Advanced API access
                  </div>
                </div>
                <Button variant="outline" className="mt-8 w-full">
                  Contact Sales
                </Button>
              </Card>
            </ScrollReveal>
          </div>
        </Grid>
      </Section>

      <Footer brand={brand} links={footerLinks} />
    </PageWrapper>
  );
}
