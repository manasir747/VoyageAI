"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Map, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/card";

const LOADING_MESSAGES = [
  "✈ Finding the best flights...",
  "🏨 Searching accommodations...",
  "🍜 Discovering restaurants...",
  "🗺 Planning your daily itinerary...",
  "🎒 Preparing packing list...",
  "✨ Finalizing your trip...",
];

export function PlannerLoading() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full min-h-[500px] w-full flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="from-primary to-accent absolute -inset-8 rounded-full bg-gradient-to-r opacity-20 blur-2xl"
        />

        <GlassCard className="border-primary/20 shadow-glow bg-background/50 relative z-10 flex size-24 items-center justify-center rounded-full">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="text-primary size-10" />
          </motion.div>
        </GlassCard>

        {/* Orbiting elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 z-20 origin-center"
        >
          <div className="bg-accent/20 text-accent border-accent/30 shadow-soft absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border p-2 backdrop-blur-md">
            <Map className="size-4" />
          </div>
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 z-20 origin-center"
        >
          <div className="bg-success/20 text-success border-success/30 shadow-soft absolute -right-4 top-1/2 -translate-y-1/2 rounded-full border p-2 backdrop-blur-md">
            <MapPin className="size-4" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <h3 className="font-display from-primary to-accent bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Crafting Your Perfect Itinerary
        </h3>

        <div className="relative flex h-6 w-full min-w-[250px] justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-muted-foreground absolute w-full text-center font-medium"
            >
              {LOADING_MESSAGES[messageIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
