"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Fade, Stagger } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { InteractiveCard, GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/inputs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/overlays";
import {
  Map,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Search,
  MoreVertical,
  MapPin,
  Users,
  Wallet,
  PlaneTakeoff,
  Copy,
  Download,
  Edit2,
  Compass,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatCurrencyCompact } from "@/lib/format-currency";
import { cn } from "@/lib/utils";

const parseBudget = (val: any) => {
  if (!val) return 0;
  return parseInt(String(val).replace(/[^0-9]/g, "")) || 0;
};

const getTripStatus = (trip: any) => {
  if (!trip.itinerary || !trip.itinerary.days || trip.itinerary.days.length === 0) return "Draft";
  if (trip.start_date && new Date(trip.start_date) > new Date()) return "Upcoming";
  return "Completed";
};

const statusColors: Record<string, string> = {
  Upcoming: "bg-success/20 text-success border-success/30",
  Completed: "bg-muted text-muted-foreground border-border/50",
  Draft: "bg-warning/20 text-warning border-warning/30",
};

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toolbar state
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");

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

  const handleComingSoon = (action: string) => {
    toast.info(`${action} is coming soon!`);
  };

  // Memoized calculations
  const stats = useMemo(() => {
    let upcoming = 0;
    let completed = 0;
    let totalBudget = 0;
    const now = new Date();

    trips.forEach((trip) => {
      const budget = parseBudget(trip.budget || trip.itinerary?.budgetSummary?.total);
      totalBudget += budget;

      if (trip.start_date && new Date(trip.start_date) > now) {
        upcoming++;
      } else if (trip.start_date && new Date(trip.start_date) <= now) {
        completed++;
      }
    });

    return {
      total: trips.length,
      upcoming,
      completed,
      totalBudget,
    };
  }, [trips]);

  const filteredAndSortedTrips = useMemo(() => {
    let result = [...trips];

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          (t.destination || "").toLowerCase().includes(q) ||
          (t.travel_style || "").toLowerCase().includes(q),
      );
    }

    // Filter by status
    if (filter !== "All") {
      result = result.filter((t) => getTripStatus(t) === filter);
    }

    // Sort
    result.sort((a, b) => {
      if (sort === "Newest")
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sort === "Oldest")
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

      const budgetA = parseBudget(a.budget || a.itinerary?.budgetSummary?.total);
      const budgetB = parseBudget(b.budget || b.itinerary?.budgetSummary?.total);

      if (sort === "Highest Budget") return budgetB - budgetA;
      if (sort === "Lowest Budget") return budgetA - budgetB;

      if (sort === "Destination A-Z") {
        const destA = a.destination || "";
        const destB = b.destination || "";
        return destA.localeCompare(destB);
      }

      return 0;
    });

    return result;
  }, [trips, searchQuery, filter, sort]);

  return (
    <div className="flex w-full max-w-full flex-col gap-10 pb-20">
      <Fade>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground mt-2">
            Manage, organize and revisit all of your AI-generated journeys.
          </p>
        </div>
      </Fade>

      {/* SUMMARY CARDS */}
      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Fade>
          <GlassCard className="border-border/40 flex flex-col gap-2 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="text-primary size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Trips</span>
            </div>
            <div className="font-display text-3xl font-bold">{stats.total}</div>
          </GlassCard>
        </Fade>
        <Fade>
          <GlassCard className="border-border/40 flex flex-col gap-2 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <PlaneTakeoff className="text-accent size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Upcoming Trips</span>
            </div>
            <div className="font-display text-3xl font-bold">{stats.upcoming}</div>
          </GlassCard>
        </Fade>
        <Fade>
          <GlassCard className="border-border/40 flex flex-col gap-2 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <Map className="text-success size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Completed Trips</span>
            </div>
            <div className="font-display text-3xl font-bold">{stats.completed}</div>
          </GlassCard>
        </Fade>
        <Fade>
          <GlassCard className="border-border/40 flex flex-col gap-2 p-5">
            <div className="text-muted-foreground flex items-center gap-2">
              <Wallet className="text-warning size-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Budget</span>
            </div>
            <div className="font-display text-3xl font-bold">
              {formatCurrencyCompact(stats.totalBudget)}
            </div>
          </GlassCard>
        </Fade>
      </Stagger>

      {/* SEARCH & FILTER TOOLBAR */}
      <Fade className="bg-muted/30 border-border/40 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search trips..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs font-bold uppercase tracking-wider">
              Filter
            </span>
            <Select
              value={filter}
              onValueChange={setFilter}
              options={[
                { label: "All", value: "All" },
                { label: "Upcoming", value: "Upcoming" },
                { label: "Completed", value: "Completed" },
                { label: "Draft", value: "Draft" },
              ]}
              className="w-32"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-xs font-bold uppercase tracking-wider sm:block">
              Sort
            </span>
            <Select
              value={sort}
              onValueChange={setSort}
              options={[
                { label: "Newest", value: "Newest" },
                { label: "Oldest", value: "Oldest" },
                { label: "Highest Budget", value: "Highest Budget" },
                { label: "Lowest Budget", value: "Lowest Budget" },
                { label: "Destination A-Z", value: "Destination A-Z" },
              ]}
              className="w-40"
            />
          </div>
        </div>
      </Fade>

      {/* TRIPS GRID */}
      {isLoading ? (
        <div className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border-border/50 h-[400px] rounded-3xl border"></div>
          ))}
        </div>
      ) : filteredAndSortedTrips.length === 0 ? (
        <Fade className="border-border/50 bg-muted/5 flex min-h-[400px] flex-1 flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
          <div className="bg-primary/10 mb-6 rounded-full p-6">
            <Compass className="text-primary size-12" />
          </div>
          <h2 className="font-display text-foreground mb-3 text-2xl font-bold tracking-tight">
            No trips found.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            {trips.length === 0
              ? "Create your first AI itinerary and begin exploring the world."
              : "No trips match your current search and filter criteria."}
          </p>
          {trips.length === 0 ? (
            <Button
              onClick={() => router.push("/dashboard/ai-planner")}
              size="lg"
              className="shadow-glow rounded-full px-8 font-semibold"
            >
              Plan Your First Trip
            </Button>
          ) : (
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilter("All");
              }}
              size="lg"
              variant="outline"
              className="rounded-full px-8 font-semibold"
            >
              Clear Filters
            </Button>
          )}
        </Fade>
      ) : (
        <Stagger className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {filteredAndSortedTrips.map((trip) => {
            const status = getTripStatus(trip);
            const statusColorClass = statusColors[status] || "bg-muted text-muted-foreground";
            const imageUrl =
              trip.image_url ||
              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop";

            return (
              <InteractiveCard
                key={trip.id}
                className="border-border/40 flex h-full flex-col overflow-hidden p-0"
              >
                {/* Header Image Area */}
                <div className="relative aspect-[16/7] w-full overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={trip.destination}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Top Badges & Actions */}
                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
                        statusColorClass,
                      )}
                    >
                      {status}
                    </span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-black/20 text-white backdrop-blur-md hover:bg-black/40 hover:text-white"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleOpen(trip.id)}>
                          <ExternalLink className="mr-2 size-4" /> Open Trip
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleComingSoon("Edit trip")}>
                          <Edit2 className="mr-2 size-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleComingSoon("Duplicate trip")}>
                          <Copy className="mr-2 size-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleComingSoon("Export PDF")}>
                          <Download className="mr-2 size-4" /> Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(trip.id)}
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Title & Dates */}
                  <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1 text-white">
                    <h3 className="font-display truncate text-2xl font-bold tracking-tight">
                      {trip.destination}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-white/80">
                      <Calendar className="size-3.5" />
                      {trip.start_date
                        ? new Date(trip.start_date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No date set"}
                    </div>
                  </div>
                </div>

                {/* Details Area */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <Clock className="text-primary/70 size-4" />
                      <span>{trip.itinerary?.days?.length || 0} Days</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="text-accent/70 size-4" />
                      <span>{trip.travellers || "1 Traveler"}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <Wallet className="text-success/70 size-4" />
                      <span>
                        {formatCurrencyCompact(
                          parseBudget(trip.budget || trip.itinerary?.budgetSummary?.total),
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Travel Style Badge */}
                  {trip.travel_style && (
                    <div className="mt-4">
                      <span className="bg-primary/10 text-primary inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                        {trip.travel_style}
                      </span>
                    </div>
                  )}

                  {/* Itinerary Preview */}
                  {trip.itinerary?.days?.length > 0 && (
                    <div className="bg-muted/30 border-border/40 mt-5 flex flex-col gap-2 rounded-xl border p-4">
                      <h4 className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                        Itinerary Preview
                      </h4>
                      <div className="flex flex-col gap-2.5">
                        {trip.itinerary.days.slice(0, 2).map((day: any, idx: number) => (
                          <div key={idx} className="flex gap-2 text-sm">
                            <span className="text-muted-foreground shrink-0 font-semibold">
                              Day {idx + 1}:
                            </span>
                            <span className="text-foreground/90 truncate">
                              {day.theme || day.activities?.[0]?.title || "Explore destination"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </InteractiveCard>
            );
          })}
        </Stagger>
      )}
    </div>
  );
}
