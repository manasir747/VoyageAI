"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionProps,
} from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createMagneticEffect,
  createParallaxEffect,
  fadeVariants,
  hoverLift,
  motionDurations,
  pageTransitionVariants,
  revealVariants,
  rotateVariants,
  routeTransitionVariants,
  scaleVariants,
  slideVariants,
  staggerContainer,
  textRevealVariants,
} from "@/lib/animations";

type MotionWrapperProps = React.PropsWithChildren<
  {
    className?: string;
    delay?: number;
    duration?: number;
  } & MotionProps
>;

function shouldDisableMotion(reducedMotion: boolean | null | undefined) {
  return Boolean(reducedMotion);
}

export function Fade({ children, className, delay = 0, duration, ...props }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: duration ?? motionDurations.normal }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Slide({
  children,
  direction = "up",
  className,
  delay = 0,
  duration,
  ...props
}: MotionWrapperProps & { direction?: keyof typeof slideVariants }) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      variants={slideVariants[direction]}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: duration ?? motionDurations.normal }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Scale({ children, className, delay = 0, duration, ...props }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: duration ?? motionDurations.normal }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Rotate({ children, className, delay = 0, duration, ...props }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      variants={rotateVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: duration ?? motionDurations.normal }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Reveal({ children, className, delay = 0, duration, ...props }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay, duration: duration ?? motionDurations.slow }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, ...props }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Hover({ children, className, ...props }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div className={className} {...hoverLift} {...props}>
      {children}
    </motion.div>
  );
}

export function MagneticButton({ children, className, ...props }: ButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!ref.current || shouldDisableMotion(reducedMotion)) return;
    return createMagneticEffect(ref.current);
  }, [reducedMotion]);

  return (
    <Button ref={ref} className={cn(className)} {...props}>
      {children}
    </Button>
  );
}

export function Parallax({
  children,
  className,
  strength = 14,
  ...props
}: MotionWrapperProps & { strength?: number }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    if (!ref.current || shouldDisableMotion(reducedMotion)) return;
    return createParallaxEffect(ref.current, strength);
  }, [reducedMotion, strength]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElements({
  children,
  className,
  amplitude = 8,
  ...props
}: MotionWrapperProps & { amplitude?: number }) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      className={className}
      animate={{ y: [-amplitude, amplitude, -amplitude] }}
      transition={{ duration: 4, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SmoothPageTransitionWrapper({ children, className }: MotionWrapperProps) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion)) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

export function RouteTransitionWrapper({
  children,
  routeKey,
  className,
}: React.PropsWithChildren<{ routeKey: string; className?: string }>) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={routeKey}
        className={className}
        variants={routeTransitionVariants}
        initial={shouldDisableMotion(reducedMotion) ? false : "initial"}
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function ScrollReveal({
  children,
  className,
  once = true,
  amount = 0.2,
  ...props
}: MotionWrapperProps & { once?: boolean; amount?: number }) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once, amount });
  const reducedMotion = useReducedMotion();

  if (shouldDisableMotion(reducedMotion))
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={slideVariants.up}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function MouseFollow({
  children,
  className,
  glowClassName,
}: React.PropsWithChildren<{ className?: string; glowClassName?: string }>) {
  const [position, setPosition] = React.useState({ x: 50, y: 50 });
  const reducedMotion = useReducedMotion();

  if (shouldDisableMotion(reducedMotion)) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({
          x: ((event.clientX - rect.left) / rect.width) * 100,
          y: ((event.clientY - rect.top) / rect.height) * 100,
        });
      }}
    >
      <motion.div
        className={cn("pointer-events-none absolute inset-0", glowClassName)}
        animate={{
          background: `radial-gradient(circle at ${position.x}% ${position.y}%, rgba(255,255,255,0.18), transparent 30%)`,
        }}
        transition={{ duration: 0.18 }}
      />
      {children}
    </div>
  );
}

export function TextReveal({ text, className }: { text: string; className?: string }) {
  const reducedMotion = useReducedMotion();
  if (shouldDisableMotion(reducedMotion)) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={cn("inline-block", className)}
      variants={textRevealVariants}
      initial="hidden"
      animate="visible"
    >
      {text}
    </motion.span>
  );
}

export function CounterAnimation({
  value,
  suffix,
  prefix = "",
  className,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 120, damping: 24, mass: 1 });
  const rounded = useTransform(spring, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (shouldDisableMotion(reducedMotion)) {
      setDisplayValue(value);
      return;
    }

    motionValue.set(0);
    motionValue.stop();
    motionValue.set(value);
  }, [motionValue, reducedMotion, value]);

  React.useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest);
    });
    return () => unsubscribe();
  }, [rounded]);

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
}

export { motionCurves, motionDurations } from "@/lib/animations";
