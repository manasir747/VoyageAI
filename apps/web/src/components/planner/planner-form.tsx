"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/inputs";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Food",
  "Nature",
  "Shopping",
  "Museums",
  "Beaches",
  "Hiking",
  "Nightlife",
  "Photography",
];

const TRAVEL_STYLES = [
  { label: "Luxury", value: "luxury" },
  { label: "Budget", value: "budget" },
  { label: "Adventure", value: "adventure" },
  { label: "Family", value: "family" },
  { label: "Solo", value: "solo" },
  { label: "Business", value: "business" },
];
import { TripPlanRequest } from "@/types/planner";

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
    // Validate form (very basic validation for placeholder)
    if (!destination || !startDate || !endDate) {
      alert("Please fill in destination and dates.");
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-4">
        <div>
          <label className="text-foreground mb-1.5 block text-sm font-medium">Destination</label>
          <Input
            placeholder="Where do you want to go? (e.g. Tokyo, Japan)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">Travellers</label>
            <Input
              type="number"
              placeholder="e.g. 2"
              min="1"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
            />
          </div>
          <div>
            <label className="text-foreground mb-1.5 block text-sm font-medium">
              Total Budget ($)
            </label>
            <Input
              type="number"
              placeholder="e.g. 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-foreground mb-1.5 block text-sm font-medium">Travel Style</label>
          <Select
            options={TRAVEL_STYLES}
            value={style}
            onValueChange={setStyle}
            placeholder="Select a travel style"
          />
        </div>

        <div>
          <label className="text-foreground mb-2.5 block text-sm font-medium">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((interest) => {
              const active = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground border-primary shadow-glow"
                      : "bg-muted/40 text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground",
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
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isGenerating}
        className="from-primary to-accent shadow-glow mt-4 h-12 w-full border-none bg-gradient-to-r font-semibold transition-opacity hover:opacity-90"
      >
        {isGenerating ? (
          <span className="flex items-center gap-2">
            <span className="relative flex size-3">
              <span className="bg-primary-foreground absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
              <span className="bg-primary-foreground relative inline-flex size-3 rounded-full"></span>
            </span>
            Generating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="size-5" />
            Generate Itinerary
          </span>
        )}
      </Button>
    </form>
  );
}
