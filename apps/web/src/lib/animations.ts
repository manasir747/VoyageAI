import { gsap } from "gsap";
import type { Variants } from "framer-motion";

export const motionCurves = {
  standard: [0.2, 0.8, 0.2, 1] as const,
  expressive: [0.16, 1, 0.3, 1] as const,
  crisp: [0.4, 0, 0.2, 1] as const,
  soft: [0.25, 0.1, 0.25, 1] as const,
} as const;

export const motionDurations = {
  fastest: 0.12,
  fast: 0.18,
  normal: 0.24,
  slow: 0.32,
  slower: 0.48,
  cinematic: 0.7,
} as const;

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: motionDurations.normal, ease: motionCurves.standard } },
};

export const slideVariants = {
  up: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: motionDurations.normal, ease: motionCurves.standard } },
  },
  down: {
    hidden: { opacity: 0, y: -16 },
    visible: { opacity: 1, y: 0, transition: { duration: motionDurations.normal, ease: motionCurves.standard } },
  },
  left: {
    hidden: { opacity: 0, x: 16 },
    visible: { opacity: 1, x: 0, transition: { duration: motionDurations.normal, ease: motionCurves.standard } },
  },
  right: {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: motionDurations.normal, ease: motionCurves.standard } },
  },
} as const;

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: motionDurations.normal, ease: motionCurves.expressive } },
};

export const rotateVariants: Variants = {
  hidden: { opacity: 0, rotate: -4 },
  visible: { opacity: 1, rotate: 0, transition: { duration: motionDurations.normal, ease: motionCurves.expressive } },
};

export const revealVariants: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
  visible: { opacity: 1, clipPath: "inset(0 0 0% 0)", transition: { duration: motionDurations.slow, ease: motionCurves.expressive } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const hoverLift = {
  initial: { y: 0, scale: 1 },
  whileHover: { y: -4, scale: 1.01, transition: { duration: motionDurations.fast, ease: motionCurves.soft } },
  whileTap: { y: -1, scale: 0.99 },
};

export const textRevealVariants: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: motionDurations.slower, ease: motionCurves.expressive } },
};

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: motionDurations.normal, ease: motionCurves.expressive } },
  exit: { opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: motionDurations.fast, ease: motionCurves.crisp } },
};

export const routeTransitionVariants: Variants = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1, transition: { duration: motionDurations.normal, ease: motionCurves.expressive } },
  exit: { opacity: 0, scale: 1.01, transition: { duration: motionDurations.fast, ease: motionCurves.crisp } },
};

export function createMagneticEffect(element: HTMLElement, strength = 18) {
  const handleMove = (event: PointerEvent) => {
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: (x / rect.width) * strength,
      y: (y / rect.height) * strength,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  element.addEventListener("pointermove", handleMove);
  element.addEventListener("pointerleave", handleLeave);

  return () => {
    element.removeEventListener("pointermove", handleMove);
    element.removeEventListener("pointerleave", handleLeave);
  };
}

export function createParallaxEffect(element: HTMLElement, strength = 12) {
  const handleMove = (event: PointerEvent) => {
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      rotateX: y * -strength * 0.5,
      rotateY: x * strength * 0.5,
      duration: 0.35,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  element.addEventListener("pointermove", handleMove);
  element.addEventListener("pointerleave", handleLeave);

  return () => {
    element.removeEventListener("pointermove", handleMove);
    element.removeEventListener("pointerleave", handleLeave);
  };
}

export function createFloatingEffect(targets: gsap.TweenTarget, amplitude = 8) {
  return gsap.to(targets, {
    y: `-=${amplitude}`,
    duration: 2.4,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.15,
  });
}
