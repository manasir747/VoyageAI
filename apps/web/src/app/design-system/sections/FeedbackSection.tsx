"use client";
import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import {
  Skeleton,
  Spinner,
  Progress,
  CircularProgress,
  Alert,
  Toast,
  EmptyState,
  LoadingState,
  ErrorState,
} from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";

export function FeedbackSection() {
  return (
    <section id="feedback" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Feedback & States</h2>
        <p className="text-muted-foreground">
          Components for communicating status, progress, and empty states.
        </p>
      </div>

      <ComponentPreview
        name="Alerts"
        description="Inline notifications for different severity levels."
      >
        <div className="flex w-full max-w-lg flex-col gap-4">
          <Alert
            title="New features available"
            description="We've added smart itinerary generation."
            variant="default"
          />
          <Alert
            title="Payment successful"
            description="Your flight to Tokyo is confirmed."
            variant="success"
          />
          <Alert
            title="Low balance"
            description="You're approaching your travel budget."
            variant="warning"
          />
          <Alert
            title="Connection lost"
            description="Please check your internet connection."
            variant="error"
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Toasts" description="Temporary notifications.">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <Toast
            title="Profile updated"
            description="Your preferences have been saved."
            variant="success"
            onClose={() => {}}
          />
          <Toast
            title="Action failed"
            description="Could not delete the item."
            variant="error"
            onClose={() => {}}
          />
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Progress & Loading"
        description="Indicators for asynchronous operations."
      >
        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <div className="w-full space-y-2">
            <span className="text-muted-foreground text-sm">Linear Progress</span>
            <Progress value={65} />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center space-y-2 text-center">
              <span className="text-muted-foreground text-sm">Circular</span>
              <CircularProgress value={75} size={64} />
            </div>
            <div className="flex flex-col items-center space-y-2 text-center">
              <span className="text-muted-foreground text-sm">Spinner</span>
              <Spinner className="text-primary size-8" />
            </div>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview name="Skeleton" description="Placeholder for loading content.">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Empty & Error States"
        description="Full-area states for no data or errors."
      >
        <div className="flex w-full max-w-lg flex-col gap-6">
          <EmptyState
            title="No trips found"
            description="You haven't planned any trips yet. Get started by creating your first itinerary."
            action={<Button size="sm">Create Trip</Button>}
          />
          <LoadingState label="Fetching destinations..." />
          <ErrorState
            description="Failed to load your itinerary. Please try again."
            action={
              <Button variant="outline" size="sm">
                Retry
              </Button>
            }
          />
        </div>
      </ComponentPreview>
    </section>
  );
}
