import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BudgetView } from "@/components/dashboard/budget-view";

export default async function BudgetPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's saved trips
  const { data: trips, error } = await supabase
    .from("saved_itineraries")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch trips for budget:", error);
  }

  return <BudgetView trips={trips || []} />;
}
