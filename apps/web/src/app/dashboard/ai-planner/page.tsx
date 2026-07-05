"use client";

import React, { useState } from "react";
import { Fade } from "@/components/motion/motion";
import { PlannerForm } from "@/components/planner/planner-form";
import { PlannerLoading } from "@/components/planner/planner-loading";
import { ItineraryResult } from "@/components/planner/itinerary-result";
import { AnimatePresence, motion } from "framer-motion";
import { Compass, AlertTriangle } from "lucide-react";
import { apiClient } from "@/lib/api";
import { TripPlanRequest, TripPlanResponse } from "@/types/planner";
import { Button } from "@/components/ui/button";

type PlannerStatus = "idle" | "loading" | "success" | "error";

export default function AIPlannerPage() {
  const [status, setStatus] = useState<PlannerStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [itinerary, setItinerary] = useState<TripPlanResponse | null>(null);

  const handleGenerate = async (data: TripPlanRequest) => {
    setStatus("loading");
    setErrorMsg(null);

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
        <div className="custom-scrollbar relative h-full w-full flex-1 overflow-y-auto pb-8 pl-2 pr-2">
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
                className="border-destructive/20 bg-destructive/5 flex h-full w-full flex-col items-center justify-center rounded-3xl border-2 p-8 text-center"
              >
                <div className="bg-destructive/10 text-destructive mb-4 rounded-full p-4">
                  <AlertTriangle className="size-8" />
                </div>
                <h3 className="text-destructive mb-2 text-xl font-semibold">Generation Failed</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">{errorMsg}</p>
                <Button variant="outline" onClick={() => setStatus("idle")}>
                  Try Again
                </Button>
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
                <ItineraryResult data={itinerary} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
