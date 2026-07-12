"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fade, Reveal } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { GlassCard, InteractiveCard } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/inputs";
import { Badge } from "@/components/ui/feedback";
import {
  Camera,
  Loader2,
  User,
  CheckCircle2,
  Map,
  Globe,
  Bookmark,
  Sparkles,
  UserCircle2,
  Mail,
  Info,
  Clock,
  Compass,
  Banknote,
  Navigation,
  Settings,
  Trophy,
  Award,
  Crown,
  Heart,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [memberSince, setMemberSince] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    preferred_language: "English",
    preferred_currency: "USD",
    preferred_travel_style: "Balanced",
    time_zone: "UTC",
    avatar_object_path: "",
  });

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserEmail(user.email || "");
      if (user.created_at) {
        setMemberSince(
          new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        );
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (profile) {
        setFormData({
          username: profile.username || "",
          display_name: profile.display_name || "",
          bio: profile.bio || "",
          preferred_language: profile.preferred_language || "English",
          preferred_currency: profile.preferred_currency || "USD",
          preferred_travel_style: profile.preferred_travel_style || "Balanced",
          time_zone: profile.time_zone || "UTC",
          avatar_object_path: profile.avatar_object_path || "",
        });

        if (profile.updated_at) {
          setLastUpdated(
            new Date(profile.updated_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
          );
        }

        if (profile.avatar_object_path) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.avatar_object_path);
          setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const now = new Date().toISOString();
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: now,
      });

      if (error) throw error;
      setLastUpdated(
        new Date(now).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading avatar...");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrlWithBust = `${urlData.publicUrl}?t=${Date.now()}`;

      const now = new Date().toISOString();
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_object_path: filePath,
        updated_at: now,
      });

      if (dbError) {
        throw new Error(dbError.message);
      }

      setFormData((prev) => ({ ...prev, avatar_object_path: filePath }));
      setAvatarUrl(publicUrlWithBust);
      setLastUpdated(
        new Date(now).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      );

      toast.success("Avatar updated", { id: toastId });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to upload avatar: ${message}`, { id: toastId });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const getPersonalityDescription = (style: string) => {
    switch (style) {
      case "Luxury":
        return "You enjoy premium experiences, five-star hotels, fine dining, comfort, and personalized itineraries.";
      case "Adventure":
        return "You love hidden gems, outdoor adventures and discovering places beyond the tourist trail.";
      case "Relaxing":
        return "You prioritize comfort, convenience and memorable relaxing experiences to recharge your batteries.";
      case "Budget-Friendly":
      case "Budget":
        return "You enjoy maximizing experiences while keeping costs under control and finding the best value.";
      case "Cultural":
        return "You seek to immerse yourself in local traditions, historical sites, and authentic local experiences.";
      default:
        return "You enjoy a balanced mix of sightseeing, relaxation, and exploring new cultures at a comfortable pace.";
    }
  };

  const calculateCompletion = () => {
    let score = 0;
    if (formData.display_name) score += 20;
    if (formData.username) score += 20;
    if (formData.bio) score += 20;
    if (avatarUrl) score += 20;
    if (formData.preferred_travel_style !== "Balanced") score += 20;
    return score === 0 ? 15 : score;
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="text-primary size-10 animate-spin" />
      </div>
    );
  }

  const completion = calculateCompletion();

  return (
    <div className="relative min-h-screen pb-32">
      <Fade className="mx-auto flex max-w-5xl flex-col gap-8 pb-12">
        {/* Section 1: Premium Profile Header */}
        <GlassCard className="border-border/40 relative overflow-hidden p-8 sm:p-10">
          <div className="from-primary/10 via-background to-background absolute inset-0 bg-gradient-to-br opacity-50" />
          <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
              <div className="group relative">
                <div className="border-border/50 bg-muted relative flex size-32 items-center justify-center overflow-hidden rounded-full border-4 shadow-xl">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="text-muted-foreground size-12" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="size-8 text-white" />
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
              </div>
              <div className="mt-2 flex flex-col justify-center space-y-2">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <h1 className="font-display text-4xl font-bold tracking-tight">
                    {formData.display_name || "Traveler"}
                  </h1>
                  <Badge
                    variant="success"
                    className="mt-1 border-emerald-500/20 bg-emerald-500/15 px-2 py-0.5 text-emerald-400 sm:mt-0"
                  >
                    <CheckCircle2 className="mr-1 size-3.5" /> Verified
                  </Badge>
                </div>
                <p className="text-muted-foreground text-lg">@{formData.username || "username"}</p>
                <div className="text-muted-foreground mt-2 flex items-center justify-center gap-4 pt-2 text-sm sm:justify-start">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-4" /> Member since {memberSince || "2024"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-4" /> Updated {lastUpdated || "recently"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:w-auto">
              <div className="bg-background/40 border-border/30 rounded-2xl border p-4 text-center backdrop-blur-md transition-transform hover:scale-105">
                <div className="text-primary bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-full">
                  <Map className="size-5" />
                </div>
                <div className="text-2xl font-bold">14</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium uppercase tracking-wider">
                  Trips Planned
                </div>
              </div>
              <div className="bg-background/40 border-border/30 rounded-2xl border p-4 text-center backdrop-blur-md transition-transform hover:scale-105">
                <div className="text-primary bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-full">
                  <Globe className="size-5" />
                </div>
                <div className="text-2xl font-bold">9</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium uppercase tracking-wider">
                  Countries
                </div>
              </div>
              <div className="bg-background/40 border-border/30 rounded-2xl border p-4 text-center backdrop-blur-md transition-transform hover:scale-105">
                <div className="text-primary bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-full">
                  <Bookmark className="size-5" />
                </div>
                <div className="text-2xl font-bold">21</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium uppercase tracking-wider">
                  Saved Trips
                </div>
              </div>
              <div className="bg-background/40 border-border/30 rounded-2xl border p-4 text-center backdrop-blur-md transition-transform hover:scale-105">
                <div className="text-primary bg-primary/10 mx-auto mb-2 flex size-10 items-center justify-center rounded-full">
                  <Sparkles className="size-5" />
                </div>
                <div className="text-2xl font-bold">32</div>
                <div className="text-muted-foreground mt-1 text-xs font-medium uppercase tracking-wider">
                  AI Itineraries
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Section 2: Personal Information */}
            <GlassCard className="border-border/40 p-8">
              <h3 className="font-display mb-6 flex items-center gap-2 text-2xl font-bold">
                <UserCircle2 className="text-primary size-6" /> Personal Information
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-sm font-medium">Full Name</label>
                    <div className="relative">
                      <User className="text-muted-foreground absolute left-3 top-3 size-4" />
                      <Input
                        value={formData.display_name}
                        onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                        placeholder="John Doe"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-muted-foreground text-sm font-medium">Username</label>
                    <div className="relative">
                      <div className="text-muted-foreground absolute left-3 top-3 flex size-4 items-center justify-center font-bold">
                        @
                      </div>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="johndoe"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-muted-foreground text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="text-muted-foreground absolute left-3 top-3 size-4" />
                      <Input
                        value={userEmail}
                        disabled
                        className="bg-muted/30 text-muted-foreground border-border/50 cursor-not-allowed pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-muted-foreground text-sm font-medium">Bio</label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="A little bit about yourself..."
                      className="min-h-[100px] resize-none"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Section 3: Travel Preferences */}
            <GlassCard className="border-border/40 p-8">
              <h3 className="font-display mb-6 flex items-center gap-2 text-2xl font-bold">
                <Compass className="text-primary size-6" /> Travel Preferences
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Globe className="size-4" /> Preferred Language
                  </label>
                  <Select
                    value={formData.preferred_language}
                    onValueChange={(val) => setFormData({ ...formData, preferred_language: val })}
                    options={[
                      { label: "English", value: "English" },
                      { label: "Spanish", value: "Spanish" },
                      { label: "French", value: "French" },
                      { label: "German", value: "German" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Banknote className="size-4" /> Preferred Currency
                  </label>
                  <Select
                    value={formData.preferred_currency}
                    onValueChange={(val) => setFormData({ ...formData, preferred_currency: val })}
                    options={[
                      { label: "USD ($)", value: "USD" },
                      { label: "EUR (€)", value: "EUR" },
                      { label: "GBP (£)", value: "GBP" },
                      { label: "JPY (¥)", value: "JPY" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Clock className="size-4" /> Timezone
                  </label>
                  <Select
                    value={formData.time_zone}
                    onValueChange={(val) => setFormData({ ...formData, time_zone: val })}
                    options={[
                      { label: "UTC", value: "UTC" },
                      { label: "EST (New York)", value: "EST" },
                      { label: "PST (Los Angeles)", value: "PST" },
                      { label: "GMT (London)", value: "GMT" },
                    ]}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="size-4" /> Travel Style
                  </label>
                  <Select
                    value={formData.preferred_travel_style}
                    onValueChange={(val) =>
                      setFormData({ ...formData, preferred_travel_style: val })
                    }
                    options={[
                      { label: "Balanced", value: "Balanced" },
                      { label: "Relaxing", value: "Relaxing" },
                      { label: "Adventure", value: "Adventure" },
                      { label: "Cultural", value: "Cultural" },
                      { label: "Luxury", value: "Luxury" },
                      { label: "Budget", value: "Budget" },
                    ]}
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-8">
            {/* Section 7: Profile Completion */}
            <GlassCard className="border-border/40 flex flex-col items-center p-8 text-center">
              <div className="relative mb-4 size-32">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted/30"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-primary transition-all duration-1000 ease-out"
                    strokeDasharray={`${completion}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{completion}%</span>
                </div>
              </div>
              <h4 className="text-lg font-bold">Profile Complete</h4>
              <p className="text-muted-foreground mt-2 text-sm">
                {completion < 100
                  ? "Complete your travel preferences to receive better AI itinerary recommendations."
                  : "Your profile is fully optimized for AI recommendations!"}
              </p>
            </GlassCard>

            {/* Section 4: Travel Personality */}
            <GlassCard className="border-border/40 from-primary/5 relative overflow-hidden bg-gradient-to-br to-transparent p-8">
              <div className="text-primary/10 absolute -right-4 -top-4">
                <Heart className="size-32" />
              </div>
              <h3 className="font-display relative z-10 mb-4 flex items-center gap-2 text-xl font-bold">
                <Info className="text-primary size-5" /> Travel Personality
              </h3>
              <div className="relative z-10">
                <Badge variant="default" className="mb-3 px-3 py-1">
                  {formData.preferred_travel_style} Explorer
                </Badge>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {getPersonalityDescription(formData.preferred_travel_style)}
                </p>
              </div>
            </GlassCard>

            {/* Section 6: Achievements */}
            <GlassCard className="border-border/40 p-8">
              <h3 className="font-display mb-5 flex items-center gap-2 text-xl font-bold">
                <Trophy className="text-primary size-5" /> Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="glass"
                  className="border-primary/20 bg-primary/5 text-primary gap-1"
                >
                  <Sparkles className="size-3" /> AI Explorer
                </Badge>
                <Badge
                  variant="glass"
                  className="border-warning/20 bg-warning/5 text-warning gap-1"
                >
                  <Crown className="size-3" /> Luxury Traveller
                </Badge>
                <Badge
                  variant="glass"
                  className="gap-1 border-blue-500/20 bg-blue-500/5 text-blue-400"
                >
                  <Award className="size-3" /> Early Adopter
                </Badge>
                <Badge
                  variant="glass"
                  className="gap-1 border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                >
                  <Map className="size-3" /> Planner Pro
                </Badge>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Section 5: Quick Actions */}
        <Reveal>
          <div className="mt-4">
            <h3 className="font-display mb-6 text-xl font-bold">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <InteractiveCard
                className="hover:bg-muted/30 cursor-pointer p-6 text-center transition-colors"
                onClick={() => router.push("/dashboard/ai-planner")}
              >
                <div className="text-primary bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
                  <Sparkles className="size-6" />
                </div>
                <h4 className="text-sm font-semibold">Open AI Planner</h4>
              </InteractiveCard>
              <InteractiveCard
                className="hover:bg-muted/30 cursor-pointer p-6 text-center transition-colors"
                onClick={() => router.push("/dashboard/trips")}
              >
                <div className="text-primary bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
                  <Navigation className="size-6" />
                </div>
                <h4 className="text-sm font-semibold">View Trips</h4>
              </InteractiveCard>
              <InteractiveCard
                className="hover:bg-muted/30 cursor-pointer p-6 text-center transition-colors"
                onClick={() => router.push("/dashboard")}
              >
                <div className="text-primary bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
                  <Bookmark className="size-6" />
                </div>
                <h4 className="text-sm font-semibold">Saved Destinations</h4>
              </InteractiveCard>
              <InteractiveCard
                className="hover:bg-muted/30 cursor-pointer p-6 text-center transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <div className="text-primary bg-primary/10 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl">
                  <Settings className="size-6" />
                </div>
                <h4 className="text-sm font-semibold">Settings</h4>
              </InteractiveCard>
            </div>
          </div>
        </Reveal>
      </Fade>

      {/* Section 8: Save Changes Sticky Bar */}
      <div className="border-border/40 bg-background/80 fixed bottom-0 left-0 right-0 z-50 border-t p-4 shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <p className="text-muted-foreground hidden text-sm sm:block">
            You have unsaved changes to your profile.
          </p>
          <div className="flex w-full justify-end sm:w-auto">
            <Button
              variant="default"
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
              className="shadow-glow text-md w-full rounded-full px-10 font-semibold sm:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
