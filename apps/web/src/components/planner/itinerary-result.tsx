"use client";

import React, { useState } from "react";
import { InteractiveCard, GlassCard } from "@/components/ui/card";
import { Reveal } from "@/components/motion/motion";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/overlays";
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
  ChevronDown,
  ChevronUp,
  Star,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TripPlanResponse } from "@/types/planner";

const truncateWords = (str: string, max: number) => {
  if (!str) return "";
  const words = str.split(" ");
  if (words.length <= max) return str;
  return words.slice(0, max).join(" ") + "...";
};

const ActivityCard = ({ act, isLast }: { act: any; isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTimeIcon = (time?: string) => {
    if (!time) return <MapPin className="text-primary size-3.5" />;
    const hour = parseInt(time.split(":")[0] || "12");
    if (hour < 12) return <Sun className="text-warning size-3.5" />;
    if (hour < 17) return <Sun className="size-3.5 text-orange-400" />;
    if (hour < 20) return <Sunset className="text-destructive size-3.5" />;
    return <Moon className="size-3.5 text-indigo-400" />;
  };

  const wordCount = act.description ? act.description.split(" ").length : 0;
  const isLongText = wordCount > 40;

  return (
    <div className="group flex gap-4">
      <div className="flex shrink-0 flex-col items-center gap-1 pt-1">
        <div className="bg-background border-border/50 group-hover:border-primary/40 relative z-10 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm transition-colors">
          {getTimeIcon(act.meta)}
        </div>
        {!isLast && (
          <div className="bg-border/40 group-hover:bg-primary/20 h-full w-[1px] transition-colors" />
        )}
      </div>

      <div className="w-full pb-6">
        <div className="mb-1 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            {act.meta && (
              <span className="text-foreground/70 text-[11px] font-bold">{act.meta}</span>
            )}
            <h5 className="text-foreground text-base font-semibold leading-tight">{act.title}</h5>
          </div>
          <span className="bg-primary/5 text-primary border-primary/10 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Est. Cost: Varies
          </span>
        </div>
        <div className="text-muted-foreground mt-1 text-sm leading-relaxed">
          <p className={!isExpanded && isLongText ? "line-clamp-2" : ""}>{act.description}</p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-foreground/80 hover:text-primary mt-1.5 flex items-center gap-1 text-xs font-semibold transition-colors focus:outline-none"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export function ItineraryResult({ data }: { data: TripPlanResponse }) {
  const totalCostMatch = data.budgetSummary.total.replace(/[^0-9]/g, "");
  const totalCost = totalCostMatch ? parseInt(totalCostMatch) : null;
  const perPerson = totalCost ? Math.round(totalCost / 2).toLocaleString() : null;

  const tipsList = data.travelTips
    ? data.travelTips.split(".").filter((t) => t.trim().length > 5)
    : [];

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="bg-primary/5 absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" />
      </div>

      <Reveal className="z-10 w-full max-w-lg">
        <div className="flex flex-col items-center text-center">
          <div className="text-primary bg-primary/10 border-primary/20 mb-4 flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-widest">
            <Sparkles className="size-4" />
            <span>Itinerary Ready</span>
          </div>

          <h2 className="font-display mb-10 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Trip to {data.destination.split(",")[0]}
          </h2>

          <div className="mb-10 grid w-full grid-cols-3 gap-3">
            <div className="bg-card/60 border-border/40 flex flex-col items-center justify-center rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <Wallet className="text-primary mb-2 size-5" />
              <span className="font-display text-xl font-bold tracking-tight">
                {data.budgetSummary.total}
              </span>
              <span className="text-muted-foreground mt-1 text-[10px] font-bold uppercase tracking-widest">
                Budget
              </span>
            </div>
            <div className="bg-card/60 border-border/40 flex flex-col items-center justify-center rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <Clock className="text-primary mb-2 size-5" />
              <span className="font-display text-xl font-bold tracking-tight">
                {data.budgetSummary.travelTime}
              </span>
              <span className="text-muted-foreground mt-1 text-[10px] font-bold uppercase tracking-widest">
                Duration
              </span>
            </div>
            <div className="bg-card/60 border-border/40 flex flex-col items-center justify-center rounded-2xl border p-4 shadow-sm backdrop-blur-md">
              <MapPin className="text-primary mb-2 size-5" />
              <span className="font-display text-xl font-bold tracking-tight">
                {data.budgetSummary.activitiesCount}
              </span>
              <span className="text-muted-foreground mt-1 text-[10px] font-bold uppercase tracking-widest">
                Activities
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="shadow-glow group h-14 w-full rounded-xl text-lg font-semibold"
                >
                  <Sparkles className="mr-2 size-5 transition-transform group-hover:scale-110" />
                  View Full Itinerary
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-background border-border/40 flex h-[95vh] w-[95vw] max-w-[1400px] flex-col overflow-hidden p-0">
                <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-16 sm:px-12 md:px-24 lg:px-32">
                  <div className="mx-auto flex w-full max-w-[900px] flex-col space-y-16">
                    {/* Header */}
                    <div className="border-border/30 flex flex-col justify-between gap-6 border-b pb-6 sm:flex-row sm:items-end">
                      <div>
                        <h2 className="font-display mb-2 text-5xl font-bold leading-tight tracking-tight">
                          {data.destination}
                        </h2>
                        <p className="text-muted-foreground line-clamp-2 max-w-2xl text-lg">
                          {truncateWords(data.overview, 30)}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-3">
                        <Button
                          variant="outline"
                          className="border-border/50 rounded-full px-6 font-semibold"
                        >
                          Save
                        </Button>
                        <Button
                          variant="default"
                          className="shadow-soft rounded-full px-6 font-semibold"
                        >
                          Export
                        </Button>
                      </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="bg-muted/20 border-border/30 flex flex-col justify-center rounded-2xl border p-5">
                        <span className="text-muted-foreground mb-2 text-[10px] font-bold uppercase tracking-widest">
                          Budget
                        </span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold">{data.budgetSummary.total}</span>
                        </div>
                        {perPerson && (
                          <span className="text-muted-foreground mt-1 text-xs">
                            ≈ ${perPerson} / person
                          </span>
                        )}
                      </div>

                      <div className="bg-muted/20 border-border/30 flex flex-col justify-center rounded-2xl border p-5">
                        <span className="text-muted-foreground mb-2 text-[10px] font-bold uppercase tracking-widest">
                          Duration
                        </span>
                        <span className="text-2xl font-bold">{data.budgetSummary.travelTime}</span>
                        <span className="text-muted-foreground mt-1 text-xs">
                          {data.days.length} Nights
                        </span>
                      </div>

                      <div className="bg-muted/20 border-border/30 flex flex-col justify-center rounded-2xl border p-5">
                        <span className="text-muted-foreground mb-2 text-[10px] font-bold uppercase tracking-widest">
                          Activities
                        </span>
                        <span className="text-2xl font-bold">
                          {data.budgetSummary.activitiesCount} Experiences
                        </span>
                      </div>
                    </div>

                    {/* Flights */}
                    {data.flights.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-display flex items-center gap-2 text-xl font-bold">
                          <Plane className="text-primary size-5" /> Flights
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {data.flights.map((flight, idx: number) => (
                            <div
                              key={idx}
                              className="bg-card border-border/30 flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-sm md:flex-row md:items-center"
                            >
                              <div className="grid w-full grid-cols-2 items-center gap-4 md:grid-cols-4 md:gap-6">
                                <div className="col-span-2 md:col-span-1">
                                  <h4 className="text-base font-semibold">{flight.airline}</h4>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground mb-0.5 text-[10px] font-bold uppercase tracking-wider">
                                    Route
                                  </span>
                                  <span className="text-sm font-medium">
                                    {flight.route.split("•")[0]?.trim() || flight.route}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-muted-foreground mb-0.5 text-[10px] font-bold uppercase tracking-wider">
                                    Duration
                                  </span>
                                  <span className="text-sm font-medium">
                                    {flight.route.split("•")[1]?.trim() || "Varies"}
                                  </span>
                                </div>
                                <div className="flex flex-col items-start md:items-end">
                                  <span className="text-muted-foreground mb-0.5 text-[10px] font-bold uppercase tracking-wider">
                                    Price
                                  </span>
                                  <span className="text-foreground text-base font-bold">
                                    {flight.price}
                                  </span>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="w-full shrink-0 rounded-full font-semibold md:w-auto"
                              >
                                Book
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hotels */}
                    {data.hotels.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="font-display flex items-center gap-2 text-xl font-bold">
                          <Hotel className="text-primary size-5" /> Stays
                        </h3>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {data.hotels.map((hotel, idx: number) => (
                            <div
                              key={idx}
                              className="bg-card border-border/30 flex h-full flex-col justify-between rounded-2xl border p-4 shadow-sm"
                            >
                              <div>
                                <div className="mb-1 flex items-start justify-between gap-2">
                                  <h4 className="text-base font-semibold leading-tight">
                                    {hotel.name}
                                  </h4>
                                  {hotel.bestMatch && (
                                    <div className="bg-primary/10 text-primary flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                                      <Star className="size-3 fill-current" />
                                      <span>Best Match</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-muted-foreground mb-3 text-xs">
                                  {hotel.location}
                                </p>
                              </div>
                              {hotel.meta && (
                                <p className="text-foreground/80 line-clamp-2 text-sm">
                                  {truncateWords(hotel.meta, 20)}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Detailed Itinerary */}
                    <div className="space-y-6">
                      <h3 className="font-display flex items-center gap-2 pb-2 text-xl font-bold">
                        <MapPin className="text-primary size-5" /> Detailed Itinerary
                      </h3>

                      <div className="space-y-8">
                        {data.days.map((day, idx: number) => (
                          <div key={idx} className="flex flex-col">
                            <div className="border-border/20 mb-6 flex items-center gap-3 border-b pb-2">
                              <h4 className="text-lg font-bold">{day.date}</h4>
                              <div className="bg-border h-1 w-1 rounded-full" />
                              <span className="text-muted-foreground text-sm font-medium">
                                {day.title}
                              </span>
                            </div>

                            <div className="pl-2">
                              {day.activities.map((act, actIdx: number) => (
                                <ActivityCard
                                  key={actIdx}
                                  act={act}
                                  isLast={actIdx === day.activities.length - 1}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tips & Packing */}
                    <div className="border-border/30 grid grid-cols-1 gap-8 border-t pt-10 md:grid-cols-2">
                      <div className="space-y-4">
                        <h3 className="font-display flex items-center gap-2 text-lg font-bold">
                          <Sparkles className="text-primary size-4" /> Travel Tips
                        </h3>
                        <div className="flex flex-col gap-3">
                          {tipsList.map((sentence, idx) => (
                            <div
                              key={idx}
                              className="text-foreground/80 flex items-start gap-3 text-sm"
                            >
                              <Check className="text-primary mt-0.5 size-4 shrink-0" />
                              <span>{sentence.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {data.packingSuggestions && data.packingSuggestions.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="font-display flex items-center gap-2 text-lg font-bold">
                            <Navigation className="text-accent size-4" /> Packing List
                          </h3>
                          <div className="flex flex-col gap-3">
                            {data.packingSuggestions.map((item, idx: number) => (
                              <div
                                key={idx}
                                className="text-foreground/80 flex items-start gap-3 text-sm"
                              >
                                <Check className="text-accent mt-0.5 size-4 shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="mt-2 flex w-full gap-4">
              <Button
                variant="outline"
                className="border-border/50 hover:bg-muted/50 h-14 flex-1 rounded-xl text-base font-semibold"
              >
                Save Trip
              </Button>
              <Button
                variant="outline"
                className="border-border/50 hover:bg-muted/50 h-14 flex-1 rounded-xl text-base font-semibold"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
