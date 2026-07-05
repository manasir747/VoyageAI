"use client";

import React from "react";
import { AICard, DestinationCard, GlassCard } from "@/components/ui/card";
import { Fade, Stagger, Reveal } from "@/components/motion/motion";
import {
  Plane,
  Hotel,
  MapPin,
  Wallet,
  Sparkles,
  Navigation,
  Clock,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripPlanResponse } from "@/types/planner";

export function ItineraryResult({ data }: { data: TripPlanResponse }) {
  // Helper to determine icon based on time/activity
  const getTimeIcon = (time?: string) => {
    if (!time) return <MapPin className="text-primary size-4" />;
    const hour = parseInt(time.split(":")[0] || "12");
    if (hour < 12) return <Sun className="text-warning size-4" />;
    if (hour < 17) return <Sun className="size-4 text-orange-400" />;
    if (hour < 20) return <Sunset className="text-destructive size-4" />;
    return <Moon className="size-4 text-indigo-400" />;
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col pb-12">
      {/* Sticky Header */}
      <div className="bg-background/95 border-border/50 sticky top-0 z-20 -mx-2 mb-8 border-b px-2 pb-4 pt-4 backdrop-blur-xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-primary mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                <Sparkles className="size-4" />
                <span>AI Generated Itinerary</span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                Trip to {data.destination}
              </h2>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" size="sm">
                Save Trip
              </Button>
              <Button variant="default" size="sm" className="shadow-glow">
                Export to Maps
              </Button>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="flex flex-col gap-10">
        {/* Overview Block */}
        <Reveal>
          <div className="bg-primary/5 border-primary/20 relative overflow-hidden rounded-2xl border p-6">
            <div className="bg-primary/10 absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full blur-3xl" />
            <p className="text-foreground/90 relative z-10 text-lg leading-relaxed">
              {data.overview}
            </p>
          </div>
        </Reveal>

        {/* Stats Row */}
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <GlassCard className="flex flex-col justify-between gap-4 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <Wallet className="size-4" />
              <span className="text-sm font-medium">Estimated Budget</span>
            </div>
            <div>
              <div className="font-display break-words text-2xl font-bold sm:text-3xl">
                {data.budgetSummary.total}
              </div>
              <div className="text-success mt-1 text-xs font-medium">
                {data.budgetSummary.trend}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between gap-4 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="size-4" />
              <span className="text-sm font-medium">Travel Time</span>
            </div>
            <div>
              <div className="font-display text-2xl font-bold sm:text-3xl">
                {data.budgetSummary.travelTime}
              </div>
              <div className="text-muted-foreground mt-1 text-xs font-medium">
                Total transit duration
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col justify-between gap-4 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="size-4" />
              <span className="text-sm font-medium">Activities</span>
            </div>
            <div>
              <div className="font-display text-2xl font-bold sm:text-3xl">
                {data.budgetSummary.activitiesCount}
              </div>
              <div className="text-muted-foreground mt-1 text-xs font-medium">
                Planned destinations
              </div>
            </div>
          </GlassCard>
        </Stagger>

        {/* Flights */}
        {data.flights.length > 0 && (
          <Reveal delay={0.15}>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Plane className="text-primary size-5" /> Recommended Flights
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {data.flights.map((flight, idx: number) => (
                  <GlassCard
                    key={idx}
                    className="border-l-primary hover:bg-muted/30 flex flex-col justify-between gap-4 border-l-4 p-4 transition-colors sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 text-primary shrink-0 rounded-full p-3">
                        <Plane className="size-5" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold">{flight.airline}</h4>
                        <p className="text-muted-foreground text-sm">{flight.route}</p>
                      </div>
                    </div>

                    <div className="flex w-full items-center justify-between gap-6 sm:w-auto sm:justify-end">
                      {flight.meta && (
                        <div className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-medium">
                          {flight.meta}
                        </div>
                      )}
                      <div className="text-lg font-bold">{flight.price}</div>
                      <Button size="sm" variant="default">
                        Book
                      </Button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Hotels */}
        {data.hotels.length > 0 && (
          <Reveal delay={0.2}>
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold">
                <Hotel className="text-primary size-5" /> Recommended Stays
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {data.hotels.map((hotel, idx: number) => (
                  <DestinationCard
                    key={idx}
                    name={hotel.name}
                    location={hotel.location}
                    meta={hotel.meta}
                    action={
                      hotel.bestMatch ? (
                        <span className="bg-success/20 text-success rounded-md px-2 py-1 text-xs font-medium">
                          Best Match
                        </span>
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          </Reveal>
        )}

        {/* Daily Itinerary */}
        <div className="mt-4 space-y-6">
          <h3 className="font-display border-border/50 flex items-center gap-2 border-b pb-4 text-2xl font-bold">
            <MapPin className="text-primary size-6" /> Detailed Itinerary
          </h3>

          {data.days.map((day, idx: number) => (
            <Reveal key={idx} delay={0.3 + idx * 0.1}>
              <GlassCard className="border-border/60 overflow-hidden border p-0">
                <div className="bg-muted/40 border-border/60 flex items-center justify-between border-b px-6 py-4">
                  <h4 className="text-lg font-bold">{day.date}</h4>
                  <span className="text-primary text-sm font-medium">{day.title}</span>
                </div>

                <div className="space-y-6 p-6">
                  {day.activities.map((act, actIdx: number) => (
                    <div key={actIdx} className="group flex gap-4">
                      <div className="flex shrink-0 flex-col items-center gap-2">
                        <div className="bg-background border-primary/30 group-hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-colors">
                          {getTimeIcon(act.meta)}
                        </div>
                        {actIdx !== day.activities.length - 1 && (
                          <div className="bg-border/80 h-full w-px" />
                        )}
                      </div>

                      <div className="w-full pb-6">
                        <div className="mb-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <h5 className="text-lg font-bold leading-tight">{act.title}</h5>
                          {act.meta && (
                            <span className="bg-muted text-muted-foreground w-fit shrink-0 rounded px-2 py-1 font-mono text-xs">
                              {act.meta}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                          {act.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>

        {/* Tips & Packing */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Reveal delay={0.5}>
            <GlassCard className="border-primary/20 flex h-full flex-col p-6">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Sparkles className="text-primary size-5" /> AI Travel Tips
              </h3>
              <div className="text-foreground/80 flex-1 space-y-3 text-sm leading-relaxed">
                {/* Splitting long text into pseudo-paragraphs if possible */}
                {data.travelTips.split(/(?=[A-Z])/).map((sentence, idx) => {
                  if (sentence.trim().length > 10) {
                    return (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="bg-primary/60 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" />
                        <p>{sentence.trim()}</p>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </GlassCard>
          </Reveal>

          {data.packingSuggestions && data.packingSuggestions.length > 0 && (
            <Reveal delay={0.6}>
              <GlassCard className="flex h-full flex-col p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                  <Navigation className="text-accent size-5" /> Packing Checklist
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.packingSuggestions.map((item, idx: number) => (
                    <div
                      key={idx}
                      className="bg-muted/50 border-border/50 text-foreground/80 flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm"
                    >
                      <div className="bg-accent/60 h-1.5 w-1.5 shrink-0 rounded-full" />
                      {item}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </Reveal>
          )}
        </div>
      </div>
    </div>
  );
}
