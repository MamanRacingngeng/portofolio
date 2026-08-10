"use client";

import { useScroll, motion, useReducedMotion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-accent-2"
      style={{ scaleX: scrollYProgress }}
      aria-hidden
    />
  );
}
