"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { spaceFloatGentle, spaceFloatSoft } from "@/lib/animations";

const shapes = [
  {
    className:
      "right-[6%] top-[12%] h-16 w-16 bg-accent-2 sm:h-20 sm:w-20 lg:right-[10%] lg:top-[10%] lg:h-24 lg:w-24",
    depth: 0.22,
    float: spaceFloatSoft(14, 0),
  },
  {
    className:
      "left-[4%] top-[38%] h-10 w-24 bg-accent-3 sm:left-[8%] sm:h-12 sm:w-28",
    depth: 0.14,
    float: spaceFloatGentle(16, 0.4),
  },
  {
    className:
      "right-[12%] top-[58%] h-14 w-14 rounded-full bg-accent-4 sm:h-16 sm:w-16 lg:right-[16%]",
    depth: 0.3,
    float: spaceFloatGentle(12, 0.8),
  },
  {
    className:
      "left-[10%] bottom-[18%] h-12 w-12 bg-accent-2 sm:h-14 sm:w-14 lg:left-[14%]",
    depth: 0.18,
    float: spaceFloatSoft(18, 1.1),
  },
  {
    className:
      "right-[28%] bottom-[8%] hidden h-8 w-20 bg-accent-3 sm:block lg:right-[32%]",
    depth: 0.1,
    float: spaceFloatGentle(15, 0.6),
  },
] as const;

function ParallaxShape({
  className,
  depth,
  float,
  scrollY,
  reduceMotion,
}: {
  className: string;
  depth: number;
  float: { animate: Record<string, number[]>; transition: Record<string, unknown> };
  scrollY: ReturnType<typeof useScroll>["scrollY"];
  reduceMotion: boolean | null;
}) {
  const y = useTransform(scrollY, [0, 2400], [0, reduceMotion ? 0 : -2400 * depth]);

  return (
    <motion.span
      style={{ y }}
      className={`absolute border-[3px] border-border shadow-[4px_4px_0_var(--border)] ${className}`}
    >
      {!reduceMotion ? (
        <motion.span {...float} className="block h-full w-full" />
      ) : (
        <span className="block h-full w-full" />
      )}
    </motion.span>
  );
}

export function AnimatedBackground() {
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden opacity-70 dark:opacity-45"
    >
      {shapes.map((shape, index) => (
        <ParallaxShape
          key={index}
          className={shape.className}
          depth={shape.depth}
          float={shape.float}
          scrollY={scrollY}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}
