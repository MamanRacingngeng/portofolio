"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  floatDurations,
  spaceFloatTilt,
} from "@/lib/animations";
import { SectionPolkadots } from "@/components/ui/SectionPolkadots";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  accent?: "lime" | "sky" | "pink";
  showPolkadots?: boolean;
}

const accentDefault = {
  lime: "shadow-[8px_8px_0_var(--accent-2)] sm:shadow-[10px_10px_0_var(--accent-2)]",
  sky: "shadow-[8px_8px_0_var(--accent-4)] sm:shadow-[10px_10px_0_var(--accent-4)]",
  pink: "shadow-[8px_8px_0_var(--accent-3)] sm:shadow-[10px_10px_0_var(--accent-3)]",
};

const accentHover = {
  lime: {
    backgroundColor: "var(--accent-2)",
    boxShadow: "10px 10px 0 var(--accent-3)",
  },
  sky: {
    backgroundColor: "var(--accent-4)",
    boxShadow: "10px 10px 0 var(--accent)",
  },
  pink: {
    backgroundColor: "var(--accent-3)",
    boxShadow: "10px 10px 0 var(--accent-2)",
  },
};

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
  accent = "lime",
  showPolkadots = false,
}: SectionTitleProps) {
  const centered = align === "center";
  const floatDuration = floatDurations[accent];

  return (
    <div
      className={cn(
        "relative mb-8 w-full sm:mb-10",
        centered && "flex flex-col items-center text-center",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={cn("relative z-10", centered && "flex flex-col items-center text-center")}
      >
        <motion.h2
          initial={false}
          {...spaceFloatTilt(floatDuration, 0)}
          className={cn(
            "relative inline-block section-sticker font-display text-fg",
            accentDefault[accent]
          )}
          whileHover={{
            ...accentHover[accent],
            rotate: [0, -3, 3, -2, 2, 0],
            transition: { duration: 0.45 },
          }}
        >
          {showPolkadots && <SectionPolkadots accent={accent} />}
          {title}
        </motion.h2>
        {subtitle && (
          <p
            className={cn(
              "mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg",
              centered && "mx-auto"
            )}
          >
            {subtitle}
          </p>
        )}
      </motion.div>
    </div>
  );
}
