"use client";
import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import { Timeline, DataTable } from "@/components/ui/data";
import {
  Badge,
  Chip,
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
} from "@/components/ui/feedback";

export function DataDisplaySection() {
  return (
    <section id="data-display" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Data Display</h2>
        <p className="text-muted-foreground">
          Components for showing data, lists, and user identities.
        </p>
      </div>

      <ComponentPreview name="Data Table" description="For structured tabular data.">
        <div className="w-full">
          <DataTable
            columns={[
              {
                key: "flight",
                header: "Flight",
                cell: (row) => row.flight,
                className: "font-medium text-foreground",
              },
              { key: "route", header: "Route", cell: (row) => row.route },
              {
                key: "status",
                header: "Status",
                cell: (row) => (
                  <Badge variant={row.status === "On Time" ? "success" : "warning"}>
                    {row.status}
                  </Badge>
                ),
              },
            ]}
            data={[
              { flight: "JL 001", route: "SFO → HND", status: "On Time" },
              { flight: "UA 837", route: "SFO → NRT", status: "Delayed" },
              { flight: "ANA 107", route: "SJC → HND", status: "On Time" },
            ]}
          />
        </div>
      </ComponentPreview>

      <ComponentPreview name="Timeline" description="Display chronological events.">
        <div className="w-full max-w-md">
          <Timeline
            items={[
              { title: "Depart SFO", description: "Terminal 2, Gate D5", meta: "10:30 AM" },
              { title: "Arrive HND", description: "Terminal 3", meta: "2:45 PM (+1)" },
              { title: "Hotel Check-in", description: "Park Hyatt Tokyo", meta: "4:00 PM" },
            ]}
          />
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Badges & Chips"
        description="Small status indicators and removable tags."
      >
        <div className="flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="error">Error</Badge>
            <Badge variant="glass">Glass</Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Chip>Japan</Chip>
            <Chip onRemove={() => {}}>Kyoto</Chip>
            <Chip onRemove={() => {}}>Temples</Chip>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview name="Avatars" description="User profile pictures and groups.">
        <div className="flex flex-col items-center gap-6">
          <div className="flex gap-4">
            <Avatar>
              <AvatarFallback>AL</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>SH</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <AvatarGroup
              avatars={[
                { alt: "Alice", fallback: "AL" },
                { alt: "Bob", fallback: "BO" },
                { alt: "Charlie", src: "https://github.com/shadcn.png", fallback: "CH" },
              ]}
            />
          </div>
        </div>
      </ComponentPreview>
    </section>
  );
}
