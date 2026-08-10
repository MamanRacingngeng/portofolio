"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { spaceFloatGentle, spaceFloatSoft } from "@/lib/animations";

const shapes = [
  {
    className:
      "right-[4%] top-[10%] h-20 w-20 bg-accent-2 sm:h-24 sm:w-24 lg:right-[8%] lg:h-28 lg:w-28",
    depth: 0.45,
    float: spaceFloatSoft(14, 0),
  },
  {
    className:
      "left-[2%] top-[34%] h-12 w-32 bg-accent-3 sm:left-[6%] sm:h-14 sm:w-36",
    depth: 0.28,
    float: spaceFloatGentle(16, 0.4),
  },
  {
    className:
      "right-[8%] top-[52%] h-16 w-16 rounded-full bg-accent-4 sm:h-20 sm:w-20 lg:right-[12%]",
    depth: 0.55,
    float: spaceFloatGentle(12, 0.8),
  },
  {
    className:
      "left-[6%] bottom-[16%] h-14 w-14 bg-accent-2 sm:h-16 sm:w-16 lg:left-[10%]",
    depth: 0.35,
    float: spaceFloatSoft(18, 1.1),
  },
  {
    className:
      "right-[22%] bottom-[10%] hidden h-10 w-28 bg-accent-3 sm:block lg:right-[26%]",
    depth: 0.2,
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
  const y = useTransform(scrollY, [0, 1200], [0, reduceMotion ? 0 : -1200 * depth]);

  return (
    <motion.span
      style={{ y }}
      className={`absolute border-[3px] border-border shadow-[5px_5px_0_var(--border)] ${className}`}
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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
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
