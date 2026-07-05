import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />
  );
}

export function Grid({
  className,
  columns = 12,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { columns?: number }) {
  return (
    <div
      className={cn("grid gap-6", className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      {...props}
    />
  );
}

export function Stack({
  className,
  gap = 6,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { gap?: number }) {
  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ gap: `${gap * 0.25}rem` }}
      {...props}
    />
  );
}

export function Section({
  className,
  children,
  ...props
}: React.PropsWithChildren<React.HTMLAttributes<HTMLElement>>) {
  return (
    <section className={cn("relative py-16 sm:py-20 lg:py-24", className)} {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export function PageWrapper({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return <main className={cn("min-h-screen", className)}>{children}</main>;
}

export function Navbar({
  brand,
  actions,
  children,
  className,
}: React.PropsWithChildren<{
  brand?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}>) {
  return (
    <header
      className={cn(
        "border-border/60 bg-background/80 sticky top-0 z-30 border-b backdrop-blur-xl",
        className,
      )}
    >
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {brand}
            {children ? <nav className="hidden items-center gap-2 md:flex">{children}</nav> : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
      </Container>
    </header>
  );
}

export function Footer({
  brand,
  links,
  className,
}: {
  brand?: React.ReactNode;
  links?: React.ReactNode;
  className?: string;
}) {
  return (
    <footer className={cn("border-border/60 bg-muted/20 border-t", className)}>
      <Container>
        <div className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>{brand}</div>
          <div>{links}</div>
        </div>
      </Container>
    </footer>
  );
}

export function HeroWrapper({
  className,
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn(
        "border-border/60 bg-hero-radial relative overflow-hidden border-b py-20 sm:py-24 lg:py-28",
        className,
      )}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function DashboardLayoutWrapper({
  sidebar,
  topbar,
  children,
  className,
}: React.PropsWithChildren<{
  sidebar?: React.ReactNode;
  topbar?: React.ReactNode;
  className?: string;
}>) {
  return (
    <div className={cn("grid h-screen overflow-hidden lg:grid-cols-[280px_1fr]", className)}>
      <aside className="border-border/60 bg-muted/20 hidden overflow-y-auto border-r lg:block">
        {sidebar}
      </aside>
      <div className="flex min-w-0 flex-col overflow-hidden">
        {topbar ? (
          <div className="border-border/60 bg-background/80 z-20 shrink-0 border-b backdrop-blur-xl">
            {topbar}
          </div>
        ) : null}
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="bg-muted/60 h-10 w-40 rounded-xl" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-muted/50 h-10 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function TopbarSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="bg-muted/60 h-10 w-56 rounded-xl" />
      <div className="flex items-center gap-3">
        <div className="bg-muted/60 h-10 w-10 rounded-full" />
        <div className="bg-muted/60 h-10 w-10 rounded-full" />
      </div>
    </div>
  );
}
