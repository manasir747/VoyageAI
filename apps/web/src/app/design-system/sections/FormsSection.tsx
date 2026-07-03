import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import { Input, Textarea, PasswordInput } from "@/components/ui/inputs";
import { Checkbox } from "@/components/ui/controls";
import { Button } from "@/components/ui/button";

export function FormsSection() {
  return (
    <section id="forms" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Forms</h2>
        <p className="text-muted-foreground">Composed form examples with validation states.</p>
      </div>

      <ComponentPreview
        name="Standard Form"
        description="A complete form with various input types."
      >
        <div className="border-border/70 bg-card shadow-soft flex w-full max-w-md flex-col gap-6 rounded-2xl border p-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Create Account</h3>
            <p className="text-muted-foreground text-sm">Join VoyageAI to start planning.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <PasswordInput id="password" placeholder="Create a strong password" />
            </div>

            <div className="mt-2 flex items-start gap-3">
              <Checkbox id="terms" className="mt-1" />
              <label htmlFor="terms" className="text-muted-foreground text-sm">
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>
          </div>

          <Button className="w-full">Sign Up</Button>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Validation States"
        description="How forms look when there are errors."
      >
        <div className="border-border/70 bg-card shadow-soft flex w-full max-w-md flex-col gap-4 rounded-2xl border p-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="email-error" className="text-error text-sm font-medium">
              Email
            </label>
            <Input
              id="email-error"
              type="email"
              defaultValue="invalid-email"
              className="border-error focus-visible:ring-error text-error"
            />
            <span className="text-error text-xs">Please enter a valid email address.</span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="bio-error" className="text-error text-sm font-medium">
              Bio
            </label>
            <Textarea id="bio-error" className="border-error focus-visible:ring-error text-error" />
            <span className="text-error text-xs">Bio must be at least 10 characters.</span>
          </div>
        </div>
      </ComponentPreview>
    </section>
  );
}
