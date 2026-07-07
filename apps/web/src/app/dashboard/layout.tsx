import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardLayoutWrapper } from "@/components/layout/layout";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch the user's profile as the single source of truth
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username, avatar_object_path")
    .eq("id", user.id)
    .single();

  const userName =
    profile?.display_name ||
    profile?.username ||
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "User";

  let avatarUrl = null;
  if (profile?.avatar_object_path) {
    const { data } = supabase.storage.from("avatars").getPublicUrl(profile.avatar_object_path);
    avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
  }

  return (
    <DashboardLayoutWrapper
      sidebar={<Sidebar />}
      topbar={<Topbar userName={userName} avatarUrl={avatarUrl} />}
    >
      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">{children}</div>
    </DashboardLayoutWrapper>
  );
}
