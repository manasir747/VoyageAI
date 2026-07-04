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

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setError(null);
    setSuccess(false);

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          display_name: data.fullName,
          full_name: data.fullName,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Usually Supabase requires email verification unless auto confirm is enabled.
    // If auto confirm is enabled, they are signed in immediately.
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
          <h1 className="font-display text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-muted-foreground mt-2 text-sm">Join VoyageAI and start exploring</p>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive border-destructive/20 mb-6 flex items-center gap-3 rounded-lg border p-4 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success ? (
          <div className="bg-success/10 text-success border-success/20 rounded-lg border p-6 text-center">
            <h3 className="mb-2 font-semibold">Account created successfully!</h3>
            <p className="text-sm">
              Please check your email to verify your account if required, or wait to be redirected.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="fullName">
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="John Doe"
                autoComplete="name"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-destructive text-xs">{errors.fullName.message}</p>
              )}
            </div>

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
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        )}

        <div className="text-muted-foreground mt-8 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </div>
      </GlassCard>
    </Fade>
  );
}
