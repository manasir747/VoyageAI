"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Map, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/card";

export function PlannerLoading() {
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
        className="space-y-3"
      >
        <h3 className="font-display from-primary to-accent bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Crafting Your Perfect Itinerary
        </h3>

        <div className="h-6 overflow-hidden">
          <motion.div
            animate={{ y: [0, -24, -48, -72, -96] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="text-muted-foreground flex flex-col"
          >
            <span className="h-6">Analyzing your preferences...</span>
            <span className="h-6">Finding the best local spots...</span>
            <span className="h-6">Optimizing travel routes...</span>
            <span className="h-6">Balancing your budget...</span>
            <span className="h-6">Finalizing the magical details...</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
