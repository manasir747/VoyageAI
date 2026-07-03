"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.99]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-soft hover:shadow-medium hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        accent: "bg-accent text-accent-foreground shadow-soft hover:shadow-medium hover:bg-accent/90",
        success: "bg-success text-success-foreground hover:opacity-90",
        warning: "bg-warning text-warning-foreground hover:opacity-90",
        error: "bg-error text-error-foreground hover:opacity-90",
        outline: "border border-border bg-background/80 text-foreground hover:bg-muted/60",
        ghost: "bg-transparent text-foreground hover:bg-muted/60",
        glass: "border border-glass-border bg-glass text-foreground shadow-glass backdrop-blur-xl hover:bg-glass/90",
        soft: "bg-muted text-foreground hover:bg-muted/80",
        link: "bg-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3 rounded-md text-xs",
        lg: "h-12 px-6 rounded-xl text-base",
        icon: "h-11 w-11",
        iconSm: "h-9 w-9",
        iconLg: "h-12 w-12",
      },
      radius: {
        default: "",
        pill: "rounded-pill",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, radius, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, radius }), className)} {...props} />;
  },
);
Button.displayName = "Button";

export function IconButton({ className, children, ...props }: ButtonProps) {
  return (
    <Button className={cn("shrink-0", className)} size="icon" variant="glass" {...props}>
      {children}
    </Button>
  );
}

export function LoadingButton({
  loading,
  children,
  className,
  icon,
  ...props
}: ButtonProps & { loading?: boolean; icon?: React.ReactNode }) {
  return (
    <Button className={className} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : icon ?? <Plus className="size-4" aria-hidden="true" />}
      <span>{children}</span>
    </Button>
  );
}

export function FloatingActionButton({ className, children, ...props }: ButtonProps) {
  return (
    <Button
      className={cn("fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-strong", className)}
      size="iconLg"
      variant="default"
      {...props}
    >
      {children}
    </Button>
  );
}

export { buttonVariants };
