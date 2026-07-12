"use client";

import React, { useState, useEffect, useRef } from "react";
import { Fade } from "@/components/motion/motion";
import { PlannerForm } from "@/components/planner/planner-form";
import { PlannerLoading } from "@/components/planner/planner-loading";
import { ItineraryResult } from "@/components/planner/itinerary-result";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { TripPlanRequest, TripPlanResponse } from "@/types/planner";
import { Button } from "@/components/ui/button";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { toast } from "sonner";

type PlannerStatus = "idle" | "loading" | "success" | "error";

export default function AIPlannerPage() {
  const [status, setStatus] = useState<PlannerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<TripPlanResponse | null>(null);
  const [lastRequest, setLastRequest] = useState<TripPlanRequest | null>(null);

  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId");
  const supabase = createClient();
  const router = useRouter();

  const resultsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "success" && resultsScrollRef.current) {
      resultsScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [status]);

  useEffect(() => {
    if (tripId) {
      loadSavedTrip(tripId);
    }
  }, [tripId]);

  const loadSavedTrip = async (id: string) => {
    setStatus("loading");
    try {
      const { data, error } = await supabase
        .from("saved_itineraries")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;

      setItinerary(data.itinerary);
      setLastRequest({
        destination: data.destination,
        startDate: data.start_date,
        endDate: data.end_date,
        travellers: data.travellers,
        style: data.travel_style,
        interests: data.interests || [],
        budget: data.budget,
        notes: data.prompt,
      });
      setStatus("success");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to load saved trip");
      setStatus("error");
      setErrorMsg("Could not load your saved trip. It may have been deleted.");
    }
  };

  const handleGenerate = async (data: TripPlanRequest) => {
    setStatus("loading");
    setErrorMsg(null);
    setLastRequest(data);

    try {
      const response = await apiClient<TripPlanResponse>("/api/plan-trip", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setItinerary(response);
      setStatus("success");

      if (window.innerWidth < 1024) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to generate itinerary. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <Fade className="mb-6 shrink-0">
        <h1 className="font-display text-3xl font-bold tracking-tight">AI Trip Planner</h1>
        <p className="text-muted-foreground mt-2">
          Tell us about your dream trip, and our AI will craft the perfect itinerary in seconds.
        </p>
      </Fade>

      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-hidden lg:flex-row">
        {/* Left Column: Form */}
        <Fade className="custom-scrollbar h-full w-full shrink-0 overflow-y-auto pb-8 pr-2 lg:w-[400px] xl:w-[450px]">
          <div className="bg-card border-border/70 shadow-soft rounded-3xl border p-6">
            <PlannerForm onSubmit={handleGenerate} isGenerating={status === "loading"} />
          </div>
        </Fade>

        {/* Right Column: Output */}
        <div
          ref={resultsScrollRef}
          className="custom-scrollbar relative h-full w-full flex-1 overflow-y-auto pb-8 pl-2 pr-2"
        >
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="border-border/60 bg-muted/10 flex h-full w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center"
              >
                <div className="bg-muted text-muted-foreground mb-4 rounded-full p-4">
                  <Compass className="size-8" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Ready to explore?</h3>
                <p className="text-muted-foreground max-w-sm">
                  Fill out your preferences on the left and hit generate to see your magical
                  itinerary appear here.
                </p>
              </motion.div>
            )}

            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <PlannerLoading />
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="border-border/40 bg-card/50 flex h-full w-full flex-col items-center justify-center rounded-3xl border p-8 text-center shadow-sm"
              >
                <div className="relative mb-6">
                  <div className="bg-destructive/10 absolute inset-0 scale-150 rounded-full blur-xl" />
                  <div className="bg-background border-border/50 shadow-soft relative z-10 rounded-full border p-6">
                    <span className="text-5xl">🧭</span>
                  </div>
                </div>
                <h3 className="text-foreground font-display mb-2 text-2xl font-bold tracking-tight">
                  Couldn't generate your itinerary
                </h3>
                <p className="text-muted-foreground mb-8 max-w-sm text-base">
                  {errorMsg ||
                    "We encountered an unexpected error while crafting your trip. Please try again."}
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    className="rounded-full px-6"
                    onClick={() => setStatus("idle")}
                  >
                    Back
                  </Button>
                  <Button
                    variant="default"
                    className="shadow-glow rounded-full px-6"
                    onClick={() => lastRequest && handleGenerate(lastRequest)}
                  >
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}

            {status === "success" && itinerary && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="h-full w-full"
              >
                <ItineraryResult data={itinerary} request={lastRequest!} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
