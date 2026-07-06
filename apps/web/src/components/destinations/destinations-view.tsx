"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, MapPin, Heart, ArrowRight, Compass, Star, Sun, Wallet } from "lucide-react";
import { Fade, Stagger } from "@/components/motion/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/inputs";
import { Card, GlassCard } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/feedback";
import { toast } from "sonner";
import { DESTINATIONS, CATEGORIES, RECOMMENDATION_MAP, Destination } from "@/data/destinations";

interface DestinationsViewProps {
  savedItineraries: any[];
}

export function DestinationsView({ savedItineraries }: DestinationsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [bookmarkedDestinations, setBookmarkedDestinations] = useState<string[]>([]);

  // Initialize local storage bookmarks
  useEffect(() => {
    try {
      const stored = localStorage.getItem("voyageai_bookmarked_destinations");
      if (stored) {
        setBookmarkedDestinations(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load bookmarks", e);
    }
  }, []);

  const toggleBookmark = (id: string) => {
    setBookmarkedDestinations((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((d) => d !== id);
        toast("Removed from favorites");
      } else {
        next = [...prev, id];
        toast.success("Saved to favorites");
      }
      localStorage.setItem("voyageai_bookmarked_destinations", JSON.stringify(next));
      return next;
    });
  };

  // Filter destinations based on search and category
  const filteredDestinations = useMemo(() => {
    return DESTINATIONS.filter((dest) => {
      const matchesSearch =
        searchQuery === "" ||
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.continent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === "All" || dest.category.includes(activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Trending (hardcoded top 6)
  const trendingDestinations = DESTINATIONS.slice(0, 6);

  // Recommendations logic
  const recommendedDestinations = useMemo(() => {
    const recommendedSet = new Set<string>();

    savedItineraries.forEach((trip) => {
      if (!trip.destination) return;
      const country = trip.destination.split(",").pop()?.trim() || "";
      if (RECOMMENDATION_MAP[country]) {
        RECOMMENDATION_MAP[country].forEach((rec) => recommendedSet.add(rec));
      }
    });

    // Fallback if no matching recommendations
    if (recommendedSet.size === 0) {
      ["Tokyo", "Paris", "Rome", "Bali", "Swiss Alps"].forEach((rec) => recommendedSet.add(rec));
    }

    return DESTINATIONS.filter((d) => recommendedSet.has(d.city)).slice(0, 4);
  }, [savedItineraries]);

  return (
    <div className="flex w-full max-w-full flex-col gap-16 pb-20">
      {/* SECTION 1 - HERO */}
      <Fade className="mt-6 flex flex-col items-center text-center">
        <div className="bg-primary/10 text-primary mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          <Compass className="size-4" /> Discovery
        </div>
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Explore Destinations
        </h1>
        <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
          Discover your next unforgettable adventure with curated destinations from around the
          world.
        </p>

        <div className="relative w-full max-w-xl">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="text-muted-foreground size-5" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search destinations by city, country, or continent..."
            className="border-border/60 bg-card/60 focus-visible:ring-primary/30 w-full rounded-2xl py-6 pl-11 pr-4 text-base shadow-sm backdrop-blur-sm"
          />
        </div>
      </Fade>

      {/* SECTION 2 - CATEGORY CHIPS */}
      <Fade className="w-full">
        <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-4">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            className="shadow-soft whitespace-nowrap rounded-full px-6"
            onClick={() => setActiveCategory("All")}
          >
            All Destinations
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              className="shadow-soft bg-card hover:bg-muted whitespace-nowrap rounded-full px-6"
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="mr-2">{cat.emoji}</span>
              {cat.label}
            </Button>
          ))}
        </div>
      </Fade>

      {/* SECTION 4, 7, 8 - DESTINATION GRID */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">
            {searchQuery || activeCategory !== "All" ? "Search Results" : "Popular Destinations"}
          </h2>
          <span className="text-muted-foreground text-sm font-medium">
            {filteredDestinations.length} places
          </span>
        </div>

        {filteredDestinations.length > 0 ? (
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {filteredDestinations.map((dest) => (
              <Fade key={dest.id}>
                <DestinationCard
                  dest={dest}
                  isSaved={bookmarkedDestinations.includes(dest.id)}
                  onSave={() => toggleBookmark(dest.id)}
                />
              </Fade>
            ))}
          </Stagger>
        ) : (
          /* SECTION 11 - EMPTY STATE */
          <Fade>
            <EmptyState
              icon={<Compass className="text-primary size-10" />}
              title="No destinations found."
              description="Try adjusting your search query or selecting a different category."
              action={
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          </Fade>
        )}
      </div>

      {/* SECTION 5 - TRENDING DESTINATIONS */}
      {searchQuery === "" && activeCategory === "All" && (
        <Fade>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display flex items-center gap-2 text-2xl font-bold">
              🔥 Trending This Month
            </h2>
          </div>
          <div className="hide-scrollbar -mx-4 flex gap-6 overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0">
            {trendingDestinations.map((dest) => (
              <div key={`trending-${dest.id}`} className="min-w-[280px] max-w-[300px] shrink-0">
                <DestinationCard
                  dest={dest}
                  isSaved={bookmarkedDestinations.includes(dest.id)}
                  onSave={() => toggleBookmark(dest.id)}
                />
              </div>
            ))}
          </div>
        </Fade>
      )}

      {/* SECTION 6 - RECOMMENDED FOR YOU */}
      {searchQuery === "" && activeCategory === "All" && recommendedDestinations.length > 0 && (
        <Fade>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display flex items-center gap-2 text-2xl font-bold">
              ✨ Recommended For You
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendedDestinations.map((dest) => (
              <DestinationCard
                key={`rec-${dest.id}`}
                dest={dest}
                isSaved={bookmarkedDestinations.includes(dest.id)}
                onSave={() => toggleBookmark(dest.id)}
              />
            ))}
          </div>
        </Fade>
      )}
    </div>
  );
}

// Reusable Destination Card Component
function DestinationCard({
  dest,
  isSaved,
  onSave,
}: {
  dest: Destination;
  isSaved: boolean;
  onSave: () => void;
}) {
  return (
    <GlassCard className="border-border/50 hover:shadow-strong bg-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1">
      {/* Image Header */}
      <div className="bg-muted relative h-48 w-full overflow-hidden">
        <Image
          src={dest.image}
          alt={dest.city}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute right-3 top-3 flex gap-2">
          <div className="bg-background/90 flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-md">
            <Star className="text-warning fill-warning size-3" />
            {dest.rating}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="bg-background/50 hover:bg-background/90 absolute left-3 top-3 rounded-full p-2 backdrop-blur-md transition-colors"
        >
          <Heart className={`size-4 ${isSaved ? "fill-error text-error" : "text-foreground"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display line-clamp-1 text-xl font-bold leading-tight">
              {dest.city}
            </h3>
            <p className="text-muted-foreground mt-1 flex items-center gap-1 text-sm font-medium">
              <MapPin className="size-3" /> {dest.country}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground/90 mb-4 mt-3 line-clamp-2 flex-1 text-sm">
          {dest.description}
        </p>

        <div className="text-muted-foreground mb-5 flex items-center gap-4 text-xs font-medium">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <Sun className="text-warning size-3.5" /> Best Season
            </span>
            <span className="text-foreground">{dest.bestSeason}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1.5">
              <Wallet className="text-success size-3.5" /> Starting at
            </span>
            <span className="text-foreground">${dest.startingBudget}</span>
          </div>
        </div>

        <div className="border-border/40 mt-auto border-t pt-4">
          <Link
            href={`/dashboard/ai-planner?destination=${encodeURIComponent(dest.city + ", " + dest.country)}`}
          >
            <Button className="group/btn bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow w-full">
              Plan Trip
              <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </GlassCard>
  );
}
