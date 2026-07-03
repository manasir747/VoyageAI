"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) => <AccordionPrimitive.Item className={cn("border-b border-border/60", className)} {...props} />;
export const AccordionTrigger = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger className={cn("flex flex-1 items-center justify-between py-4 text-left text-sm font-medium transition-all hover:text-foreground [&[data-state=open]>svg]:rotate-90", className)} {...props}>
      {children}
      <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform duration-200" aria-hidden="true" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);
export const AccordionContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) => (
  <AccordionPrimitive.Content className={cn("overflow-hidden text-sm text-muted-foreground data-[state=closed]:animate-up data-[state=open]:animate-down", className)} {...props} />
);

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => <TabsPrimitive.List className={cn("inline-flex h-11 items-center justify-center rounded-2xl border border-border/60 bg-muted/40 p-1 text-muted-foreground", className)} {...props} />;
export const TabsTrigger = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => <TabsPrimitive.Trigger className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-soft", className)} {...props} />;
export const TabsContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => <TabsPrimitive.Content className={cn("mt-4 focus-visible:outline-none", className)} {...props} />;

export function Breadcrumb({
  items,
  className,
}: {
  items: Array<{ label: string; href?: string; current?: boolean }>;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="flex items-center gap-2">
          {item.href && !item.current ? (
            <a href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ) : (
            <span className={item.current ? "text-foreground" : undefined}>{item.label}</span>
          )}
          {index < items.length - 1 ? <ChevronRight className="size-4" aria-hidden="true" /> : null}
        </div>
      ))}
    </nav>
  );
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className={cn("flex items-center gap-2", className)} aria-label="Pagination">
      <button type="button" className="rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/70 disabled:opacity-50" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <div className="flex items-center gap-1">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() => onPageChange(pageNumber)}
            className={cn(
              "flex size-10 items-center justify-center rounded-lg border border-border/70 text-sm transition-colors hover:bg-muted/70",
              pageNumber === page && "border-primary bg-primary text-primary-foreground",
            )}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button type="button" className="rounded-lg border border-border/70 px-3 py-2 text-sm hover:bg-muted/70 disabled:opacity-50" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}

export function CommandPalette({ className, placeholder = "Type a command...", children }: React.PropsWithChildren<{ className?: string; placeholder?: string }>) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border/70 bg-popover shadow-strong", className)}>
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        <MoreHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
        <input className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder={placeholder} aria-label={placeholder} />
      </div>
      <div className="max-h-[22rem] overflow-auto p-2">{children}</div>
    </div>
  );
}
