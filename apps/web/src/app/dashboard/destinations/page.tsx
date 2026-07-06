import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DestinationsView } from "@/components/destinations/destinations-view";
import { redirect } from "next/navigation";

export default async function DestinationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's saved trips to infer recommendations
  const { data: trips } = await supabase
    .from("saved_itineraries")
    .select("destination")
    .eq("user_id", user.id);

  const savedItineraries = trips || [];

  // Fetch user's saved destinations
  const { data: savedDestData } = await supabase
    .from("saved_destinations")
    .select("destination_slug")
    .eq("user_id", user.id);

  const initialSavedDestinations = (savedDestData || []).map((row) => row.destination_slug);

  return (
    <DestinationsView
      savedItineraries={savedItineraries}
      initialSavedDestinations={initialSavedDestinations}
    />
  );
}
