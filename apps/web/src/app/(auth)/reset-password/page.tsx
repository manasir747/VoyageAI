"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GlassCard } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { Fade } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { AlertCircle } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError(null);
    setSuccess(false);

    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 2000);
  };

  return (
    <Fade className="w-full max-w-md">
      <GlassCard className="p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">Set new password</h1>
          <p className="text-muted-foreground mt-2 text-sm">Please enter your new password below</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-success/10 text-success border-success/20 rounded-lg border p-6 text-center">
            <h3 className="mb-2 font-semibold">Password updated!</h3>
            <p className="text-sm">Your password has been successfully reset. Redirecting...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                New Password
              </label>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-destructive text-xs">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <PasswordInput
                id="confirmPassword"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </form>
        )}
      </GlassCard>
    </Fade>
  );
}
