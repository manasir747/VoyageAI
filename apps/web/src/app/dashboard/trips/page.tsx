"use client";

import React, { useEffect, useState } from "react";
import { Fade } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { InteractiveCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map, Calendar, Clock, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_itineraries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load trips");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prevTrips = [...trips];
    setTrips(trips.filter((t) => t.id !== id));
    toast.success("Trip deleted");

    try {
      const { error } = await supabase.from("saved_itineraries").delete().eq("id", id);
      if (error) throw error;
    } catch (error) {
      console.error(error);
      setTrips(prevTrips);
      toast.error("Failed to delete trip");
    }
  };

  const handleOpen = (id: string) => {
    router.push(`/dashboard/ai-planner?tripId=${id}`);
  };

  return (
    <Fade className="flex h-full flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">My Trips</h1>
        <p className="text-muted-foreground mt-2">Your saved AI-generated adventures.</p>
      </div>

      {isLoading ? (
        <div className="grid animate-pulse grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border-border/50 h-64 rounded-2xl border"></div>
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="border-border/50 bg-muted/5 mt-4 flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
          <div className="bg-primary/10 mb-6 rounded-full p-6">
            <Map className="text-primary size-12" />
          </div>
          <h2 className="font-display text-foreground mb-3 text-2xl font-bold tracking-tight">
            Your adventures start here.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            You haven't saved any trips yet. Generate your first AI-crafted itinerary to get
            started.
          </p>
          <Button
            onClick={() => router.push("/dashboard/ai-planner")}
            size="lg"
            className="shadow-glow rounded-full px-8 font-semibold"
          >
            Generate your first itinerary
          </Button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 xl:grid-cols-3">
          {trips.map((trip) => (
            <InteractiveCard
              key={trip.id}
              className="border-border/40 flex flex-col overflow-hidden p-0"
            >
              <div className="bg-gradient-hero relative flex h-32 flex-col justify-end p-5">
                <div className="absolute inset-0 bg-black/20" />
                <h3 className="font-display relative z-10 truncate text-2xl font-bold text-white shadow-sm">
                  {trip.destination}
                </h3>
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="text-muted-foreground flex flex-wrap gap-4 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    <span>{trip.itinerary?.days?.length || 0} Days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4" />
                    <span>
                      {new Date(trip.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                {trip.travel_style && (
                  <div>
                    <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                      {trip.travel_style}
                    </span>
                  </div>
                )}
                <div className="border-border/30 mt-auto flex items-center gap-3 border-t pt-5">
                  <Button
                    onClick={() => handleOpen(trip.id)}
                    className="flex-1 rounded-full font-semibold"
                    variant="default"
                  >
                    <ExternalLink className="mr-2 size-4" /> Open Trip
                  </Button>
                  <Button
                    onClick={() => handleDelete(trip.id)}
                    variant="outline"
                    size="icon"
                    className="text-destructive border-border/50 hover:bg-destructive/10 hover:text-destructive shrink-0 rounded-full"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </InteractiveCard>
          ))}
        </div>
      )}
    </Fade>
  );
}
