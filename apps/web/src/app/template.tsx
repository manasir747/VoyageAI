"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { RouteTransitionWrapper } from "@/components/motion/motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <RouteTransitionWrapper routeKey={pathname} className="min-h-screen">
      {children}
    </RouteTransitionWrapper>
  );
}
