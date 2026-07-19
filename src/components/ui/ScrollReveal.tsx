"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  revealViewport,
  scrollRevealLeft,
  scrollRevealPop,
  scrollRevealRight,
  scrollRevealUp,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

type RevealPreset = "up" | "left" | "right" | "pop";

const presetVariants: Record<RevealPreset, Variants> = {
  up: scrollRevealUp,
  left: scrollRevealLeft,
  right: scrollRevealRight,
  pop: scrollRevealPop,
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  preset?: RevealPreset;
  delay?: number;
}

export function ScrollReveal({
  children,
  className,
  preset = "up",
  delay = 0,
}: ScrollRevealProps) {
  return (
    <motion.div
      variants={presetVariants[preset]}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ delay }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
