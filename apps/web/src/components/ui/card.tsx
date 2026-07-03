import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border/70 bg-card text-card-foreground shadow-soft", className)} {...props} />;
}

export function GlassCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-glass-border bg-glass/80 text-foreground shadow-glass backdrop-blur-xl", className)} {...props} />;
}

export function InteractiveCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Card className={cn("transition-transform duration-200 hover:-translate-y-1 hover:shadow-medium", className)} {...props} />;
}

export function StatisticCard({ className, label, value, trend, icon }: { className?: string; label: string; value: string; trend?: string; icon?: React.ReactNode }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {trend ? <p className="mt-2 text-sm text-muted-foreground">{trend}</p> : null}
        </div>
        {icon ? <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-foreground">{icon}</div> : null}
      </div>
    </Card>
  );
}

export function FeatureCard({ className, eyebrow, title, description, icon }: { className?: string; eyebrow?: string; title: string; description: string; icon?: React.ReactNode }) {
  return (
    <GlassCard className={cn("p-6", className)}>
      {icon ? <div className="mb-4 inline-flex rounded-2xl border border-glass-border bg-background/60 p-3">{icon}</div> : null}
      {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</p> : null}
      <h3 className="mt-2 text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
    </GlassCard>
  );
}

export function AICard({ className, title, subtitle, body, badge }: { className?: string; title: string; subtitle?: string; body: string; badge?: string }) {
  return (
    <GlassCard className={cn("p-6", className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
        </div>
        {badge ? <span className="rounded-pill bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{badge}</span> : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
    </GlassCard>
  );
}

export function DestinationCard({ className, name, location, meta, image, action }: { className?: string; name: string; location: string; meta?: string; image?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <InteractiveCard className={cn("overflow-hidden", className)}>
      <div className="relative aspect-[16/10] bg-gradient-hero">
        {image ? <div className="absolute inset-0">{image}</div> : null}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
          {action}
        </div>
        {meta ? <p className="mt-3 text-sm text-muted-foreground">{meta}</p> : null}
      </div>
    </InteractiveCard>
  );
}
