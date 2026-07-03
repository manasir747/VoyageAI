import React from "react";

export const metadata = {
  title: "VoyageAI Design System",
  description: "Internal Design System Showcase",
};

const navItems = [
  { label: "Typography", href: "#typography" },
  { label: "Color Palette", href: "#color-palette" },
  { label: "Spacing", href: "#spacing" },
  { label: "Buttons", href: "#buttons" },
  { label: "Cards", href: "#cards" },
  { label: "Inputs", href: "#inputs" },
  { label: "Navigation", href: "#navigation" },
  { label: "Feedback", href: "#feedback" },
  { label: "Data Display", href: "#data-display" },
  { label: "Motion", href: "#motion" },
  { label: "3D", href: "#3d" },
  { label: "Theme", href: "#theme" },
  { label: "Forms", href: "#forms" },
  { label: "Accessibility", href: "#accessibility" },
];

export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col md:flex-row">
      <aside className="border-border/60 bg-muted/20 sticky top-0 z-40 flex h-screen w-full flex-col border-r md:w-64 lg:w-72">
        <div className="border-border/60 flex h-16 shrink-0 items-center border-b px-6">
          <h1 className="text-lg font-semibold tracking-tight">VoyageAI UI</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1 px-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-muted-foreground hover:bg-muted/50 hover:text-foreground flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-5xl px-4 py-12 md:px-8 lg:py-16">
          <div className="mb-12 flex flex-col gap-4">
            <h2 className="text-4xl font-bold tracking-tight">Design System Showcase</h2>
            <p className="text-muted-foreground text-lg">
              Internal reference for reusable components, animations, and design tokens.
            </p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
