"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useSectionParallax } from "@/lib/use-parallax";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  offset?: number;
  fade?: boolean;
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.35,
  offset = 56,
  fade = false,
}: ParallaxLayerProps) {
  const { ref, y, opacity } = useSectionParallax({ speed, offset });

  return (
    <motion.div
      ref={ref}
      style={fade ? { y, opacity } : { y }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
