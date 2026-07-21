"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { getFeaturedProjects, type ProjectItem } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { revealViewport } from "@/lib/animations";
import { cn } from "@/lib/utils";

const featuredProjects = getFeaturedProjects();

const categoryHref: Record<ProjectItem["category"], string> = {
  "software-dev": "/proyek/software-dev",
  "ai-ml": "/proyek/ai-ml",
  dashboards: "/proyek/dashboards",
};

const CARD_W = 280;
const CARD_H = 175;
const GAP_X = 56;
const GAP_Y = 36;
const Z_STEP = 50;
const GROUP_ROTATE_X = 20;
const GROUP_ROTATE_Y = -35;
const OPTICAL_OFFSET_X = 64;
const OPTICAL_OFFSET_Y = 8;

const spring = { type: "spring" as const, stiffness: 220, damping: 28 };

const stackFloat = {
  animate: { y: [0, -6, 3, -5, 0] },
  transition: {
    duration: 17,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

const lineReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 18,
      delay,
    },
  }),
};

function getGroupSize(total: number) {
  const last = Math.max(total - 1, 0);
  return {
    width: CARD_W + last * GAP_X,
    height: CARD_H + last * GAP_Y,
  };
}

function ProjectCard({
  project,
  index,
  title,
  isHovered,
  onHover,
}: {
  project: ProjectItem;
  index: number;
  title: string;
  isHovered: boolean;
  onHover: (index: number | null) => void;
}) {
  const href = project.liveUrl ?? categoryHref[project.category];
  const x = index * GAP_X + OPTICAL_OFFSET_X;
  const y = index * GAP_Y + OPTICAL_OFFSET_Y;
  const z = index * Z_STEP;

  return (
    <motion.div
      className="absolute left-0 top-0"
      initial={{ opacity: 0, x, y, z }}
      whileInView={{ opacity: 1, x, y, z }}
      viewport={revealViewport}
      animate={{
        x,
        y,
        z: z + (isHovered ? 64 : 0),
        scale: isHovered ? 1.025 : 1,
      }}
      transition={{ ...spring, delay: index * 0.05 }}
      style={{
        width: CARD_W,
        zIndex: isHovered ? 20 : index + 1,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      onHoverStart={() => onHover(index)}
      onHoverEnd={() => onHover(null)}
    >
      <Link
        href={href}
        target={project.liveUrl ? "_blank" : undefined}
        rel={project.liveUrl ? "noopener noreferrer" : undefined}
        className="group block"
        aria-label={title}
      >
        <div className="overflow-hidden rounded-2xl border-[3px] border-border bg-card">
          <div
            className="relative overflow-hidden bg-surface"
            style={{ width: CARD_W, height: CARD_H }}
          >
            <Image
              src={project.image}
              alt=""
              fill
              unoptimized
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="280px"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProjectShowcase() {
  const t = useTranslations("homeShowcase");
  const tProjects = useTranslations("projects.items");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const groupSize = getGroupSize(featuredProjects.length);

  return (
    <section className="relative z-0 overflow-x-clip px-4 pt-10 pb-20 sm:px-6 sm:pt-12 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5 font-display text-xs font-medium uppercase tracking-[0.26em] text-muted sm:mb-6 sm:text-sm sm:tracking-[0.3em]"
        >
          {t("label")}
        </motion.p>

        <div
          className={cn(
            "font-display font-black uppercase leading-[1.05] tracking-[-0.01em] text-fg",
            "text-[clamp(1.25rem,3.2vw,2.1rem)]",
          )}
        >
          <motion.p
            custom={0.04}
            variants={lineReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
          >
            {t("line1")}
          </motion.p>

          <motion.p
            custom={0.1}
            variants={lineReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-0.5 sm:mt-1"
          >
            {t("line2Before")}
            <span className="text-accent">{t("headlineHighlight")}</span>
            {t("line2After")}
          </motion.p>

          <motion.p
            custom={0.16}
            variants={lineReveal}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="mt-0.5 sm:mt-1"
          >
            {t("line3")}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center sm:mt-10 lg:mt-11">
        <div className="relative hidden w-full justify-center sm:flex">
          <div
            className="relative flex items-center justify-center overflow-visible pt-3 sm:pt-4"
            style={{
              width: groupSize.width + OPTICAL_OFFSET_X + 120,
              height: groupSize.height + 140,
              perspective: 2500,
              perspectiveOrigin: "50% 50%",
            }}
          >
            <motion.div
              {...stackFloat}
              className="relative [transform-style:preserve-3d] [backface-visibility:hidden]"
            >
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative [transform-style:preserve-3d] [backface-visibility:hidden]"
                style={{
                  width: groupSize.width + OPTICAL_OFFSET_X,
                  height: groupSize.height + OPTICAL_OFFSET_Y,
                  transform: `rotateX(${GROUP_ROTATE_X}deg) rotateY(${GROUP_ROTATE_Y}deg)`,
                }}
              >
                {featuredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    title={tProjects(`${project.id}.title`)}
                    isHovered={hoveredIndex === index}
                    onHover={setHoveredIndex}
                  />
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="flex w-full gap-5 overflow-x-auto pb-3 sm:hidden">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ delay: index * 0.06, ...spring }}
              className="shrink-0"
            >
              <Link
                href={project.liveUrl ?? categoryHref[project.category]}
                target={project.liveUrl ? "_blank" : undefined}
                rel={project.liveUrl ? "noopener noreferrer" : undefined}
                aria-label={tProjects(`${project.id}.title`)}
                className="block overflow-hidden rounded-2xl shadow-[0_16px_36px_-12px_rgba(17,17,17,0.25)]"
              >
                <div
                  className="relative overflow-hidden bg-surface"
                  style={{ width: CARD_W, height: CARD_H }}
                >
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover object-top"
                    sizes="280px"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
