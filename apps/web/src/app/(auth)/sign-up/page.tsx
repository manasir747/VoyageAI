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
import { AlertCircle, CheckCircle } from "lucide-react";

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
  const [requireEmailVerification, setRequireEmailVerification] = useState(false);
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

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

    const needsVerification = signUpData.user && !signUpData.session;
    setRequireEmailVerification(!!needsVerification);
    setSuccess(true);

    if (!needsVerification) {
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    }
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
          <Fade className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-primary/10 mb-6 rounded-full p-4">
              <CheckCircle className="text-primary size-16" />
            </div>
            <h1 className="font-display mb-4 text-2xl font-bold tracking-tight">
              Account Created Successfully!
            </h1>

            {requireEmailVerification ? (
              <>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  Please verify your email before signing in.
                </p>
                <Button className="shadow-glow w-full" onClick={() => router.push("/sign-in")}>
                  Back to Sign In
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  Your VoyageAI account has been created successfully.
                  <br />
                  You will be redirected to the Sign In page in a few seconds.
                </p>
                <div className="text-muted-foreground text-sm">
                  If you are not redirected automatically,{" "}
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="text-primary font-medium hover:underline"
                  >
                    click here
                  </button>{" "}
                  to sign in.
                </div>
              </>
            )}
          </Fade>
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

        {!success && (
          <div className="text-muted-foreground mt-8 text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        )}
      </GlassCard>
    </Fade>
  );
}
