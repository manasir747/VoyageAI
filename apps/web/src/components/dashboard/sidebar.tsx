"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Plane,
  MapPin,
  Wallet,
  Heart,
  User,
  Settings,
  LogOut,
  Compass,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Trips", href: "/dashboard/trips", icon: Plane },
  { name: "AI Planner", href: "/dashboard/ai-planner", icon: Sparkles },
  { name: "Destinations", href: "/dashboard/destinations", icon: MapPin },
  { name: "Budget", href: "/dashboard/budget", icon: Wallet },
  { name: "Saved", href: "/dashboard/saved", icon: Heart },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <div className={cn("flex h-full flex-col p-4", className)}>
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="from-primary to-accent shadow-glow text-primary-foreground flex size-8 items-center justify-center rounded-xl bg-gradient-to-br">
          <Compass className="size-5" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight">VoyageAI</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "size-5",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-border/60 mt-auto border-t pt-4">
        <button
          onClick={handleLogout}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200"
        >
          <LogOut className="text-muted-foreground group-hover:text-destructive size-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
