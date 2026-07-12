"use client";

import { motion } from "framer-motion";
import { spaceFloatGentle } from "@/lib/animations";
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
  "-right-2 -top-2 sm:-right-2.5 sm:-top-2.5",
  "-left-2 -bottom-2 sm:-left-2.5 sm:-bottom-2.5",
];

export function SectionPolkadots({ accent }: { accent: DotAccent }) {
  const dots = dotThemes[accent];

  return (
    <>
      {dots.map((dot, index) => (
        <motion.span
          key={index}
          aria-hidden
          {...spaceFloatGentle(dot.duration, dot.delay)}
          className={cn(
            "pointer-events-none absolute z-10 h-3.5 w-3.5 rounded-full border-[3px] border-border shadow-[2px_2px_0_var(--border)] sm:h-4 sm:w-4",
            dot.bg,
            dotPositions[index]
          )}
        />
      ))}
    </>
  );
}
