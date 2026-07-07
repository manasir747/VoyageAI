"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, User as UserIcon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Sheet,
  DrawerContent,
} from "@/components/ui/overlays";
import { Sidebar } from "./sidebar";
import { createClient } from "@/lib/supabase/browser";

interface TopbarProps {
  userName: string;
  avatarUrl?: string | null;
}

export function Topbar({ userName, avatarUrl }: TopbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="size-5" />
        </Button>

        <div className="relative hidden max-w-md flex-1 items-center sm:flex">
          <Search className="text-muted-foreground absolute left-3 size-4" />
          <input
            type="text"
            placeholder="Search trips, destinations..."
            className="border-border/70 bg-muted/40 focus:ring-primary h-10 w-full rounded-full border pl-10 pr-4 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="text-muted-foreground size-5" />
          <span className="bg-destructive border-background absolute right-2 top-2 size-2 rounded-full border-2" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-muted/50 focus-visible:ring-primary flex items-center gap-3 rounded-full p-1 pr-3 outline-none transition-colors focus-visible:ring-2">
              <div className="bg-primary/20 text-primary flex size-8 items-center justify-center overflow-hidden rounded-full text-xs font-semibold">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  getInitials(userName || "User")
                )}
              </div>
              <span className="hidden text-sm font-medium sm:block">{userName || "User"}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2">
              <div className="bg-primary/20 text-primary flex size-8 items-center justify-center overflow-hidden rounded-full text-xs font-semibold">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
                ) : (
                  getInitials(userName || "User")
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{userName || "User"}</span>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <UserIcon className="mr-2 size-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              <Settings className="mr-2 size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <DrawerContent side="left" className="p-0">
          <Sidebar />
        </DrawerContent>
      </Sheet>
    </div>
  );
}

// Just importing Settings icon here since it's used in the dropdown
import { Settings } from "lucide-react";
