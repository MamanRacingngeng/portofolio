"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  floatDurations,
  spaceFloatSoft,
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
  polkadotLayout?: "corners" | "sides";
  size?: "default" | "md" | "sm";
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

const accentSm = {
  lime: "shadow-[6px_6px_0_var(--accent-2)]",
  sky: "shadow-[6px_6px_0_var(--accent-4)]",
  pink: "shadow-[6px_6px_0_var(--accent-3)]",
};

const accentHoverSm = {
  lime: {
    backgroundColor: "var(--accent-2)",
    boxShadow: "6px 6px 0 var(--accent-3)",
  },
  sky: {
    backgroundColor: "var(--accent-4)",
    boxShadow: "6px 6px 0 var(--accent)",
  },
  pink: {
    backgroundColor: "var(--accent-3)",
    boxShadow: "6px 6px 0 var(--accent-2)",
  },
};

const accentMd = {
  lime: "shadow-[7px_7px_0_var(--accent-2)] sm:shadow-[8px_8px_0_var(--accent-2)]",
  sky: "shadow-[7px_7px_0_var(--accent-4)] sm:shadow-[8px_8px_0_var(--accent-4)]",
  pink: "shadow-[7px_7px_0_var(--accent-3)] sm:shadow-[8px_8px_0_var(--accent-3)]",
};

const accentHoverMd = {
  lime: {
    backgroundColor: "var(--accent-2)",
    boxShadow: "9px 9px 0 var(--accent-3)",
  },
  sky: {
    backgroundColor: "var(--accent-4)",
    boxShadow: "9px 9px 0 var(--accent)",
  },
  pink: {
    backgroundColor: "var(--accent-3)",
    boxShadow: "9px 9px 0 var(--accent-2)",
  },
};

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
  accent = "lime",
  showPolkadots = false,
  polkadotLayout = "corners",
  size = "default",
}: SectionTitleProps) {
  const centered = align === "center";
  const floatDuration = floatDurations[accent];
  const compact = size === "sm";
  const medium = size === "md";

  return (
    <div
      className={cn(
        "relative w-full",
        compact ? "mb-8 sm:mb-10" : medium ? "mb-8 sm:mb-10" : "mb-8 sm:mb-10",
        centered && "flex flex-col items-center text-center",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={cn(
          "relative z-10 w-full overflow-visible",
          centered && "mx-auto flex max-w-3xl flex-col items-center text-center",
          compact && showPolkadots && polkadotLayout === "sides" && "px-8 sm:px-10",
        )}
      >
        <div
          className={cn(
            "flex w-full justify-center overflow-visible py-1",
            medium && showPolkadots && "px-3 sm:px-4",
          )}
        >
          {medium ? (
            <motion.div
              initial={false}
              {...spaceFloatSoft(floatDuration, 0)}
              className="relative inline-block will-change-transform"
            >
              {showPolkadots && (
                <SectionPolkadots accent={accent} layout="corners" soft />
              )}
              <motion.h2
                whileHover={{
                  ...accentHoverMd[accent],
                  transition: { duration: 0.35, ease: "easeOut" },
                }}
                className={cn(
                  "relative z-20 mx-auto inline-block font-display text-fg antialiased",
                  "rounded-full border-[3px] border-border bg-card px-7 py-3 text-[1.65rem] font-black tracking-tight sm:px-9 sm:py-3.5 sm:text-[2rem] lg:px-10 lg:py-3.5 lg:text-[2.15rem]",
                  accentMd[accent],
                )}
              >
                {title}
              </motion.h2>
            </motion.div>
          ) : (
            <motion.h2
              initial={false}
              {...spaceFloatTilt(floatDuration, 0)}
              className={cn(
                "relative mx-auto inline-block font-display text-fg",
                compact
                  ? cn(
                      "rounded-full border-[3px] border-border bg-card px-6 py-3 text-xl font-black tracking-tight sm:px-8 sm:py-3.5 sm:text-2xl",
                      accentSm[accent],
                    )
                  : cn("section-sticker", accentDefault[accent]),
              )}
              whileHover={{
                ...(compact ? accentHoverSm[accent] : accentHover[accent]),
                rotate: compact ? [0, -2, 2, 0] : [0, -3, 3, -2, 2, 0],
                transition: { duration: 0.45 },
              }}
            >
              {showPolkadots && (
                <SectionPolkadots
                  accent={accent}
                  layout={compact && polkadotLayout === "sides" ? "sides" : "corners"}
                />
              )}
              {title}
            </motion.h2>
          )}
        </div>
        {subtitle && (
          <p
            className={cn(
              "max-w-2xl leading-relaxed text-muted",
              compact
                ? "mt-6 max-w-xl text-base sm:text-lg"
                : medium
                  ? "mt-6 max-w-2xl text-base sm:text-lg"
                  : "mt-6 text-base sm:text-lg",
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
