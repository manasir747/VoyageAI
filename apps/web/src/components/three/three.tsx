"use client";

import * as React from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Float, Html, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { motion, useReducedMotion } from "framer-motion";
import { CanvasProvider } from "@/components/providers/canvas-provider";
import { cn } from "@/lib/utils";

export function FloatingOrb({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("pointer-events-none absolute rounded-full bg-gradient-to-br from-primary/30 via-accent/25 to-transparent blur-3xl", className)}
      animate={reducedMotion ? undefined : { x: [0, 18, -10, 0], y: [0, -16, 10, 0], scale: [1, 1.06, 0.98, 1] }}
      transition={{ duration: 10, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
    />
  );
}

export function GradientBlob({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("pointer-events-none absolute rounded-full bg-gradient-to-tr from-primary/25 via-secondary/20 to-accent/25 blur-3xl", className)}
      animate={reducedMotion ? undefined : { rotate: [0, 12, -8, 0], scale: [1, 1.08, 0.96, 1] }}
      transition={{ duration: 12, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
    />
  );
}

export function GlowBackground({ className }: { className?: string }) {
  return <div className={cn("pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.16),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.16),transparent_28%)]", className)} />;
}

export function AnimatedGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(148,163,184,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.14)_1px,transparent_1px)] [background-size:48px_48px] animate-gridShift",
        className,
      )}
    />
  );
}

function ParticleScene() {
  const ref = React.useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const reducedMotion = useReducedMotion();

  const particles = React.useMemo(() => {
    const count = 180;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3 + 0] = (Math.random() - 0.5) * viewport.width * 1.5;
      positions[index * 3 + 1] = (Math.random() - 0.5) * viewport.height * 1.5;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return positions;
  }, [viewport.height, viewport.width]);

  useFrame(({ clock }) => {
    if (!ref.current || reducedMotion) return;
    ref.current.rotation.y = clock.elapsedTime * 0.05;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.15) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={new THREE.Color("#93c5fd")} size={0.02} sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

export function ParticleBackground({ className }: { className?: string }) {
  return (
    <CanvasProvider className={cn("pointer-events-none absolute inset-0", className)}>
      <PerspectiveCamera makeDefault position={[0, 0, 6]} />
      <ambientLight intensity={0.6} />
      <ParticleScene />
    </CanvasProvider>
  );
}

export function ThreeCardWrapper({ children, className }: React.PropsWithChildren<{ className?: string }>) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const node = ref.current;
    if (!node || reducedMotion) return;

    const handleMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -10;
      node.style.transform = `perspective(1200px) rotateX(${y}deg) rotateY(${x}deg) translateZ(0)`;
    };

    const handleLeave = () => {
      node.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    };

    node.addEventListener("pointermove", handleMove);
    node.addEventListener("pointerleave", handleLeave);
    return () => {
      node.removeEventListener("pointermove", handleMove);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [reducedMotion]);

  return (
    <div ref={ref} className={cn("transform-gpu will-change-transform", className)} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}
