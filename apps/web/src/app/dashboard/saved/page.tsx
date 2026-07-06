import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SavedDestinationsView } from "@/components/destinations/saved-destinations-view";
import { Destination } from "@/data/destinations";

export default async function SavedPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's saved destinations
  const { data: savedDestData } = await supabase
    .from("saved_destinations")
    .select("*")
    .eq("user_id", user.id)
    .order("saved_at", { ascending: false });

  // Map to Destination type
  const savedDestinations: Destination[] = (savedDestData || []).map((row) => ({
    id: row.destination_slug,
    city: row.city,
    country: row.country,
    continent: row.continent || "",
    rating: row.rating || 0,
    bestSeason: row.best_season || "",
    startingBudget: row.starting_budget || 0,
    category: row.category || [],
    image: row.image_url || "",
    description: row.description || "",
  }));

  return <SavedDestinationsView initialSavedDestinations={savedDestinations} />;
}
