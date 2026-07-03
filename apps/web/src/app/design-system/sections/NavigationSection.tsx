"use client";
import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Breadcrumb,
  Pagination,
  CommandPalette,
} from "@/components/ui/navigation";

export function NavigationSection() {
  return (
    <section id="navigation" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Navigation</h2>
        <p className="text-muted-foreground">Components for moving through the application.</p>
      </div>

      <ComponentPreview name="Tabs" description="Switch between different views.">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="border-border/70 bg-card mt-2 rounded-xl border p-4">
              <p className="text-sm">Account settings content here.</p>
            </div>
          </TabsContent>
          <TabsContent value="password">
            <div className="border-border/70 bg-card mt-2 rounded-xl border p-4">
              <p className="text-sm">Password settings content here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </ComponentPreview>

      <ComponentPreview
        name="Accordion"
        description="Vertically stacked set of interactive headings."
      >
        <Accordion type="single" collapsible className="w-[400px]">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other components&apos; aesthetic.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ComponentPreview>

      <ComponentPreview
        name="Breadcrumb"
        description="Indicates the current page's location within a navigational hierarchy."
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "#" },
            { label: "Trips", href: "#" },
            { label: "Japan 2026", current: true },
          ]}
        />
      </ComponentPreview>

      <ComponentPreview name="Pagination" description="Navigation for paged content.">
        <Pagination page={3} totalPages={10} onPageChange={() => {}} />
      </ComponentPreview>

      <ComponentPreview name="Command Palette" description="Fast, keyboard-driven navigation.">
        <div className="w-[400px]">
          <CommandPalette placeholder="Type a command or search...">
            <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
              Suggestions
            </div>
            <button className="hover:bg-muted/70 flex w-full items-center rounded-lg px-2 py-1.5 text-sm">
              Create new trip
            </button>
            <button className="hover:bg-muted/70 flex w-full items-center rounded-lg px-2 py-1.5 text-sm">
              View dashboard
            </button>
            <button className="hover:bg-muted/70 flex w-full items-center rounded-lg px-2 py-1.5 text-sm">
              Search destinations
            </button>
          </CommandPalette>
        </div>
      </ComponentPreview>
    </section>
  );
}
