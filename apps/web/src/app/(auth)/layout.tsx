import React from "react";
import { PageWrapper, Navbar } from "@/components/layout/layout";
import { Compass } from "lucide-react";
import Link from "next/link";
import { GlowBackgroundClient } from "@/components/three/glow-background-client";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const brand = (
    <Link href="/" className="group flex items-center gap-2">
      <div className="bg-primary/20 text-primary group-hover:bg-primary/30 flex size-8 items-center justify-center rounded-xl transition-colors">
        <Compass className="size-5" />
      </div>
      <span className="font-display text-lg font-bold tracking-tight">VoyageAI</span>
    </Link>
  );

  return (
    <PageWrapper className="relative min-h-screen">
      <Navbar brand={brand} className="absolute left-0 top-0 w-full border-none bg-transparent" />

      <div className="absolute inset-0 z-0">
        <GlowBackgroundClient />
      </div>

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {children}
      </main>
    </PageWrapper>
  );
}
