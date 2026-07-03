"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";

export function CanvasProvider({
  children,
  fallback = null,
  ...canvasProps
}: CanvasProps & { children: ReactNode; fallback?: ReactNode }) {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 8], fov: 45 }}
      {...canvasProps}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </Canvas>
  );
}
