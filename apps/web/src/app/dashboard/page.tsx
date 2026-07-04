import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Grid } from "@/components/layout/layout";
import { Card } from "@/components/ui/card";
import { Plane, Calendar, TrendingUp, MapPin, Wallet } from "lucide-react";
import { Fade, Stagger } from "@/components/motion/motion";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.user_metadata?.display_name?.split(" ")[0] ||
    "Traveler";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Welcome back, {userName} 👋
        </h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your travel plans.
        </p>
      </div>

      <Stagger className="flex flex-col gap-6">
        <Grid columns={12} className="gap-6">
          <Fade className="col-span-12 md:col-span-4">
            <Card className="border-border/70 shadow-soft flex h-full flex-col p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-primary/20 text-primary rounded-xl p-3">
                  <Plane className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upcoming Trips</h3>
                  <p className="text-muted-foreground text-sm">2 planned</p>
                </div>
              </div>
              <div className="text-primary mt-auto cursor-pointer pt-4 text-sm font-medium hover:underline">
                View itineraries →
              </div>
            </Card>
          </Fade>

          <Fade className="col-span-12 md:col-span-4">
            <Card className="border-border/70 shadow-soft flex h-full flex-col p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-accent/20 text-accent rounded-xl p-3">
                  <Calendar className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <p className="text-muted-foreground text-sm">Updated Tokyo itinerary</p>
                </div>
              </div>
              <div className="text-primary mt-auto cursor-pointer pt-4 text-sm font-medium hover:underline">
                View history →
              </div>
            </Card>
          </Fade>

          <Fade className="col-span-12 md:col-span-4">
            <Card className="border-border/70 shadow-soft flex h-full flex-col p-6">
              <div className="mb-4 flex items-center gap-4">
                <div className="bg-success/20 text-success rounded-xl p-3">
                  <TrendingUp className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Travel Statistics</h3>
                  <p className="text-muted-foreground text-sm">4 countries visited</p>
                </div>
              </div>
              <div className="text-primary mt-auto cursor-pointer pt-4 text-sm font-medium hover:underline">
                View map →
              </div>
            </Card>
          </Fade>
        </Grid>

        <Grid columns={12} className="gap-6">
          <Fade className="col-span-12 lg:col-span-8">
            <Card className="border-border/70 shadow-soft flex h-[400px] flex-col p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground size-5" />
                  <h3 className="text-lg font-semibold">Saved Destinations</h3>
                </div>
              </div>
              <div className="border-border/60 bg-muted/20 flex flex-1 items-center justify-center rounded-xl border-2 border-dashed">
                <p className="text-muted-foreground text-sm">Interactive Map Placeholder</p>
              </div>
            </Card>
          </Fade>

          <Fade className="col-span-12 lg:col-span-4">
            <Card className="border-border/70 shadow-soft flex h-[400px] flex-col p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Wallet className="text-muted-foreground size-5" />
                  <h3 className="text-lg font-semibold">Budget Overview</h3>
                </div>
              </div>
              <div className="border-border/60 bg-muted/20 flex flex-1 items-center justify-center rounded-xl border-2 border-dashed">
                <p className="text-muted-foreground text-sm">Budget Chart Placeholder</p>
              </div>
            </Card>
          </Fade>
        </Grid>
      </Stagger>
    </div>
  );
}
