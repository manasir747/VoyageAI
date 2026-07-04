"use client";

import React from "react";
import dynamic from "next/dynamic";

const GlowBackground = dynamic(
  () => import("@/components/three/three").then((m) => m.GlowBackground),
  { ssr: false },
);

export function GlowBackgroundClient() {
  return <GlowBackground />;
}
