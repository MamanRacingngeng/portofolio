"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { techCategories, type TechItem } from "@/data/portfolio";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TechDetailModal } from "@/components/shared/TechDetailModal";
import { cn } from "@/lib/utils";
import {
  hoverFloat,
  hoverFloatResetTransition,
  hoverFloatTransition,
  revealViewport,
  scrollRevealLeft,
} from "@/lib/animations";

interface TechGridProps {
  title?: string;
  showTitle?: boolean;
}

type CategoryTheme = (typeof categoryTheme)[number];

const techCardReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 130,
      damping: 16,
    },
  },
};

const techCardStagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const cardRest = {
  y: 0,
  x: 0,
  rotate: 0,
  backgroundColor: "var(--card)",
  boxShadow: "5px 5px 0 #111",
};

function TechIcon({ tech }: { tech: TechItem }) {
  if (tech.logo) {
    const scale = tech.logoScale ?? 1;

    return (
      <div className="relative mb-2 flex h-11 w-full max-w-[132px] items-center justify-center sm:h-12 sm:max-w-[148px]">
        <Image
          src={tech.logo}
          alt=""
          width={148}
          height={48}
          unoptimized
          className={cn(
            "max-h-full w-auto object-contain",
            tech.logoBlend === "multiply" && "mix-blend-multiply",
          )}
          style={
            scale !== 1
              ? { transform: `scale(${scale})`, transformOrigin: "center" }
              : undefined
          }
          sizes="148px"
        />
      </div>
    );
  }

  return <span className="mb-2 text-3xl sm:text-4xl">{tech.icon}</span>;
}

function TechCard({
  tech,
  theme,
}: {
  tech: TechItem;
  theme: CategoryTheme;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="flex h-[148px] w-full flex-col items-center justify-center border-[3px] border-border bg-card px-3 py-5 text-center sm:h-[156px]"
      animate={
        hovered
          ? {
              ...hoverFloat,
              backgroundColor: theme.cardHoverBg,
              boxShadow: theme.cardHoverShadow,
            }
          : cardRest
      }
      transition={hovered ? hoverFloatTransition : hoverFloatResetTransition}
    >
      <TechIcon tech={tech} />
      {tech.labelLines ? (
        <div className="text-xs font-black uppercase leading-tight tracking-wide sm:text-sm">
          <span className="block">{tech.labelLines[0]}</span>
          <span className="block">{tech.labelLines[1]}</span>
        </div>
      ) : (
        <p className="text-xs font-black uppercase leading-tight tracking-wide sm:text-sm">
          {tech.name}
        </p>
      )}
    </motion.div>
  );
}

const categoryTheme = [
  {
    shadow: "5px 5px 0 #7c3aed",
    hoverBg: "#7c3aed",
    hoverColor: "#ffffff",
    hoverShadow: "7px 7px 0 #f9a8b8",
    cardHoverBg: "rgba(124, 58, 237, 0.1)",
    cardHoverShadow: "7px 7px 0 #7c3aed",
  },
  {
    shadow: "5px 5px 0 #d4f06a",
    hoverBg: "#d4f06a",
    hoverColor: "#111111",
    hoverShadow: "7px 7px 0 #7dd3fc",
    cardHoverBg: "rgba(212, 240, 106, 0.3)",
    cardHoverShadow: "7px 7px 0 #d4f06a",
  },
  {
    shadow: "5px 5px 0 #7dd3fc",
    hoverBg: "#7dd3fc",
    hoverColor: "#111111",
    hoverShadow: "7px 7px 0 #7c3aed",
    cardHoverBg: "rgba(125, 211, 252, 0.35)",
    cardHoverShadow: "7px 7px 0 #7dd3fc",
  },
  {
    shadow: "5px 5px 0 #f9a8b8",
    hoverBg: "#f9a8b8",
    hoverColor: "#111111",
    hoverShadow: "7px 7px 0 #d4f06a",
    cardHoverBg: "rgba(249, 168, 184, 0.3)",
    cardHoverShadow: "7px 7px 0 #f9a8b8",
  },
];

export function TechGrid({ title, showTitle = true }: TechGridProps) {
  const t = useTranslations("tech");
  const tCategories = useTranslations("tech.categories");
  const displayTitle = title ?? t("title");
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  return (
    <section className="overflow-x-hidden px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-8 lg:px-8">
      <TechDetailModal tech={selectedTech} onClose={() => setSelectedTech(null)} />
      <div className="mx-auto max-w-5xl">
        {showTitle && (
          <SectionTitle title={displayTitle} accent="sky" align="center" showPolkadots />
        )}

        <div className="space-y-10">
          {techCategories.map((category, catIndex) => {
            const theme = categoryTheme[catIndex % categoryTheme.length];

            return (
              <div key={category.id}>
                <motion.div
                  variants={scrollRevealLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={revealViewport}
                  transition={{ delay: catIndex * 0.05 }}
                  className="mb-5 flex items-center gap-4"
                >
                  <motion.h3
                    className="shrink-0 rounded-full border-[3px] border-border bg-card px-4 py-2 font-display text-[11px] font-black uppercase tracking-widest sm:px-5 sm:py-2.5 sm:text-xs"
                    initial={{ boxShadow: "0px 0px 0 transparent" }}
                    whileInView={{ boxShadow: theme.shadow }}
                    viewport={revealViewport}
                    transition={{ delay: 0.1, duration: 0.35 }}
                    whileHover={{
                      backgroundColor: theme.hoverBg,
                      color: theme.hoverColor,
                      boxShadow: theme.hoverShadow,
                      rotate: [0, -2, 2, 0],
                      transition: { duration: 0.35 },
                    }}
                  >
                    {tCategories(category.id as "dataScience" | "softwareDev" | "databaseTools" | "frontendUi")}
                  </motion.h3>
                  <motion.div
                    className="h-[3px] flex-1 bg-border/15"
                    initial={{ scaleX: 0, originX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={revealViewport}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                </motion.div>

                <motion.div
                  variants={techCardStagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={revealViewport}
                  className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                >
                  {category.items.map((tech) => (
                    <motion.div
                      key={tech.id}
                      variants={techCardReveal}
                      className="w-full min-w-0 cursor-pointer"
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedTech(tech)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedTech(tech);
                        }
                      }}
                    >
                      <TechCard tech={tech} theme={theme} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
