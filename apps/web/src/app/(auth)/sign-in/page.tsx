"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GlassCard } from "@/components/ui/card";
import { Input, PasswordInput } from "@/components/ui/inputs";
import { Button } from "@/components/ui/button";
import { Fade } from "@/components/motion/motion";
import { createClient } from "@/lib/supabase/browser";
import { AlertCircle } from "lucide-react";

const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <Fade className="w-full max-w-md">
      <GlassCard className="p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-sm">Sign in to your VoyageAI account</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

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

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="text-primary text-xs hover:underline">
                Forgot password?
              </Link>
            </div>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-destructive text-xs">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-muted-foreground mt-8 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </div>
      </GlassCard>
    </Fade>
  );
}
