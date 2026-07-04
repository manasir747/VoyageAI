"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageWrapper } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/browser";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <PageWrapper className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="font-display mb-4 text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome to the authenticated area! The actual dashboard will be built in a future phase.
        </p>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>
    </PageWrapper>
  );
}
