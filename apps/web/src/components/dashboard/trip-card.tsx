"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Users, TrendingUp, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDestinationImage } from "@/hooks/use-destination-image";

const extractCountry = (destination: string) => {
  if (!destination) return "Unknown";
  const parts = destination.split(",");
  return parts[parts.length - 1].trim();
};

export function TripCard({ trip }: { trip: any }) {
  const imageUrl = useDestinationImage(trip.id, extractCountry(trip.destination), trip.image_url);

  return (
    <div className="bg-muted/10 border-border/40 hover:bg-muted/20 flex flex-col items-center gap-5 rounded-2xl border p-4 transition-colors sm:flex-row">
      {/* Thumbnail */}
      <div className="bg-muted relative size-[96px] shrink-0 overflow-hidden rounded-xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={trip.destination}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="bg-muted/50 flex h-full w-full items-center justify-center">
            <ImageIcon className="text-muted-foreground/50 size-8" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center px-1 py-1">
        <h3 className="text-foreground mb-2.5 truncate text-base font-semibold">
          {trip.destination}
        </h3>
        <div className="text-muted-foreground flex items-center gap-5 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>
              {new Date(trip.start_date).toLocaleDateString()} -{" "}
              {new Date(trip.end_date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="size-4" />
            <span>{trip.travellers}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4" />
            <span className="capitalize">{trip.travel_style || "Standard"}</span>
          </div>
        </div>
      </div>

      {/* Action */}
      <div className="mt-3 w-full shrink-0 sm:mt-0 sm:w-auto">
        <Link href={`/dashboard/ai-planner?tripId=${trip.id}`}>
          <Button
            variant="outline"
            className="border-border/60 hover:bg-muted/50 h-10 w-full rounded-[8px] bg-transparent px-6 text-[13px] font-medium sm:w-auto"
          >
            View Trip
          </Button>
        </Link>
      </div>
    </div>
  );
}
