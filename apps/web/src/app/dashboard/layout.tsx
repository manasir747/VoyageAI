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

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    user.email?.split("@")[0] ||
    "User";

  return (
    <DashboardLayoutWrapper sidebar={<Sidebar />} topbar={<Topbar userName={userName} />}>
      <div className="p-4 sm:p-6 lg:p-8">{children}</div>
    </DashboardLayoutWrapper>
  );
}
