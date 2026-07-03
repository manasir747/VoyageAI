"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { AlertCircle, CheckCircle2, Loader2, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "success" | "warning" | "error" | "glass";
}) {
  const variants = {
    default: "bg-primary/10 text-primary",
    secondary: "bg-secondary text-secondary-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning-foreground",
    error: "bg-error/10 text-error-foreground",
    glass: "border border-glass-border bg-glass/70 text-foreground backdrop-blur-xl",
  } as const;

  return (
    <span
      className={cn(
        "rounded-pill inline-flex items-center px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Chip({
  className,
  onRemove,
  children,
}: React.PropsWithChildren<{ className?: string; onRemove?: () => void }>) {
  return (
    <span
      className={cn(
        "rounded-pill border-border/70 bg-muted/40 inline-flex items-center gap-2 border px-3 py-1.5 text-sm",
        className,
      )}
    >
      {children}
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted-foreground hover:bg-muted/70 hover:text-foreground inline-flex size-5 items-center justify-center rounded-full"
          aria-label="Remove chip"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

export const Avatar = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>) => (
  <AvatarPrimitive.Root
    className={cn(
      "border-border/70 bg-muted relative flex size-10 shrink-0 overflow-hidden rounded-full border",
      className,
    )}
    {...props}
  />
);
export const AvatarImage = AvatarPrimitive.Image;
export const AvatarFallback = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>) => (
  <AvatarPrimitive.Fallback
    className={cn(
      "bg-muted text-foreground flex h-full w-full items-center justify-center rounded-full text-sm font-medium",
      className,
    )}
    {...props}
  />
);

export function AvatarGroup({
  avatars,
  className,
}: {
  avatars: Array<{ src?: string; alt: string; fallback?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center -space-x-3", className)}>
      {avatars.map((avatar, index) => (
        <Avatar key={`${avatar.alt}-${index}`} className="ring-background ring-2">
          {avatar.src ? <AvatarImage src={avatar.src} alt={avatar.alt} /> : null}
          <AvatarFallback>{avatar.fallback ?? avatar.alt.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("bg-muted/60 animate-pulse rounded-lg", className)} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("text-muted-foreground size-5 animate-spin", className)}
      aria-hidden="true"
    />
  );
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <ProgressPrimitive.Root
      className={cn("bg-muted relative h-2 w-full overflow-hidden rounded-full", className)}
      value={value}
    >
      <ProgressPrimitive.Indicator
        className="bg-primary h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${100 - value}%)` }}
      />
    </ProgressPrimitive.Root>
  );
}

export function CircularProgress({
  value,
  size = 72,
  strokeWidth = 8,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-label={`Progress ${value}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/60"
          fill="transparent"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          className="text-primary transition-all duration-300"
        />
      </svg>
      <span className="text-foreground absolute text-sm font-medium">{Math.round(value)}%</span>
    </div>
  );
}

export function Alert({
  title,
  description,
  variant = "default",
  action,
  className,
}: {
  title: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "error";
  action?: React.ReactNode;
  className?: string;
}) {
  const config = {
    default: { icon: AlertCircle, className: "border-border/70 bg-card" },
    success: { icon: CheckCircle2, className: "border-success/20 bg-success/10" },
    warning: { icon: AlertCircle, className: "border-warning/20 bg-warning/10" },
    error: { icon: Minus, className: "border-error/20 bg-error/10" },
  } as const;
  const Icon = config[variant].icon;

  return (
    <div className={cn("shadow-soft rounded-2xl border p-4", config[variant].className, className)}>
      <div className="flex items-start gap-3">
        <div className="bg-background/80 text-foreground mt-0.5 rounded-lg p-2">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          {description ? (
            <p className="text-muted-foreground mt-1 text-sm leading-6">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.24em]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-foreground mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("bg-border/70 h-px w-full", className)} />;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border-border/70 bg-muted/20 flex flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-16 text-center">
      {icon ? (
        <div className="border-border/60 bg-background/80 shadow-soft mb-4 rounded-2xl border p-3">
          {icon}
        </div>
      ) : null}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? (
        <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">{description}</p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="border-border/70 bg-card text-muted-foreground shadow-soft flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return <Alert title={title} description={description} variant="error" action={action} />;
}

export function StateScreen({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return <EmptyState title={title} description={description} action={action} icon={icon} />;
}

export function Toast({
  title,
  description,
  action,
  onClose,
  variant = "default",
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  variant?: "default" | "success" | "warning" | "error";
}) {
  return (
    <div
      className={cn(
        "bg-popover shadow-strong rounded-2xl border p-4 backdrop-blur-xl",
        variant === "success" && "border-success/20",
        variant === "warning" && "border-warning/20",
        variant === "error" && "border-error/20",
        variant === "default" && "border-border/70",
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="font-medium">{title}</p>
          {description ? <p className="text-muted-foreground mt-1 text-sm">{description}</p> : null}
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:bg-muted/70 hover:text-foreground rounded-md p-2 transition-colors"
            aria-label="Close toast"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
