"use client";

import React, { useState } from "react";
import { Fade } from "@/components/motion/motion";
import { GlassCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/controls";
import { ThemeToggle } from "@/theme/theme-toggle";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [tripNotifs, setTripNotifs] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const supabase = createClient();

  const handlePasswordReset = async () => {
    setIsResetting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user?.email) throw new Error("No user email found.");

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success("Password reset email sent.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send password reset email.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleSignOutAll = () => {
    toast.info("Signing out all devices...");
    // Placeholder functionality
  };

  return (
    <Fade className="flex h-full max-w-4xl flex-col gap-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your app preferences and security.</p>
      </div>

      <GlassCard className="border-border/40 space-y-8 p-8">
        {/* Appearance Section */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-bold">Appearance</h3>
            <p className="text-muted-foreground text-sm">
              Customize how VoyageAI looks on your device.
            </p>
          </div>
          <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-xl border p-4">
            <div>
              <p className="text-sm font-medium">Theme preference</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Choose light, dark, or sync with your system.
              </p>
            </div>
            <ThemeToggle />
          </div>
        </section>

        <div className="bg-border/40 h-px w-full" />

        {/* Notifications Section */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-bold">Notifications</h3>
            <p className="text-muted-foreground text-sm">
              Choose what updates you want to receive.
            </p>
          </div>
          <div className="space-y-3">
            <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Receive updates about your account via email.
                </p>
              </div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <div className="bg-muted/30 border-border/50 flex items-center justify-between rounded-xl border p-4">
              <div>
                <p className="text-sm font-medium">Trip Reminders</p>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Get reminded before your upcoming saved trips.
                </p>
              </div>
              <Switch checked={tripNotifs} onCheckedChange={setTripNotifs} />
            </div>
          </div>
        </section>

        <div className="bg-border/40 h-px w-full" />

        {/* Security Section */}
        <section className="space-y-4">
          <div>
            <h3 className="text-destructive text-lg font-bold">Security</h3>
            <p className="text-muted-foreground text-sm">
              Manage your account security and devices.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="outline"
              className="border-border/60 shadow-sm"
              onClick={handlePasswordReset}
              disabled={isResetting}
            >
              {isResetting ? "Sending Email..." : "Change Password"}
            </Button>
            <Button
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10 shadow-sm"
              onClick={handleSignOutAll}
            >
              Sign out all devices
            </Button>
          </div>
        </section>

        <div className="bg-border/40 h-px w-full" />

        {/* About Section */}
        <section className="space-y-4">
          <div>
            <h3 className="text-lg font-bold">About</h3>
            <p className="text-muted-foreground text-sm">
              Application details and legal information.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-[10px] uppercase tracking-widest">
              Version 1.0.0
            </span>
            <span className="text-muted-foreground">VoyageAI © 2026</span>
          </div>
        </section>
      </GlassCard>
    </Fade>
  );
}
