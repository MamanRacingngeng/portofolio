"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const dotColors = ["bg-accent-3", "bg-accent-4", "bg-accent-2"] as const;

function MarqueeSeparator({ index }: { index: number }) {
  return (
    <span
      aria-hidden
      className="mx-8 inline-flex shrink-0 items-center gap-2 sm:mx-10 sm:gap-2.5"
    >
      {dotColors.map((color, dotIndex) => (
        <motion.span
          key={dotIndex}
          animate={{ y: [0, -5, 0, 4, 0] }}
          transition={{
            duration: 2.4 + dotIndex * 0.25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.12 + dotIndex * 0.18,
          }}
          className={cn(
            "h-2.5 w-2.5 rounded-full border-2 border-border shadow-[2px_2px_0_var(--border)] sm:h-3 sm:w-3",
            color,
          )}
        />
      ))}
    </span>
  );
}

function MarqueeSequence({ text, repeats }: { text: string; repeats: number }) {
  return (
    <>
      {Array.from({ length: repeats }, (_, repeatIndex) => (
        <Fragment key={repeatIndex}>
          <span>{text}</span>
          <MarqueeSeparator index={repeatIndex} />
        </Fragment>
      ))}
    </>
  );
}

interface MarqueeContentProps {
  text: string;
}

export function MarqueeContent({ text }: MarqueeContentProps) {
  const repeats = 3;
  const trackClassName =
    "flex shrink-0 items-center font-display text-3xl font-black uppercase leading-none tracking-wide text-fg sm:text-4xl md:text-5xl";

  return (
    <div className="marquee-track overflow-x-hidden py-7 sm:py-9">
      <div className="animate-drift flex w-max">
        <div className={trackClassName}>
          <MarqueeSequence text={text} repeats={repeats} />
        </div>
        <div className={trackClassName} aria-hidden>
          <MarqueeSequence text={text} repeats={repeats} />
        </div>
      </div>
    </div>
  );
}
