import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Grid } from "@/components/layout/layout";
import { Card, GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/feedback";
import {
  Plane,
  Calendar,
  TrendingUp,
  MapPin,
  Wallet,
  ArrowRight,
  Plus,
  Map,
  Users,
  Clock,
  History,
  MoreHorizontal,
} from "lucide-react";
import { Fade, Stagger } from "@/components/motion/motion";
import Link from "next/link";

// Utility to extract country from destination string
const extractCountry = (destination: string) => {
  if (!destination) return "Unknown";
  const parts = destination.split(",");
  return parts[parts.length - 1].trim();
};

// Utility to parse numeric budget strings (e.g. "$48,500 USD (Estimated)")
const parseBudget = (budgetString: string | null | undefined): number => {
  if (!budgetString) return 0;
  const numbers = budgetString.replace(/,/g, "").match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  return parseInt(numbers[0], 10);
};

// Formatter for currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

// Formatter for relative date
const formatRelativeDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please sign in.</div>;
  }

  const userName =
    user.user_metadata?.full_name?.split(" ")[0] ||
    user.user_metadata?.display_name?.split(" ")[0] ||
    "Traveler";

  // Fetch real data
  const { data: trips } = await supabase
    .from("saved_itineraries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const validTrips = trips || [];

  // Calculate Metrics
  const totalTrips = validTrips.length;

  const upcomingTrips = validTrips.filter((t) => {
    if (!t.start_date) return false;
    return new Date(t.start_date) > new Date();
  }).length;

  const uniqueCountries = new Set(validTrips.map((t) => extractCountry(t.destination))).size;

  let totalBudget = 0;
  let totalTravelersCount = 0;

  validTrips.forEach((t) => {
    // Attempt to extract budget from the JSON
    const itineraryBudgetStr = t.itinerary?.budgetSummary?.total;
    const parsedAmount = parseBudget(itineraryBudgetStr);
    totalBudget += parsedAmount;

    // Parse travelers count (e.g. "4", "2 adults", "Family of 4")
    const travMatch = t.travellers?.match(/\d+/);
    if (travMatch) {
      totalTravelersCount += parseInt(travMatch[0], 10);
    } else {
      totalTravelersCount += 1; // fallback
    }
  });

  const avgBudgetPerTrip = totalTrips > 0 ? totalBudget / totalTrips : 0;
  const avgBudgetPerTraveler = totalTravelersCount > 0 ? totalBudget / totalTravelersCount : 0;

  // Recent Activity Timeline
  const recentActivity = validTrips
    .slice(0, 5)
    .map((t) => {
      const isUpdated = t.updated_at && t.updated_at !== t.created_at;
      return {
        id: t.id,
        destination: extractCountry(t.destination),
        action: isUpdated ? "updated" : "created",
        date: t.updated_at || t.created_at,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Recent Trips (Top 3)
  const recentTrips = validTrips.slice(0, 3);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* SECTION 1: Welcome Hero */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          {" • "} Here's what's happening with your travel plans today.
        </p>
      </div>

      {validTrips.length === 0 ? (
        /* SECTION 7: Empty State */
        <Fade>
          <EmptyState
            icon={<Plane className="text-primary size-8" />}
            title="Ready for your next adventure?"
            description="You don't have any saved trips yet. Create your first AI-powered itinerary and start exploring the world."
            action={
              <Link href="/dashboard/ai-planner">
                <Button className="shadow-glow mt-4 rounded-full px-8">
                  <Plus className="mr-2 size-4" />
                  Plan Your First Trip
                </Button>
              </Link>
            }
          />
        </Fade>
      ) : (
        <Stagger className="flex flex-col gap-6">
          {/* SECTION 2: Dynamic Stats */}
          <Grid columns={12} className="gap-6">
            <Fade className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Card className="border-border/70 shadow-soft flex h-full flex-col p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-primary/20 text-primary rounded-lg p-2">
                    <Map className="size-5" />
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium">Total Trips</h3>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{totalTrips}</p>
              </Card>
            </Fade>

            <Fade className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Card className="border-border/70 shadow-soft flex h-full flex-col p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-accent/20 text-accent rounded-lg p-2">
                    <Plane className="size-5" />
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium">Upcoming Trips</h3>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{upcomingTrips}</p>
              </Card>
            </Fade>

            <Fade className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Card className="border-border/70 shadow-soft flex h-full flex-col p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-success/20 text-success rounded-lg p-2">
                    <MapPin className="size-5" />
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium">Countries Planned</h3>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">{uniqueCountries}</p>
              </Card>
            </Fade>

            <Fade className="col-span-12 sm:col-span-6 lg:col-span-3">
              <Card className="border-border/70 shadow-soft flex h-full flex-col p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="bg-warning/20 text-warning-foreground rounded-lg p-2">
                    <Wallet className="size-5" />
                  </div>
                  <h3 className="text-muted-foreground text-sm font-medium">
                    Total Planned Budget
                  </h3>
                </div>
                <p className="mt-2 text-3xl font-bold tracking-tight">
                  {formatCurrency(totalBudget)}
                </p>
              </Card>
            </Fade>
          </Grid>

          <Grid columns={12} className="gap-6">
            {/* Left Column: Recent Trips */}
            <Fade className="col-span-12 flex flex-col gap-6 lg:col-span-8">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">Recent Trips</h2>
                <Link href="/dashboard/trips">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all <ArrowRight className="ml-1 size-4" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {recentTrips.map((trip) => (
                  <GlassCard
                    key={trip.id}
                    className="border-border/50 hover:bg-muted/10 group flex flex-col items-center gap-4 p-4 transition-colors sm:flex-row"
                  >
                    <div className="from-primary/20 to-accent/20 border-border/30 flex size-full shrink-0 items-center justify-center rounded-lg border bg-gradient-to-br sm:size-24">
                      <MapPin className="text-primary/50 size-8" />
                    </div>
                    <div className="flex w-full flex-1 flex-col gap-1 text-center sm:text-left">
                      <h3 className="line-clamp-1 text-lg font-semibold">{trip.destination}</h3>
                      <div className="text-muted-foreground mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm sm:justify-start">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5" />
                          <span>
                            {new Date(trip.start_date).toLocaleDateString()} -{" "}
                            {new Date(trip.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          <span>{trip.travellers}</span>
                        </div>
                        <div className="flex hidden items-center gap-1.5 md:flex">
                          <TrendingUp className="size-3.5" />
                          <span>{trip.travel_style}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 w-full shrink-0 sm:mt-0 sm:w-auto">
                      <Link href={`/dashboard/ai-planner?tripId=${trip.id}`}>
                        <Button
                          variant="outline"
                          className="border-border/70 bg-background/50 w-full backdrop-blur-md sm:w-auto"
                        >
                          View Trip
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </Fade>

            {/* Right Column: Budget, Activity, Actions */}
            <Fade className="col-span-12 flex flex-col gap-6 lg:col-span-4">
              {/* Budget Overview */}
              <Card className="border-border/70 shadow-soft p-5">
                <h3 className="font-display mb-4 flex items-center gap-2 text-lg font-bold">
                  <Wallet className="text-muted-foreground size-5" />
                  Budget Overview
                </h3>
                <div className="space-y-4">
                  <div className="border-border/40 flex items-center justify-between border-b pb-3">
                    <span className="text-muted-foreground text-sm">Total Planned</span>
                    <span className="text-foreground font-semibold">
                      {formatCurrency(totalBudget)}
                    </span>
                  </div>
                  <div className="border-border/40 flex items-center justify-between border-b pb-3">
                    <span className="text-muted-foreground text-sm">Avg per Trip</span>
                    <span className="text-foreground font-semibold">
                      {formatCurrency(avgBudgetPerTrip)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">Avg per Traveler</span>
                    <span className="text-foreground font-semibold">
                      {formatCurrency(avgBudgetPerTraveler)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border/70 shadow-soft p-5">
                <h3 className="font-display mb-4 flex items-center gap-2 text-lg font-bold">
                  <History className="text-muted-foreground size-5" />
                  Recent Activity
                </h3>
                <div className="border-border/40 relative ml-2 mt-2 space-y-6 border-l-2 pl-2">
                  {recentActivity.map((activity, index) => (
                    <div key={`${activity.id}-${index}`} className="relative">
                      <div className="bg-primary ring-background absolute -left-[13px] mt-1 size-2 rounded-full ring-4" />
                      <div className="pl-4">
                        <p className="text-sm font-medium">
                          Trip to {activity.destination}{" "}
                          <span className="text-primary">{activity.action}</span>
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs">
                          {formatRelativeDate(activity.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <div className="text-muted-foreground pl-4 text-sm">No recent activity.</div>
                  )}
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className="border-border/70 shadow-soft p-5">
                <h3 className="font-display mb-4 text-lg font-bold">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/dashboard/ai-planner" className="w-full">
                    <Button
                      variant="outline"
                      className="border-border/50 bg-muted/20 hover:bg-muted/50 h-auto w-full flex-col items-start justify-start gap-2 px-3 py-3"
                    >
                      <Plus className="text-primary size-5" />
                      <span className="text-xs font-medium">Plan New Trip</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/destinations" className="w-full">
                    <Button
                      variant="outline"
                      className="border-border/50 bg-muted/20 hover:bg-muted/50 h-auto w-full flex-col items-start justify-start gap-2 px-3 py-3"
                    >
                      <Map className="text-accent size-5" />
                      <span className="text-xs font-medium">Browse Places</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/trips" className="w-full">
                    <Button
                      variant="outline"
                      className="border-border/50 bg-muted/20 hover:bg-muted/50 h-auto w-full flex-col items-start justify-start gap-2 px-3 py-3"
                    >
                      <Plane className="text-success size-5" />
                      <span className="text-xs font-medium">Saved Trips</span>
                    </Button>
                  </Link>
                  <Link href="/dashboard/settings" className="w-full">
                    <Button
                      variant="outline"
                      className="border-border/50 bg-muted/20 hover:bg-muted/50 h-auto w-full flex-col items-start justify-start gap-2 px-3 py-3"
                    >
                      <MoreHorizontal className="text-warning-foreground size-5" />
                      <span className="text-xs font-medium">Settings</span>
                    </Button>
                  </Link>
                </div>
              </Card>
            </Fade>
          </Grid>
        </Stagger>
      )}
    </div>
  );
}
