"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/inputs";
import { GlassCard, InteractiveCard } from "@/components/ui/card";
import {
  Sparkles,
  MapPin,
  Calendar as CalendarIcon,
  Users,
  Wallet,
  Compass,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TripPlanRequest } from "@/types/planner";

const INTERESTS = [
  "Food & Dining",
  "Nature & Outdoors",
  "Shopping",
  "Museums & Art",
  "Beaches & Relaxation",
  "Hiking",
  "Nightlife",
  "Photography",
  "History",
  "Culture",
];

const TRAVEL_STYLES = [
  { label: "Luxury", value: "luxury", description: "5-star hotels & fine dining" },
  { label: "Budget", value: "budget", description: "Hostels & street food" },
  { label: "Adventure", value: "adventure", description: "Action & exploration" },
  { label: "Family", value: "family", description: "Kid-friendly activities" },
  { label: "Solo", value: "solo", description: "Independent travel" },
  { label: "Business", value: "business", description: "Work & networking" },
];

export function PlannerForm({
  onSubmit,
  isGenerating,
}: {
  onSubmit: (data: TripPlanRequest) => void;
  isGenerating: boolean;
}) {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travellers, setTravellers] = useState("");
  const [budget, setBudget] = useState("");
  const [style, setStyle] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) {
      alert("Please fill in the destination and dates.");
      return;
    }
    onSubmit({
      destination,
      startDate,
      endDate,
      travellers,
      budget,
      style,
      interests,
      notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* SECTION 1: Where & When */}
      <GlassCard className="border-border/40 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <MapPin className="text-primary size-5" />
          <h3 className="font-display text-xl font-bold">Where & When</h3>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">Destination</label>
            <div className="relative">
              <MapPin className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                placeholder="e.g. Tokyo, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="pl-10 text-base shadow-sm"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-foreground mb-1.5 block text-sm font-medium">Start Date</label>
              <div className="relative">
                <CalendarIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="pl-10 shadow-sm"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-foreground mb-1.5 block text-sm font-medium">End Date</label>
              <div className="relative">
                <CalendarIcon className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="pl-10 shadow-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 2: Travel Details */}
      <GlassCard className="border-border/40 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Users className="text-accent size-5" />
          <h3 className="font-display text-xl font-bold">Travel Details</h3>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">Travellers</label>
            <div className="relative">
              <Users className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="number"
                placeholder="e.g. 2"
                min="1"
                value={travellers}
                onChange={(e) => setTravellers(e.target.value)}
                className="pl-10 shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">Total Budget</label>
            <div className="relative">
              <Wallet className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="pl-10 shadow-sm"
              />
              <span className="text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium">
                USD
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* SECTION 3: Travel Style */}
      <GlassCard className="border-border/40 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Compass className="text-success size-5" />
          <h3 className="font-display text-xl font-bold">Travel Style</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {TRAVEL_STYLES.map((ts) => {
            const active = style === ts.value;
            return (
              <InteractiveCard
                key={ts.value}
                onClick={() => setStyle(ts.value)}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-1 border-2 p-4 text-center transition-all duration-200",
                  active
                    ? "border-success bg-success/10 shadow-sm"
                    : "border-border/40 hover:border-success/50",
                )}
              >
                <span
                  className={cn(
                    "text-base font-bold",
                    active ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {ts.label}
                </span>
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">
                  {ts.description}
                </span>
              </InteractiveCard>
            );
          })}
        </div>
      </GlassCard>

      {/* SECTION 4: Preferences */}
      <GlassCard className="border-border/40 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-2">
          <Heart className="text-warning size-5" />
          <h3 className="font-display text-xl font-bold">Interests & Preferences</h3>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <label className="text-foreground mb-3 block text-sm font-medium">
              Select your interests
            </label>
            <div className="flex flex-wrap gap-2.5">
              {INTERESTS.map((interest) => {
                const active = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200",
                      active
                        ? "bg-warning text-warning-foreground border-warning shadow-md"
                        : "bg-muted/30 text-muted-foreground border-border/60 hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">
              Additional Notes
            </label>
            <Textarea
              placeholder="Any dietary restrictions, must-see places, or specific vibes you're looking for?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="shadow-sm"
            />
          </div>
        </div>
      </GlassCard>

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        size="lg"
        disabled={isGenerating}
        className="from-primary to-accent shadow-glow relative mt-4 h-16 w-full overflow-hidden border-none bg-gradient-to-r text-lg font-bold transition-transform hover:scale-[1.02]"
      >
        {isGenerating ? (
          <span className="flex items-center gap-3">
            <span className="relative flex size-4">
              <span className="bg-primary-foreground absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary-foreground relative inline-flex size-4 rounded-full"></span>
            </span>
            Generating your dream trip...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="size-6" />
            Generate Itinerary
          </span>
        )}
      </Button>
    </form>
  );
}
