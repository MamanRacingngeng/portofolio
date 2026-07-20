"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { techItems, type TechItem } from "@/data/portfolio";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TechDetailModal } from "@/components/shared/TechDetailModal";
import { cn } from "@/lib/utils";
import { revealViewport } from "@/lib/animations";

interface TechGridProps {
  title?: string;
  showTitle?: boolean;
  variant?: "strip" | "grid";
}

const techItemReveal = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 140,
      damping: 18,
    },
  },
};

const techItemStagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

function TechLogo({ tech, large }: { tech: TechItem; large?: boolean }) {
  const scale = tech.logoScale ?? 1;

  if (tech.logo) {
    return (
      <div
        className={cn(
          "relative flex w-full items-center justify-center",
          large
            ? "mb-3 h-12 sm:mb-3.5 sm:h-14 md:h-16"
            : "mb-2.5 h-11 sm:mb-3 sm:h-12 md:h-14",
        )}
      >
        <Image
          src={tech.logo}
          alt=""
          width={large ? 160 : 140}
          height={large ? 56 : 48}
          unoptimized
          className={cn(
            "max-h-full w-auto object-contain transition-transform duration-200 group-hover:scale-110",
            tech.logoBlend === "multiply" && "mix-blend-multiply dark:mix-blend-normal",
            tech.logoInvertDark && "dark:invert",
          )}
          style={
            scale !== 1
              ? { transform: `scale(${scale})`, transformOrigin: "center" }
              : undefined
          }
          sizes={large ? "160px" : "140px"}
        />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "mb-2.5 leading-none sm:mb-3",
        large ? "text-4xl sm:text-5xl md:text-[3.25rem]" : "text-3xl sm:text-4xl",
      )}
    >
      {tech.icon}
    </span>
  );
}

function TechLabel({ tech, large }: { tech: TechItem; large?: boolean }) {
  const labelClass = cn(
    "font-black uppercase leading-tight tracking-wide text-fg",
    large ? "text-xs sm:text-sm md:text-[0.9375rem]" : "text-[11px] sm:text-xs md:text-sm",
  );

  if (tech.labelLines) {
    return (
      <div className={labelClass}>
        <span className="block">{tech.labelLines[0]}</span>
        <span className="block">{tech.labelLines[1]}</span>
      </div>
    );
  }

  return <p className={labelClass}>{tech.name}</p>;
}

function TechTile({ tech, large }: { tech: TechItem; large?: boolean }) {
  return (
    <div className="group flex flex-col items-center justify-start px-1 py-2 text-center sm:px-2 sm:py-3">
      <TechLogo tech={tech} large={large} />
      <TechLabel tech={tech} large={large} />
    </div>
  );
}

export function TechGrid({
  title,
  showTitle = true,
  variant = "strip",
}: TechGridProps) {
  const t = useTranslations("tech");
  const displayTitle = title ?? t("title");
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const isHome = variant === "strip";

  const openTech = (tech: TechItem) => setSelectedTech(tech);

  return (
    <section
      className={cn(
        "overflow-x-hidden px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8",
        isHome ? "pt-6 sm:pt-8" : "pt-4 sm:pt-6",
      )}
    >
      <TechDetailModal tech={selectedTech} onClose={() => setSelectedTech(null)} />

      <div className={cn("mx-auto", isHome ? "max-w-6xl" : "max-w-5xl")}>
        {showTitle && (
          <SectionTitle
            title={displayTitle}
            accent="sky"
            align="center"
            showPolkadots
          />
        )}

        <motion.ul
          variants={techItemStagger}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className={cn(
            "grid list-none p-0",
            isHome
              ? "grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 sm:gap-x-5 sm:gap-y-8 md:grid-cols-5 lg:grid-cols-6"
              : "grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4",
          )}
        >
          {techItems.map((tech) => (
            <motion.li key={tech.id} variants={techItemReveal} className="min-w-0">
              <button
                type="button"
                onClick={() => openTech(tech)}
                className="block w-full cursor-pointer text-left transition-opacity hover:opacity-90"
                aria-label={tech.name}
              >
                <TechTile tech={tech} large={isHome} />
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
