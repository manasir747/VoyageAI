"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Fade, Stagger, Reveal } from "@/components/motion/motion";
import { GlassCard, InteractiveCard } from "@/components/ui/card";
import { Input } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import { DoughnutChart } from "@/components/dashboard/doughnut-chart";
import { TripCard } from "@/components/dashboard/trip-card";
import {
  Wallet,
  TrendingUp,
  Calculator,
  MapPin,
  Lightbulb,
  Plane,
  Hotel,
  Coffee,
  Activity,
  Car,
  ShoppingBag,
  Users,
  Calendar,
  Compass,
  ArrowRight,
  Heart,
} from "lucide-react";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format-currency";

interface BudgetViewProps {
  trips: any[];
}

export function BudgetView({ trips }: BudgetViewProps) {
  // Calculator State
  const [calcBudget, setCalcBudget] = useState<string>("3000");
  const [calcTravelers, setCalcTravelers] = useState<string>("2");
  const [calcDays, setCalcDays] = useState<string>("7");

  // Calculations from existing data
  const stats = useMemo(() => {
    let total = 0;
    let upcoming = 0;
    let totalTravelers = 0;
    const now = new Date();

    trips.forEach((trip) => {
      // Parse budget from "$1,500" or similar
      const rawBudget = trip.budget || trip.itinerary?.budgetSummary?.total || "0";
      const budgetNum = parseInt(rawBudget.replace(/[^0-9]/g, "")) || 0;

      const travelersStr = trip.travellers || "1";
      // extract numbers from string like "2 adults" or "Solo" (default 1)
      const travelersMatch = travelersStr.match(/(\d+)/);
      const travelersNum = travelersMatch ? parseInt(travelersMatch[0]) : 1;

      total += budgetNum;
      totalTravelers += travelersNum;

      if (trip.start_date && new Date(trip.start_date) > now) {
        upcoming += budgetNum;
      }
    });

    return {
      totalBudget: total,
      upcomingBudget: upcoming,
      avgPerTrip: trips.length > 0 ? Math.round(total / trips.length) : 0,
      avgPerTraveler: totalTravelers > 0 ? Math.round(total / totalTravelers) : 0,
    };
  }, [trips]);

  // Expense breakdown (Estimated Percentages)
  const breakdownData = [
    { label: "Flights", value: 40, color: "#3B82F6", icon: Plane },
    { label: "Hotels", value: 35, color: "#8B5CF6", icon: Hotel },
    { label: "Food", value: 10, color: "#10B981", icon: Coffee },
    { label: "Activities", value: 8, color: "#F59E0B", icon: Activity },
    { label: "Transport", value: 5, color: "#6366F1", icon: Car },
    { label: "Shopping", value: 2, color: "#EC4899", icon: ShoppingBag },
  ];

  // Calculator logic
  const calcResults = useMemo(() => {
    const budgetNum = parseFloat(calcBudget) || 0;
    const travelersNum = parseFloat(calcTravelers) || 1;
    const daysNum = parseFloat(calcDays) || 1;

    const perTraveler = budgetNum / travelersNum;
    const perDay = budgetNum / daysNum;

    return {
      perTraveler,
      perDay,
      flights: budgetNum * 0.4,
      hotels: budgetNum * 0.35,
      food: budgetNum * 0.1,
      activities: budgetNum * 0.08,
    };
  }, [calcBudget, calcTravelers, calcDays]);

  if (trips.length === 0) {
    return (
      <div className="flex w-full max-w-full flex-col gap-6">
        <Fade>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Budget Overview</h1>
            <p className="text-muted-foreground mt-2">
              Track your travel spending and plan smarter trips.
            </p>
          </div>
        </Fade>
        <Fade className="mt-8">
          <EmptyState
            icon={<Wallet className="text-primary size-10" />}
            title="No trips yet."
            description="Create your first trip to start tracking travel budgets and estimating costs."
            action={
              <Link href="/dashboard/ai-planner">
                <Button size="lg" className="shadow-glow rounded-full px-8">
                  Plan Your First Trip
                </Button>
              </Link>
            }
          />
        </Fade>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-10 pb-20">
      {/* SECTION 1 - HERO */}
      <Fade>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Budget Overview</h1>
          <p className="text-muted-foreground mt-2">
            Track your travel spending, estimate future costs and plan smarter trips.
          </p>
        </div>
      </Fade>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* LEFT COLUMN - MAIN CONTENT (Approx 65%) */}
        <div className="flex flex-col gap-8 lg:col-span-8">
          {/* SECTION 2 - SUMMARY CARDS */}
          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Fade>
              <GlassCard className="border-border/40 p-6">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground mb-3 flex items-center gap-2">
                    <Wallet className="text-primary size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Total Planned Budget
                    </span>
                  </div>
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    title={formatCurrency(stats.totalBudget)}
                  >
                    {formatCurrencyCompact(stats.totalBudget)}
                  </span>
                </div>
              </GlassCard>
            </Fade>
            <Fade>
              <GlassCard className="border-border/40 p-6">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="text-accent size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Upcoming Trip Budget
                    </span>
                  </div>
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    title={formatCurrency(stats.upcomingBudget)}
                  >
                    {formatCurrencyCompact(stats.upcomingBudget)}
                  </span>
                </div>
              </GlassCard>
            </Fade>
            <Fade>
              <GlassCard className="border-border/40 p-6">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground mb-3 flex items-center gap-2">
                    <MapPin className="text-success size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Avg Budget Per Trip
                    </span>
                  </div>
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    title={formatCurrency(stats.avgPerTrip)}
                  >
                    {formatCurrencyCompact(stats.avgPerTrip)}
                  </span>
                </div>
              </GlassCard>
            </Fade>
            <Fade>
              <GlassCard className="border-border/40 p-6">
                <div className="flex flex-col gap-1">
                  <div className="text-muted-foreground mb-3 flex items-center gap-2">
                    <Users className="text-warning size-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Avg Budget Per Traveler
                    </span>
                  </div>
                  <span
                    className="font-display text-3xl font-bold leading-none"
                    title={formatCurrency(stats.avgPerTraveler)}
                  >
                    {formatCurrencyCompact(stats.avgPerTraveler)}
                  </span>
                </div>
              </GlassCard>
            </Fade>
          </Stagger>

          {/* SECTION 3 - EXPENSE BREAKDOWN */}
          <Fade>
            <GlassCard className="border-border/40 p-6 sm:p-8">
              <h2 className="font-display mb-6 text-xl font-bold">Expense Breakdown (Estimated)</h2>
              <div className="flex flex-col items-center gap-8 sm:flex-row">
                <div className="flex w-full justify-center sm:w-1/3">
                  <DoughnutChart data={breakdownData} />
                </div>
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-4 sm:w-2/3">
                  {breakdownData.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className="mt-1 h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-col">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          <item.icon className="text-muted-foreground size-3.5" />
                          {item.label}
                        </span>
                        <span className="text-muted-foreground mt-0.5 text-xs">
                          {item.value}% • {formatCurrency(stats.totalBudget * (item.value / 100))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </Fade>

          {/* SECTION 4 - BUDGET BY TRIP */}
          <Fade>
            <h2 className="font-display mb-4 text-xl font-bold">Budget By Trip</h2>
            <div className="flex flex-col gap-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </Fade>
        </div>

        {/* RIGHT COLUMN - SIDEBAR WIDGETS (Approx 35%) */}
        <div className="flex flex-col gap-8 lg:col-span-4">
          {/* SECTION 5 - BUDGET CALCULATOR */}
          <Fade>
            <GlassCard className="border-border/40 border-t-primary border-t-4 p-6">
              <div className="mb-6 flex items-center gap-2">
                <Calculator className="text-primary size-5" />
                <h2 className="font-display text-xl font-bold">Budget Calculator</h2>
              </div>

              <div className="mb-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                    Total Budget ($)
                  </label>
                  <Input
                    type="number"
                    value={calcBudget}
                    onChange={(e) => setCalcBudget(e.target.value)}
                    className="bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      Travelers
                    </label>
                    <Input
                      type="number"
                      value={calcTravelers}
                      onChange={(e) => setCalcTravelers(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
                      Days
                    </label>
                    <Input
                      type="number"
                      value={calcDays}
                      onChange={(e) => setCalcDays(e.target.value)}
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted/30 flex flex-col gap-3 rounded-xl p-4">
                <div className="border-border/40 flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground text-sm font-medium">Per Traveler</span>
                  <span className="font-bold">{formatCurrency(calcResults.perTraveler)}</span>
                </div>
                <div className="border-border/40 flex items-center justify-between border-b pb-2">
                  <span className="text-muted-foreground text-sm font-medium">Per Day</span>
                  <span className="font-bold">{formatCurrency(calcResults.perDay)}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <Hotel className="size-3" /> Hotel
                    </span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(calcResults.hotels)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <Plane className="size-3" /> Flight
                    </span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(calcResults.flights)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <Coffee className="size-3" /> Food
                    </span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(calcResults.food)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider">
                      <Activity className="size-3" /> Activity
                    </span>
                    <span className="text-sm font-semibold">
                      {formatCurrency(calcResults.activities)}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Fade>

          {/* SECTION 6 - COST SAVING TIPS */}
          <Fade>
            <GlassCard className="border-border/40 p-6">
              <div className="mb-5 flex items-center gap-2">
                <Lightbulb className="text-warning size-5" />
                <h2 className="font-display text-xl font-bold">Cost Saving Tips</h2>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  "Travel during shoulder season",
                  "Book flights 2-3 months early",
                  "Use public transport when possible",
                  "Travel mid-week for cheaper fares",
                  "Book hotels well in advance",
                  "Eat at local restaurants",
                ].map((tip, idx) => (
                  <li key={idx} className="text-foreground/80 flex items-start gap-2 text-sm">
                    <div className="bg-primary/20 text-primary mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full">
                      <span className="text-[10px] font-bold">{idx + 1}</span>
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Fade>

          {/* SECTION 8 - QUICK ACTIONS */}
          <Fade>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard/ai-planner">
                <InteractiveCard className="group flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">
                      <Calculator className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Plan New Trip</span>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                </InteractiveCard>
              </Link>

              <Link href="/dashboard/trips">
                <InteractiveCard className="group flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 text-accent rounded-lg p-2">
                      <Calendar className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">View Trips</span>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-accent size-4 transition-colors" />
                </InteractiveCard>
              </Link>

              <Link href="/dashboard/destinations">
                <InteractiveCard className="group flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-success/10 text-success rounded-lg p-2">
                      <Compass className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Explore Destinations</span>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-success size-4 transition-colors" />
                </InteractiveCard>
              </Link>

              <Link href="/dashboard/saved">
                <InteractiveCard className="group flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-error/10 text-error rounded-lg p-2">
                      <Heart className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Saved Destinations</span>
                  </div>
                  <ArrowRight className="text-muted-foreground group-hover:text-error size-4 transition-colors" />
                </InteractiveCard>
              </Link>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
}
