"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin, Compass, Heart } from "lucide-react";
import { Fade, Stagger } from "@/components/motion/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/inputs";
import { EmptyState } from "@/components/ui/feedback";
import { toast } from "sonner";
import { CATEGORIES, Destination } from "@/data/destinations";
import { createClient } from "@/lib/supabase/browser";
import { DestinationCard } from "@/components/destinations/destinations-view";

interface SavedDestinationsViewProps {
  initialSavedDestinations: Destination[];
}

export function SavedDestinationsView({ initialSavedDestinations }: SavedDestinationsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [savedDestinations, setSavedDestinations] =
    useState<Destination[]>(initialSavedDestinations);
  const supabase = createClient();

  const handleRemove = async (dest: Destination) => {
    // Optimistic remove
    setSavedDestinations((prev) => prev.filter((d) => d.id !== dest.id));

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to modify saved destinations");
      return;
    }

    const { error } = await supabase
      .from("saved_destinations")
      .delete()
      .eq("user_id", user.id)
      .eq("destination_slug", dest.id);

    if (error) {
      toast.error("Failed to remove from favorites");
      // Revert optimistic update
      setSavedDestinations((prev) => [...prev, dest]);
    } else {
      toast("Removed from favorites");
    }
  };

  // Filter destinations based on search and category
  const filteredDestinations = useMemo(() => {
    return savedDestinations.filter((dest) => {
      const matchesSearch =
        searchQuery === "" ||
        dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.continent.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === "All" || dest.category.includes(activeCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, savedDestinations]);

  if (savedDestinations.length === 0) {
    return (
      <div className="flex w-full max-w-full flex-col gap-6">
        <Fade>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Saved Destinations</h1>
            <p className="text-muted-foreground mt-2">
              Your personal collection of dream destinations.
            </p>
          </div>
        </Fade>
        <Fade className="mt-8">
          <EmptyState
            icon={<Heart className="text-primary size-10" />}
            title="No saved destinations yet"
            description="Save destinations from Explore to build your travel wishlist."
            action={
              <Link href="/dashboard/destinations">
                <Button>Explore Destinations</Button>
              </Link>
            }
          />
        </Fade>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-full flex-col gap-10 pb-20">
      <Fade>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Saved Destinations</h1>
          <p className="text-muted-foreground mt-2">
            Your personal collection of dream destinations.
          </p>
          <div className="text-muted-foreground mt-2 text-sm font-medium">
            Total Saved Destinations: {savedDestinations.length}
          </div>
        </div>
      </Fade>

      <Fade className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="text-muted-foreground size-4" />
          </div>
          <Input
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            placeholder="Search by city, country, or continent..."
            className="border-border/60 bg-card focus-visible:ring-primary/30 w-full rounded-xl py-5 pl-9"
          />
        </div>

        <div className="hide-scrollbar flex w-full gap-2 overflow-x-auto pb-2 sm:w-auto sm:pb-0">
          <Button
            variant={activeCategory === "All" ? "default" : "outline"}
            size="sm"
            className="whitespace-nowrap rounded-full"
            onClick={() => setActiveCategory("All")}
          >
            All
          </Button>
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="bg-card hover:bg-muted whitespace-nowrap rounded-full"
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </Fade>

      {filteredDestinations.length > 0 ? (
        <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredDestinations.map((dest) => (
            <Fade key={dest.id}>
              <DestinationCard dest={dest} isSaved={true} onSave={() => handleRemove(dest)} />
            </Fade>
          ))}
        </Stagger>
      ) : (
        <Fade>
          <EmptyState
            icon={<MapPin className="text-primary size-10" />}
            title="No matching destinations"
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
  );
}
