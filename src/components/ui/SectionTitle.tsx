"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { revealViewport } from "@/lib/animations";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
  accent?: "lime" | "sky" | "pink";
  placement?: "default" | "corner";
  /** @deprecated Decorative dots removed — kept for call-site compatibility */
  showPolkadots?: boolean;
  polkadotLayout?: "corners" | "sides";
  size?: "default" | "md" | "sm";
}

const accentClass = {
  lime: "section-heading--lime",
  sky: "section-heading--sky",
  pink: "section-heading--pink",
} as const;

const sizeClass = {
  sm: "section-heading--sm",
  default: "section-heading--default",
  md: "section-heading--md",
} as const;

const nailPositions = [
  "section-heading__nail--tl",
  "section-heading__nail--tr",
  "section-heading__nail--bl",
  "section-heading__nail--br",
] as const;

export function SectionTitle({
  title,
  subtitle,
  className,
  align = "center",
  accent = "lime",
  placement = "default",
  size = "default",
}: SectionTitleProps) {
  const centered = align === "center" && placement === "default";
  const corner = placement === "corner";

  return (
    <div
      className={cn(
        "relative w-full",
        corner
          ? "section-title-wrap--corner"
          : "mb-8 sm:mb-10",
        centered && "flex flex-col items-center text-center",
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={revealViewport}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(centered && "mx-auto")}
      >
        <div
          className={cn(
            "section-heading-board",
            corner && "section-heading-board--corner",
          )}
        >
          <h2
            className={cn(
              "section-heading__label font-display font-black",
              accentClass[accent],
              sizeClass[size],
            )}
          >
            {nailPositions.map((position) => (
              <span
                key={position}
                aria-hidden
                className={cn("section-heading__nail", position)}
              />
            ))}
            {title}
          </h2>
        </div>
      </motion.div>

      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:mt-5 sm:text-base",
            centered && "mx-auto text-center",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
