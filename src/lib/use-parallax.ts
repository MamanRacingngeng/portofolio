"use client";

import { useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ParallaxOptions = {
  /** Negative = moves up on scroll, positive = moves down */
  speed?: number;
  /** Pixel travel range at full scroll through viewport */
  offset?: number;
};

export function useSectionParallax({
  speed = 0.35,
  offset = 56,
}: ParallaxOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [-offset * speed, offset * speed],
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.88, 1],
    reduceMotion ? [1, 1, 1, 1] : [0.72, 1, 1, 0.72],
  );

  return { ref, y, opacity, scrollYProgress };
}

export function useGlobalParallax(
  input: [number, number],
  output: [number, number],
) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  return useTransform(scrollY, input, reduceMotion ? [0, 0] : output);
}
