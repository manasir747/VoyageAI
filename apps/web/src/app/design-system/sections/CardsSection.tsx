import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import {
  Card,
  GlassCard,
  InteractiveCard,
  StatisticCard,
  FeatureCard,
  AICard,
  DestinationCard,
} from "@/components/ui/card";
import { Plane, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CardsSection() {
  return (
    <section id="cards" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Cards</h2>
        <p className="text-muted-foreground">
          Containers for grouping related content and actions.
        </p>
      </div>

      <ComponentPreview name="Standard Card" description="Basic content container.">
        <Card className="w-full max-w-sm p-6">
          <h3 className="text-lg font-semibold">Standard Card</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            A basic card with standard border, background, and soft shadow.
          </p>
        </Card>
      </ComponentPreview>

      <ComponentPreview
        name="Glass Card"
        description="A card with a frosted glass effect."
        previewClassName="bg-gradient-to-br from-primary/10 to-accent/10"
      >
        <GlassCard className="w-full max-w-sm p-6">
          <h3 className="text-lg font-semibold">Glass Card</h3>
          <p className="text-foreground/80 mt-2 text-sm">
            Provides depth and visual interest over complex backgrounds.
          </p>
        </GlassCard>
      </ComponentPreview>

      <ComponentPreview name="Interactive Card" description="A card that responds to hover.">
        <InteractiveCard className="w-full max-w-sm cursor-pointer p-6">
          <h3 className="text-lg font-semibold">Interactive Card</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Hover over me to see the elevation effect.
          </p>
        </InteractiveCard>
      </ComponentPreview>

      <ComponentPreview name="Statistic Card" description="For displaying key metrics.">
        <div className="w-full max-w-sm">
          <StatisticCard
            label="Total Trips"
            value="24"
            trend="+3 this year"
            icon={<Plane className="size-5" />}
          />
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Feature Card"
        description="Used for marketing or highlighting capabilities."
      >
        <div className="w-full max-w-sm">
          <FeatureCard
            eyebrow="New Feature"
            title="Smart Itineraries"
            description="Automatically generate personalized day-by-day plans based on your interests."
            icon={<Star className="text-primary size-5" />}
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="AI Card" description="Specific style for AI-generated insights.">
        <div className="w-full max-w-sm">
          <AICard
            title="Weather Insight"
            subtitle="Kyoto, Japan"
            body="Expect light rain tomorrow morning. Packing an umbrella is highly recommended before your temple tour."
            badge="AI Insight"
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Destination Card" description="Rich media card for places.">
        <div className="w-full max-w-sm">
          <DestinationCard
            name="Tokyo"
            location="Japan"
            meta="5 days • $1,200 avg"
            action={
              <Button size="sm" variant="secondary">
                View
              </Button>
            }
          />
        </div>
      </ComponentPreview>
    </section>
  );
}
