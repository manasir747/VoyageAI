import React from "react";
import { ComponentPreview } from "@/components/ComponentPreview";
import { Button, IconButton, LoadingButton } from "@/components/ui/button";
import { ChevronRight, Mail, Home } from "lucide-react";

export function ButtonsSection() {
  return (
    <section id="buttons" className="flex scroll-mt-24 flex-col gap-8">
      <div className="border-border/60 flex flex-col gap-2 border-b pb-4">
        <h2 className="text-3xl font-bold tracking-tight">Buttons</h2>
        <p className="text-muted-foreground">
          Interactive button components with various sizes, states, and variants.
        </p>
      </div>

      <ComponentPreview
        name="Variants"
        description="Core visual variants for different levels of hierarchy."
        props={[
          {
            name: "variant",
            type: "enum",
            description: "The visual style of the button",
            default: "default",
          },
        ]}
        variants={[
          "default",
          "secondary",
          "accent",
          "success",
          "warning",
          "error",
          "outline",
          "ghost",
          "glass",
          "soft",
          "link",
        ]}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="error">Error</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="glass">Glass</Button>
          <Button variant="soft">Soft</Button>
          <Button variant="link">Link</Button>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Sizes"
        description="Different sizes for various UI contexts."
        props={[
          { name: "size", type: "enum", description: "The size of the button", default: "default" },
        ]}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </ComponentPreview>

      <ComponentPreview name="Icon Buttons" description="Buttons containing only icons.">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <IconButton size="iconSm">
            <Home className="size-4" />
          </IconButton>
          <IconButton size="icon">
            <Home className="size-5" />
          </IconButton>
          <IconButton size="iconLg">
            <Home className="size-6" />
          </IconButton>
        </div>
      </ComponentPreview>

      <ComponentPreview
        name="Loading State"
        description="Button showing a loading indicator."
        props={[
          {
            name: "loading",
            type: "boolean",
            description: "Shows a spinner when true",
            default: "false",
          },
        ]}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <LoadingButton loading={true}>Saving...</LoadingButton>
          <LoadingButton loading={false} icon={<Mail className="size-4" />}>
            Send Email
          </LoadingButton>
        </div>
      </ComponentPreview>

      <ComponentPreview name="With Icons" description="Buttons with leading or trailing icons.">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button>
            <Mail className="size-4" /> Email Us
          </Button>
          <Button variant="outline">
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      </ComponentPreview>
    </section>
  );
}
