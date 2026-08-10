"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { getFeaturedProjects, type ProjectItem } from "@/data/projects";
import { Link } from "@/i18n/navigation";
import { revealViewport } from "@/lib/animations";
import { useHasMounted } from "@/lib/use-has-mounted";
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
const GROUP_ROTATE_X = 18;
const GROUP_ROTATE_Y = -32;
const OPTICAL_OFFSET_X = 64;
const OPTICAL_OFFSET_Y = 8;

const spring = { type: "spring" as const, stiffness: 220, damping: 28 };

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

function useShowcaseScale(stageWidth: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => {
      const available = node.clientWidth;
      if (available <= 0) return;
      setScale(Math.min(1, available / stageWidth));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [stageWidth]);

  return { containerRef, scale };
}

function ProjectCard({
  project,
  index,
  title,
  isHovered,
  onHover,
  enableMotion,
}: {
  project: ProjectItem;
  index: number;
  title: string;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  enableMotion: boolean;
}) {
  const href = project.liveUrl ?? categoryHref[project.category];
  const x = index * GAP_X + OPTICAL_OFFSET_X;
  const y = index * GAP_Y + OPTICAL_OFFSET_Y;

  const card = (
    <Link
      href={href}
      target={project.liveUrl ? "_blank" : undefined}
      rel={project.liveUrl ? "noopener noreferrer" : undefined}
      className="group block"
      aria-label={title}
    >
      <div className="overflow-hidden rounded-2xl border-[3px] border-border bg-card [transform:translateZ(0)] [backface-visibility:hidden]">
        <div
          className="relative overflow-hidden bg-surface [transform:translateZ(0)]"
          style={{ width: CARD_W, height: CARD_H }}
        >
          <Image
            src={project.image}
            alt={title}
            fill
            unoptimized
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="280px"
          />
        </div>
      </div>
    </Link>
  );

  if (!enableMotion) {
    return (
      <div
        className="absolute left-0 top-0 isolate"
        style={{
          width: CARD_W,
          transform: `translate3d(${x}px, ${y}px, 0)`,
          zIndex: isHovered ? 20 : index + 1,
        }}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
      >
        {card}
      </div>
    );
  }

  return (
    <motion.div
      className="absolute left-0 top-0 isolate"
      initial={false}
      animate={{
        x,
        y,
        scale: isHovered ? 1.04 : 1,
      }}
      transition={{ ...spring, delay: index * 0.05 }}
      style={{
        width: CARD_W,
        zIndex: isHovered ? 20 : index + 1,
      }}
      onHoverStart={() => onHover(index)}
      onHoverEnd={() => onHover(null)}
    >
      {card}
    </motion.div>
  );
}

export function ProjectShowcase() {
  const t = useTranslations("homeShowcase");
  const tProjects = useTranslations("projects.items");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const mounted = useHasMounted();

  const groupSize = getGroupSize(featuredProjects.length);
  const stageWidth = groupSize.width + OPTICAL_OFFSET_X + 120;
  const stageHeight = groupSize.height + 140;
  const { containerRef, scale } = useShowcaseScale(stageWidth);
  const tiltStyle = {
    width: groupSize.width + OPTICAL_OFFSET_X,
    height: groupSize.height + OPTICAL_OFFSET_Y,
    transform: `rotateX(${GROUP_ROTATE_X}deg) rotateY(${GROUP_ROTATE_Y}deg) translateZ(0)`,
  } as const;

  return (
    <section className="page-section relative isolate overflow-x-clip pt-10 pb-20 sm:pt-12 sm:pb-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={false}
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
            initial={false}
            whileInView="visible"
            viewport={revealViewport}
          >
            {t("line1")}
          </motion.p>

          <motion.p
            custom={0.1}
            variants={lineReveal}
            initial={false}
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
            initial={false}
            whileInView="visible"
            viewport={revealViewport}
            className="mt-0.5 sm:mt-1"
          >
            {t("line3")}
          </motion.p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-4xl flex-col items-center sm:mt-10 lg:mt-11">
        <div ref={containerRef} className="relative w-full overflow-hidden [contain:paint]">
          <div
            className="relative mx-auto"
            style={{
              width: stageWidth * scale,
              height: stageHeight * scale,
            }}
          >
            <div
              className="absolute left-1/2 top-0 flex justify-center"
              style={{
                width: stageWidth,
                height: stageHeight,
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: "top center",
              }}
            >
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: stageWidth,
                  height: stageHeight,
                  perspective: 2200,
                  perspectiveOrigin: "50% 45%",
                }}
              >
                <div className={cn("relative", mounted && "stack-float")}>
                  <div
                    className="relative [transform-style:preserve-3d] [backface-visibility:hidden]"
                    style={tiltStyle}
                  >
                    {featuredProjects.map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        title={tProjects(`${project.id}.title`)}
                        isHovered={hoveredIndex === index}
                        onHover={setHoveredIndex}
                        enableMotion={mounted}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
