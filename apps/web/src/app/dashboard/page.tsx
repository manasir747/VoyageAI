import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  History,
  Heart,
  Compass,
} from "lucide-react";
import { Fade, Stagger } from "@/components/motion/motion";
import Link from "next/link";
import { formatCurrency, formatCurrencyCompact } from "@/lib/format-currency";
import { TripCard } from "@/components/dashboard/trip-card";
import { DoughnutChart } from "@/components/dashboard/doughnut-chart";

const extractCountry = (destination: string) => {
  if (!destination) return "Unknown";
  const parts = destination.split(",");
  return parts[parts.length - 1].trim();
};

const parseBudget = (budgetString: string | null | undefined): number => {
  if (!budgetString) return 0;
  const numbers = budgetString.replace(/,/g, "").match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  return parseInt(numbers[0], 10);
};

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
    "Abu";

  const { data: trips } = await supabase
    .from("saved_itineraries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const validTrips = trips || [];

  const totalTrips = validTrips.length;

  const upcomingTrips = validTrips.filter((t) => {
    if (!t.start_date) return false;
    return new Date(t.start_date) > new Date();
  }).length;

  const uniqueCountries = new Set(validTrips.map((t) => extractCountry(t.destination))).size;

  let totalBudget = 0;
  let totalTravelersCount = 0;

  validTrips.forEach((t) => {
    const itineraryBudgetStr = t.itinerary?.budgetSummary?.total;
    const parsedAmount = parseBudget(itineraryBudgetStr);
    totalBudget += parsedAmount;

    const travMatch = t.travellers?.match(/\d+/);
    if (travMatch) {
      totalTravelersCount += parseInt(travMatch[0], 10);
    } else {
      totalTravelersCount += 1;
    }
  });

  const avgBudgetPerTrip = totalTrips > 0 ? totalBudget / totalTrips : 0;
  const avgBudgetPerTraveler = totalTravelersCount > 0 ? totalBudget / totalTravelersCount : 0;

  // Hardcoded hex colors for standard HTML/SVG so Recharts renders correctly without black slices.
  const chartData = [
    { label: "Flights", value: 40, color: "#8b5cf6" }, // Purple
    { label: "Hotels", value: 35, color: "#3b82f6" }, // Blue
    { label: "Food", value: 15, color: "#22c55e" }, // Green
    { label: "Activities", value: 10, color: "#f97316" }, // Orange
  ];

  const recentActivity = validTrips
    .slice(0, 3)
    .map((t, i) => {
      const isUpdated = t.updated_at && t.updated_at !== t.created_at;
      return {
        id: t.id,
        destination: extractCountry(t.destination),
        action: isUpdated ? "updated" : "created",
        date: t.updated_at || t.created_at,
        iconColor: i === 0 ? "#8b5cf6" : "#64748b", // primary purple or slate
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const recentTrips = validTrips.slice(0, 3);

  return (
    <div className="flex w-full max-w-full flex-col gap-8 pb-16">
      {/* WELCOME */}
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          {" • "} Here's what's happening with your travel plans today.
        </p>
      </div>

      <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-[60%_40%]">
        {/* LEFT COLUMN */}
        <Fade className="flex min-w-0 flex-col gap-6">
          {/* STAT CARDS - 4 in a row */}
          <div className="grid w-full grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="border-border/60 bg-card flex h-[130px] flex-col justify-between rounded-2xl p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="bg-primary/10 flex shrink-0 items-center justify-center rounded-md p-1.5">
                  <Map className="text-primary size-4" />
                </div>
                <span className="text-muted-foreground text-sm font-medium leading-tight">
                  Total Trips
                </span>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-bold">{totalTrips}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-tight">All saved trips</p>
              </div>
            </Card>

            <Card className="border-border/60 bg-card flex h-[130px] flex-col justify-between rounded-2xl p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="bg-accent/10 flex shrink-0 items-center justify-center rounded-md p-1.5">
                  <Plane className="text-accent size-4" />
                </div>
                <span className="text-muted-foreground text-sm font-medium leading-tight">
                  Upcoming Trips
                </span>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-bold">{upcomingTrips}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-tight">
                  Trips in next 30 days
                </p>
              </div>
            </Card>

            <Card className="border-border/60 bg-card flex h-[130px] flex-col justify-between rounded-2xl p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="bg-success/10 flex shrink-0 items-center justify-center rounded-md p-1.5">
                  <MapPin className="text-success size-4" />
                </div>
                <span className="text-muted-foreground text-sm font-medium leading-tight">
                  Countries Planned
                </span>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-bold">{uniqueCountries}</p>
                <p className="text-muted-foreground mt-1 text-xs leading-tight">Unique countries</p>
              </div>
            </Card>

            <Card className="border-border/60 bg-card flex h-[130px] flex-col justify-between rounded-2xl p-5">
              <div className="mb-1 flex items-center gap-2">
                <div className="bg-warning/10 flex shrink-0 items-center justify-center rounded-md p-1.5">
                  <Wallet className="text-warning-foreground size-4" />
                </div>
                <span className="text-muted-foreground text-sm font-medium leading-tight">
                  Total Budget
                </span>
              </div>
              <div className="mt-auto">
                <p className="text-3xl font-bold leading-none" title={formatCurrency(totalBudget)}>
                  {formatCurrencyCompact(totalBudget)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs leading-tight">Across all trips</p>
              </div>
            </Card>
          </div>

          {/* RECENT TRIPS */}
          <Card className="border-border/60 bg-card flex flex-col rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent Trips</h2>
              <Link href="/dashboard/trips">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 h-auto p-0 text-xs hover:bg-transparent"
                >
                  View all <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {recentTrips.length > 0 ? (
                recentTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
              ) : (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  No recent trips available.
                </div>
              )}
            </div>
          </Card>

          {/* RECENT ACTIVITY */}
          <Card className="border-border/60 bg-card rounded-2xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recent Activity</h2>
              <Link href="/dashboard/trips">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 h-auto p-0 text-xs hover:bg-transparent"
                >
                  View all <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </Link>
            </div>

            <div className="relative pl-[11px]">
              {/* Timeline vertical line */}
              <div className="bg-border absolute bottom-3 left-[15px] top-3 w-px" />
              <div className="space-y-6">
                {recentActivity.map((activity, index) => (
                  <div key={`${activity.id}-${index}`} className="relative flex flex-col pl-8">
                    {/* Timeline dot */}
                    <div
                      className="ring-card absolute left-[0.5px] top-1.5 z-10 size-2.5 rounded-full ring-4"
                      style={{ backgroundColor: activity.iconColor }}
                    />
                    <p className="text-sm font-medium">
                      Trip to {activity.destination}{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {formatRelativeDate(activity.date)}
                    </p>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <div className="text-muted-foreground py-2 pl-6 text-sm">No recent activity.</div>
                )}
              </div>
            </div>
          </Card>
        </Fade>

        {/* RIGHT COLUMN */}
        <Fade className="flex min-w-0 flex-col gap-6">
          {/* BUDGET OVERVIEW */}
          <Card className="border-border/60 bg-card rounded-2xl p-6">
            <h2 className="mb-6 text-base font-semibold">Budget Overview</h2>

            <div className="flex flex-col items-center justify-between gap-6 xl:flex-row">
              <div className="flex w-full flex-col gap-5 xl:w-auto">
                <div className="flex justify-between gap-1 xl:flex-col">
                  <span className="text-muted-foreground text-sm">Total Planned</span>
                  <span className="text-sm font-semibold">{formatCurrency(totalBudget)}</span>
                </div>
                <div className="flex justify-between gap-1 xl:flex-col">
                  <span className="text-muted-foreground text-sm">Avg per Trip</span>
                  <span className="text-sm font-semibold">{formatCurrency(avgBudgetPerTrip)}</span>
                </div>
                <div className="flex justify-between gap-1 xl:flex-col">
                  <span className="text-muted-foreground text-sm">Avg per Traveler</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(avgBudgetPerTraveler)}
                  </span>
                </div>
              </div>

              {totalBudget > 0 && (
                <div className="flex flex-col items-center gap-6 sm:flex-row xl:flex-row xl:gap-8">
                  <div className="size-[140px]">
                    <DoughnutChart data={chartData} />
                  </div>

                  <div className="flex flex-col gap-3">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex min-w-[80px] items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: d.color }}
                          />
                          <span className="text-muted-foreground text-xs">{d.label}</span>
                        </div>
                        <span className="text-muted-foreground text-xs font-medium">
                          {d.value}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* QUICK ACTIONS */}
          <Card className="border-border/60 bg-card rounded-2xl p-6">
            <h2 className="mb-6 text-base font-semibold">Quick Actions</h2>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/ai-planner" className="w-full min-w-[170px]">
                <Button
                  variant="outline"
                  className="border-border/50 bg-muted/10 hover:bg-muted/30 h-[150px] w-full flex-col p-[20px]"
                >
                  <Plus className="text-primary mb-3 size-7" strokeWidth={1.5} />
                  <span className="text-foreground mb-1 whitespace-normal text-sm font-semibold">
                    Plan New Trip
                  </span>
                  <span className="text-muted-foreground whitespace-normal text-center text-xs font-normal">
                    Create a new itinerary
                  </span>
                </Button>
              </Link>

              <Link href="/dashboard/destinations" className="w-full min-w-[170px]">
                <Button
                  variant="outline"
                  className="border-border/50 bg-muted/10 hover:bg-muted/30 h-[150px] w-full flex-col p-[20px]"
                >
                  <Map className="text-primary mb-3 size-7" strokeWidth={1.5} />
                  <span className="text-foreground mb-1 whitespace-normal text-sm font-semibold">
                    Browse Destinations
                  </span>
                  <span className="text-muted-foreground whitespace-normal text-center text-xs font-normal">
                    Explore places
                  </span>
                </Button>
              </Link>

              <Link href="/dashboard/budget" className="w-full min-w-[170px]">
                <Button
                  variant="outline"
                  className="border-border/50 bg-muted/10 hover:bg-muted/30 h-[150px] w-full flex-col p-[20px]"
                >
                  <Wallet className="text-warning-foreground mb-3 size-7" strokeWidth={1.5} />
                  <span className="text-foreground mb-1 whitespace-normal text-sm font-semibold">
                    Manage Budget
                  </span>
                  <span className="text-muted-foreground whitespace-normal text-center text-xs font-normal">
                    Track expenses
                  </span>
                </Button>
              </Link>

              <Link href="/dashboard/trips" className="w-full min-w-[170px]">
                <Button
                  variant="outline"
                  className="border-border/50 bg-muted/10 hover:bg-muted/30 h-[150px] w-full flex-col p-[20px]"
                >
                  <Heart className="text-error-foreground mb-3 size-7" strokeWidth={1.5} />
                  <span className="text-foreground mb-1 whitespace-normal text-sm font-semibold">
                    View Saved Trips
                  </span>
                  <span className="text-muted-foreground whitespace-normal text-center text-xs font-normal">
                    See your favorites
                  </span>
                </Button>
              </Link>
            </div>
          </Card>
        </Fade>
      </Stagger>

      {/* FULL WIDTH EMPTY STATE / PROMO BANNER */}
      <Card className="border-border/60 bg-card flex w-full flex-col items-center justify-between gap-6 rounded-2xl p-8 sm:flex-row">
        <div className="flex items-center gap-6">
          <div className="bg-primary/20 flex size-16 shrink-0 items-center justify-center rounded-2xl">
            <MapPin className="text-primary size-8" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Ready for your next adventure?</h3>
            <p className="text-muted-foreground mt-1.5 text-sm">
              You don't have any upcoming trips.
              <br />
              Plan your first AI-powered itinerary and let the journey begin!
            </p>
          </div>
        </div>
        <Link href="/dashboard/ai-planner" className="ml-auto">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg px-6 text-sm font-medium">
            <Plane className="mr-2 size-4" />
            Plan Your First Trip
          </Button>
        </Link>
      </Card>
    </div>
  );
}
