"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Fade } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Input, Textarea, Select } from "@/components/ui/inputs";
import { Camera, Loader2, User } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

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

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 means no row found

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

        if (profile.avatar_object_path) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.avatar_object_path);
          // Append timestamp to prevent stale browser-cached avatar images
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

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...formData,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
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

    // Validate file size client-side (5 MB limit)
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

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        console.error("[Avatar Upload] Storage upload error:", uploadError);
        throw new Error(uploadError.message);
      }

      // 2. Get public URL (bucket is public, so this is a stable CDN URL)
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      // Bust the browser cache so the new image is immediately visible
      const publicUrlWithBust = `${urlData.publicUrl}?t=${Date.now()}`;

      // 3. Save path to profile row
      const { error: dbError } = await supabase.from("profiles").upsert({
        id: user.id,
        avatar_object_path: filePath,
        updated_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("[Avatar Upload] Profile DB upsert error:", dbError);
        throw new Error(dbError.message);
      }

      // 4. Update local state so UI reflects the change immediately
      setFormData((prev) => ({ ...prev, avatar_object_path: filePath }));
      setAvatarUrl(publicUrlWithBust);

      toast.success("Avatar updated", { id: toastId });
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error("[Avatar Upload] Failed:", message);
      toast.error(`Failed to upload avatar: ${message}`, { id: toastId });
    } finally {
      setIsUploading(false);
      // Reset the file input so the same file can be re-selected if needed
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="text-primary size-8 animate-spin" />
      </div>
    );
  }

  return (
    <Fade className="flex max-w-4xl flex-col gap-8 pb-12">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and preferences.
        </p>
      </div>

      <GlassCard className="border-border/40 space-y-8 p-8">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="group relative">
            <div className="border-border/50 bg-muted relative flex size-24 items-center justify-center overflow-hidden rounded-full border-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <User className="text-muted-foreground size-10" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="size-6 text-white" />
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
          <div className="flex flex-col justify-center text-center sm:text-left">
            <h3 className="text-lg font-semibold">Profile Picture</h3>
            <p className="text-muted-foreground mb-3 text-sm">JPG, GIF or PNG. Max size of 2MB.</p>
            {isUploading && (
              <span className="text-primary animate-pulse text-xs font-medium">Uploading...</span>
            )}
          </div>
        </div>

        <div className="bg-border/40 h-px w-full" />

        {/* Personal Info */}
        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold">Personal Information</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <Input
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="johndoe"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={userEmail} disabled className="bg-muted/50 text-muted-foreground" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="A little bit about yourself..."
              />
            </div>
          </div>
        </div>

        <div className="bg-border/40 h-px w-full" />

        {/* Preferences */}
        <div className="space-y-6">
          <h3 className="font-display text-xl font-bold">Travel Preferences</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preferred Language</label>
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
              <label className="text-sm font-medium">Preferred Currency</label>
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
              <label className="text-sm font-medium">Timezone</label>
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
              <label className="text-sm font-medium">Preferred Travel Style</label>
              <Select
                value={formData.preferred_travel_style}
                onValueChange={(val) => setFormData({ ...formData, preferred_travel_style: val })}
                options={[
                  { label: "Balanced", value: "Balanced" },
                  { label: "Relaxing", value: "Relaxing" },
                  { label: "Adventure", value: "Adventure" },
                  { label: "Cultural", value: "Cultural" },
                  { label: "Budget-Friendly", value: "Budget" },
                ]}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="shadow-glow rounded-full px-8"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </GlassCard>
    </Fade>
  );
}
