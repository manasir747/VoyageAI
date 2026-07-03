import React from "react";
import { cn } from "@/lib/utils";

export interface ComponentPreviewProps {
  name: string;
  description: string;
  props?: Array<{ name: string; type: string; description: string; default?: string }>;
  variants?: string[];
  usageGuidelines?: string[];
  accessibilityNotes?: string[];
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}

export function ComponentPreview({
  name,
  description,
  props,
  variants,
  usageGuidelines,
  accessibilityNotes,
  children,
  className,
  previewClassName,
}: ComponentPreviewProps) {
  return (
    <div
      className={cn(
        "border-border/60 bg-background/50 hover:border-border/80 group flex flex-col gap-6 rounded-3xl border p-6 shadow-sm transition-all md:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-xl font-semibold tracking-tight">{name}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div
        className={cn(
          "border-border/60 bg-muted/20 flex min-h-[200px] w-full flex-col items-center justify-center gap-6 rounded-2xl border p-8 shadow-inner",
          previewClassName,
        )}
      >
        {children}
      </div>

      <div className="flex flex-col gap-8 text-sm">
        {props && props.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-foreground font-semibold">Props</h4>
            <div className="border-border/60 overflow-x-auto rounded-xl border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-muted-foreground px-4 py-3 font-medium">Prop</th>
                    <th className="text-muted-foreground px-4 py-3 font-medium">Type</th>
                    <th className="text-muted-foreground px-4 py-3 font-medium">Default</th>
                    <th className="text-muted-foreground px-4 py-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {props.map((prop, i) => (
                    <tr key={i}>
                      <td className="text-primary px-4 py-3 font-mono text-xs font-semibold">
                        {prop.name}
                      </td>
                      <td className="text-secondary-foreground px-4 py-3 font-mono text-xs">
                        {prop.type}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {prop.default || "-"}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">{prop.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {variants && variants.length > 0 && (
          <div className="flex flex-col gap-2">
            <h4 className="text-foreground font-semibold">Variants</h4>
            <ul className="text-muted-foreground list-inside list-disc space-y-1">
              {variants.map((variant, i) => (
                <li key={i}>{variant}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {usageGuidelines && usageGuidelines.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-foreground font-semibold">Usage Guidelines</h4>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                {usageGuidelines.map((guideline, i) => (
                  <li key={i}>{guideline}</li>
                ))}
              </ul>
            </div>
          )}

          {accessibilityNotes && accessibilityNotes.length > 0 && (
            <div className="flex flex-col gap-2">
              <h4 className="text-foreground font-semibold">Accessibility Notes</h4>
              <ul className="text-muted-foreground list-inside list-disc space-y-1">
                {accessibilityNotes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
