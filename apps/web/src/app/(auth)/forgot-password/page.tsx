"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GlassCard } from "@/components/ui/card";
import { Input } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { Fade } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setError(null);
    setSuccess(false);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSuccess(true);
  };

  return (
    <Fade className="w-full max-w-md">
      <GlassCard className="p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">Reset password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-success/10 text-success border-success/20 rounded-lg border p-6 text-center">
            <CheckCircle2 className="mx-auto mb-4 size-8" />
            <h3 className="mb-2 font-semibold">Check your email</h3>
            <p className="text-sm">
              We've sent you a link to reset your password. It may take a few minutes to arrive.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        <div className="text-muted-foreground mt-8 text-center text-sm">
          Remember your password?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </GlassCard>
    </Fade>
  );
}
