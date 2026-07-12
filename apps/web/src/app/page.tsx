"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PageWrapper,
  Navbar,
  HeroWrapper,
  Container,
  Grid,
  Section,
  Footer,
} from "@/components/layout/layout";
import { Fade, Stagger, ScrollReveal, FloatingElements } from "@/components/motion/motion";
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
  Menu,
} from "lucide-react";
import Link from "next/link";
import { Sheet, DrawerContent } from "@/components/ui/overlays";

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

  const [activePath, setActivePath] = useState("#home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#about", label: "About" },
  ];

  const navLinks = (
    <div
      className="rounded-pill border-border/60 bg-glass/80 shadow-glass inline-flex items-center border p-1 backdrop-blur-xl"
      role="navigation"
      aria-label="Main Navigation"
    >
      {NAV_ITEMS.map((link) => {
        const isActive = activePath === link.href;
        return (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setActivePath(link.href)}
            className={cn(
              "rounded-pill relative isolate flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="nav-pill"
                className="rounded-pill border-border/40 bg-background shadow-medium absolute inset-0 -z-10 border"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            ) : null}
            <span className="relative z-10">{link.label}</span>
          </a>
        );
      })}
    </div>
  );

  const actions = (
    <div className="flex items-center gap-2">
      <ThemeToggle className="hidden sm:inline-flex" />

      <div className="hidden items-center gap-2 md:flex">
        <Button asChild variant="ghost" className="rounded-full">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button
          asChild
          variant="default"
          className="from-primary to-accent shadow-glow rounded-full border-none bg-gradient-to-r transition-opacity hover:opacity-90"
        >
          <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full md:hidden"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DrawerContent side="right">
          <div className="flex flex-col gap-6 pt-10">
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActivePath(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-foreground hover:bg-muted/40 rounded-xl px-4 py-3 text-lg font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="bg-border/60 my-2 h-px" />

            <div className="flex flex-col gap-3 px-2">
              <Button asChild variant="outline" className="h-12 w-full justify-center text-base">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button
                asChild
                variant="default"
                className="from-primary to-accent shadow-glow text-primary-foreground h-12 w-full justify-center border-none bg-gradient-to-r text-base"
              >
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Sheet>
    </div>
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
                <Fade delay={0.4} className="h-full">
                  <div className="relative h-full min-h-[500px] w-full lg:min-h-[600px]">
                    <div className="bg-primary/5 absolute inset-0 rounded-full opacity-50 blur-3xl" />

                    <FloatingElements
                      amplitude={10}
                      className="absolute left-0 top-[10%] z-20 w-[280px]"
                    >
                      <GlassCard className="flex items-center gap-4 p-4">
                        <div className="bg-primary/20 rounded-xl p-3">
                          <Plane className="text-primary size-5" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                            Flight Alert
                          </p>
                          <p className="text-sm font-semibold">NYC → TYO • $450</p>
                        </div>
                      </GlassCard>
                    </FloatingElements>

                    <FloatingElements
                      amplitude={15}
                      className="absolute right-0 top-[25%] z-10 w-[260px]"
                    >
                      <GlassCard className="flex items-center gap-4 p-4">
                        <div className="bg-accent/20 rounded-xl p-3">
                          <Hotel className="text-accent size-5" />
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                            Top Match
                          </p>
                          <p className="text-sm font-semibold">Aman Tokyo</p>
                        </div>
                      </GlassCard>
                    </FloatingElements>

                    <FloatingElements
                      amplitude={8}
                      className="absolute left-1/2 top-1/2 z-20 w-[340px] -translate-x-1/2 -translate-y-1/2"
                    >
                      <Card className="border-primary/50 shadow-glow p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="font-semibold">Japan Explorer</h3>
                          <span className="bg-primary/10 text-primary rounded-pill px-2 py-1 text-xs font-bold">
                            14 Days
                          </span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs">
                              Day 1
                            </div>
                            <p className="text-sm">Arrive in Tokyo, Shinjuku</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs">
                              Day 2
                            </div>
                            <p className="text-sm">Tsukiji & TeamLab Borderless</p>
                          </div>
                          <div className="flex items-center gap-3 opacity-50">
                            <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs">
                              Day 3
                            </div>
                            <p className="text-sm">Mt. Fuji Day Trip</p>
                          </div>
                        </div>
                        <Button variant="default" className="mt-6 h-10 w-full">
                          View Full Itinerary
                        </Button>
                      </Card>
                    </FloatingElements>

                    <FloatingElements
                      amplitude={12}
                      className="absolute bottom-[15%] left-[5%] z-10 w-[220px]"
                    >
                      <GlassCard className="p-4">
                        <div className="mb-2 flex items-center gap-3">
                          <div className="bg-success/20 rounded-lg p-2">
                            <Wallet className="text-success size-4" />
                          </div>
                          <p className="text-muted-foreground text-xs font-medium">Est. Budget</p>
                        </div>
                        <p className="text-2xl font-bold">$3,250</p>
                        <p className="text-success mt-1 text-xs">Within goal</p>
                      </GlassCard>
                    </FloatingElements>

                    <FloatingElements
                      amplitude={6}
                      className="absolute bottom-[20%] right-[5%] z-30"
                    >
                      <div className="border-border/60 bg-background/90 shadow-medium rounded-pill inline-flex items-center border px-4 py-2 backdrop-blur-xl">
                        <span className="relative mr-3 flex size-2">
                          <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                          <span className="bg-primary relative inline-flex size-2 rounded-full"></span>
                        </span>
                        <span className="text-sm font-medium">AI Optimizing Routes...</span>
                      </div>
                    </FloatingElements>
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

      <Section id="how-it-works" className="bg-background">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              How VoyageAI Works
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Plan an entire trip in minutes using intelligent AI-powered travel planning.
            </p>
          </div>
        </ScrollReveal>

        <Grid columns={12} className="gap-6">
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.1}>
              <GlassCard className="group relative flex h-full flex-col p-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">📝</div>
                <h3 className="mb-2 text-xl font-semibold">Tell Us Your Trip</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Choose your destination, travel dates, budget, travel style and interests.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.2}>
              <GlassCard className="group relative flex h-full flex-col p-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">🤖</div>
                <h3 className="mb-2 text-xl font-semibold">AI Creates Your Itinerary</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  VoyageAI generates a complete day-wise itinerary including attractions, hotels and
                  travel suggestions.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.3}>
              <GlassCard className="group relative flex h-full flex-col p-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">✈️</div>
                <h3 className="mb-2 text-xl font-semibold">Review & Customize</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Modify activities, compare recommendations and personalize every day of your
                  journey.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 sm:col-span-6 lg:col-span-3">
            <ScrollReveal delay={0.4}>
              <GlassCard className="group relative flex h-full flex-col p-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">💾</div>
                <h3 className="mb-2 text-xl font-semibold">Save & Export</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Save your itinerary securely and export a beautifully formatted PDF whenever you
                  need it.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
        </Grid>
      </Section>

      <Section id="about" className="bg-muted/5">
        <ScrollReveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              About VoyageAI
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              AI-powered travel planning designed to make every journey smarter, faster and more
              personalized.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <p className="text-foreground/90 text-lg leading-relaxed sm:text-xl">
              VoyageAI is an AI-powered travel operating system that transforms trip planning into a
              seamless experience. Instead of spending hours researching destinations, hotels and
              attractions, users simply describe their ideal vacation and receive a complete
              personalized itinerary generated in seconds. Built with modern AI technologies,
              VoyageAI combines intelligent recommendations with beautiful design to simplify every
              stage of travel planning.
            </p>
          </div>
        </ScrollReveal>

        <Grid columns={12} className="gap-6">
          <div className="col-span-12 md:col-span-4">
            <ScrollReveal delay={0.2}>
              <GlassCard className="group relative flex h-full flex-col items-center p-8 text-center transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">⚡</div>
                <h3 className="mb-2 text-xl font-semibold">AI Powered</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Generate personalized itineraries within seconds.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 md:col-span-4">
            <ScrollReveal delay={0.3}>
              <GlassCard className="group relative flex h-full flex-col items-center p-8 text-center transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">🎯</div>
                <h3 className="mb-2 text-xl font-semibold">Personalized</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every itinerary adapts to your destination, interests and travel preferences.
                </p>
              </GlassCard>
            </ScrollReveal>
          </div>
          <div className="col-span-12 md:col-span-4">
            <ScrollReveal delay={0.4}>
              <GlassCard className="group relative flex h-full flex-col items-center p-8 text-center transition-all hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_0_2rem_-0.5rem_rgba(var(--primary),0.2)]">
                <div className="mb-4 text-4xl">🌍</div>
                <h3 className="mb-2 text-xl font-semibold">End-to-End Planning</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Hotels, attractions, budgets and day-wise planning all in one experience.
                </p>
              </GlassCard>
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
