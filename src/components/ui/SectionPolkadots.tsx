"use client";

import { motion } from "framer-motion";
import { spaceFloatGentle, spaceFloatPolkadot } from "@/lib/animations";
import { cn } from "@/lib/utils";

type DotAccent = "lime" | "sky" | "pink";

const dotThemes: Record<
  DotAccent,
  [{ bg: string; duration: number; delay: number }, { bg: string; duration: number; delay: number }]
> = {
  lime: [
    { bg: "bg-accent-4", duration: 11, delay: 0 },
    { bg: "bg-accent-3", duration: 13, delay: 0.35 },
  ],
  sky: [
    { bg: "bg-accent-2", duration: 12, delay: 0 },
    { bg: "bg-accent-3", duration: 14, delay: 0.4 },
  ],
  pink: [
    { bg: "bg-accent-2", duration: 11.5, delay: 0 },
    { bg: "bg-accent-4", duration: 13.5, delay: 0.3 },
  ],
};

const dotPositions = [
  "right-0 top-0 translate-x-[calc(100%-4px)] -translate-y-[calc(100%-4px)] sm:translate-x-[calc(100%-5px)] sm:-translate-y-[calc(100%-5px)]",
  "left-0 bottom-0 -translate-x-[calc(100%-4px)] translate-y-[calc(100%-4px)] sm:-translate-x-[calc(100%-5px)] sm:translate-y-[calc(100%-5px)]",
];

const sideDotPositions = [
  "-left-5 top-1/2 -translate-y-1/2 sm:-left-6",
  "-right-5 top-1/2 -translate-y-1/2 sm:-right-6",
];

export function SectionPolkadots({
  accent,
  layout = "corners",
  soft = false,
}: {
  accent: DotAccent;
  layout?: "corners" | "sides";
  soft?: boolean;
}) {
  const dots = dotThemes[accent];
  const positions = layout === "sides" ? sideDotPositions : dotPositions;

  return (
    <>
      {dots.map((dot, index) => (
        <span
          key={index}
          aria-hidden
          className={cn(
            "pointer-events-none absolute z-10",
            positions[index],
          )}
        >
          <motion.span
            {...(soft
              ? spaceFloatPolkadot(dot.duration, dot.delay)
              : spaceFloatGentle(dot.duration, dot.delay))}
            className={cn(
              "block rounded-full border-[3px] border-border shadow-[2px_2px_0_var(--border)]",
              layout === "sides" ? "h-3.5 w-3.5 sm:h-4 sm:w-4" : "h-3.5 w-3.5 sm:h-4 sm:w-4",
              dot.bg,
            )}
          />
        </span>
      ))}
    </>
  );
}
