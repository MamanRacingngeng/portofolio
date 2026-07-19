"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProjectItem } from "@/data/projects";
import { getProjectTagLabel } from "@/lib/project-tags";
import { cn } from "@/lib/utils";

type WorkCopy = {
  title: string;
  description: string;
  detail: string;
};

type CaseStudyCopy = {
  overview: string;
  highlights: string[];
  tools: string[];
};

interface GraphicDesignModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

function GraphicDesignModal({ project, onClose }: GraphicDesignModalProps) {
  const t = useTranslations("projects");
  const tCase = useTranslations("projects.caseStudy");
  const [pageIndex, setPageIndex] = useState(0);

  const pages = useMemo(() => {
    if (!project) return [];
    if (project.galleryImages?.length) return project.galleryImages;
    return [project.image];
  }, [project]);

  useEffect(() => {
    setPageIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const work = t.raw(`items.${project.id}`) as WorkCopy;
  const caseStudy = tCase.raw(`items.${project.id}`) as CaseStudyCopy | undefined;
  const current = Math.min(pageIndex, pages.length - 1);
  const isMerch = project.layout === "merch";
  const isLandscape = isMerch || pages[current]?.includes("ie-merch");
  const merchFrameBg =
    isMerch && pages[current]?.includes("ie-merch-black")
      ? "bg-white"
      : isMerch
        ? "bg-[#111]"
        : "bg-surface";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
        role="presentation"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-fg/60 backdrop-blur-[2px]" aria-hidden />

        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)] sm:rounded-3xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-border px-4 py-3 sm:px-6 sm:py-4">
            <p className="min-w-0 truncate text-xs font-black uppercase tracking-widest sm:text-sm">
              {work.title}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label={tCase("close")}
              className="pop-btn flex h-10 w-10 shrink-0 items-center justify-center bg-accent-3 text-fg"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <div className="relative bg-surface p-4 sm:p-6">
              <div
                className={cn(
                  "relative mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border-[3px] border-border shadow-[6px_6px_0_var(--shadow)]",
                  merchFrameBg,
                  isLandscape
                    ? "aspect-[2/1] max-h-[62vh]"
                    : "aspect-[4/5] max-h-[62vh] sm:aspect-[3/4]",
                )}
              >
                <Image
                  src={pages[current]}
                  alt={`${work.title} — ${current + 1}`}
                  fill
                  quality={100}
                  unoptimized
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 960px"
                />
              </div>

              {pages.length > 1 ? (
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
                    disabled={current === 0}
                    className="pop-btn flex h-9 w-9 items-center justify-center bg-card disabled:opacity-40"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-xs font-black uppercase tracking-wide">
                    {tCase("pageOf", { current: current + 1, total: pages.length })}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPageIndex((index) => Math.min(pages.length - 1, index + 1))
                    }
                    disabled={current === pages.length - 1}
                    className="pop-btn flex h-9 w-9 items-center justify-center bg-card disabled:opacity-40"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : null}
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div>
                <p className="text-sm font-bold text-fg">{work.detail}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                  {work.description}
                </p>
              </div>

              {caseStudy ? (
                <>
                  <div className="border-[3px] border-border bg-accent-2 p-4 sm:p-5">
                    <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                      {tCase("labels.overview")}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed sm:text-base">
                      {caseStudy.overview}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border-[3px] border-border bg-card p-4">
                      <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                        {t("graphicDesign.highlights")}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {caseStudy.highlights.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2 text-sm leading-relaxed text-fg"
                          >
                            <span
                              aria-hidden
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-[3px] border-border bg-accent-4/20 p-4">
                      <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                        {t("graphicDesign.tools")}
                      </h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {caseStudy.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-full border-2 border-border bg-card px-3 py-1 text-xs font-black uppercase"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ArtFrame({
  src,
  alt,
  className,
  tilt,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  tilt?: "left" | "right" | "none";
  priority?: boolean;
}) {
  const tiltClass =
    tilt === "left"
      ? "-rotate-2 group-hover:rotate-0"
      : tilt === "right"
        ? "rotate-2 group-hover:rotate-0"
        : "group-hover:-rotate-1";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[3px] border-border bg-surface shadow-[6px_6px_0_var(--shadow)] transition-transform duration-500",
        tiltClass,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={100}
        unoptimized
        className="object-contain object-center grayscale transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0 group-focus-within:grayscale-0"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 960px"
      />
    </div>
  );
}

interface GraphicDesignGalleryProps {
  items: ProjectItem[];
}

export function GraphicDesignGallery({ items }: GraphicDesignGalleryProps) {
  const t = useTranslations("projects");
  const copy = t.raw("items") as Record<string, WorkCopy>;
  const tagLabels = t.raw("tagLabels") as Record<string, string>;
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  const featured = items.find((item) => item.layout === "featured");
  const merch = items.find((item) => item.layout === "merch");
  const posters = items.filter(
    (item) => item.layout !== "featured" && item.layout !== "merch",
  );

  return (
    <>
      <GraphicDesignModal project={selected} onClose={() => setSelected(null)} />

      <div className="space-y-8 sm:space-y-10">
        {featured ? (
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="project-card group overflow-hidden rounded-3xl bg-card project-card--sky"
          >
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:gap-8 lg:p-8">
              <div className="relative lg:col-span-5">
                <ArtFrame
                  src={featured.galleryImages?.[0] ?? featured.image}
                  alt={`${copy[featured.id].title} front`}
                  tilt="left"
                  priority
                  className="aspect-[789/512] w-full"
                />
              </div>

              <div className="relative lg:col-span-7 lg:pt-10">
                <ArtFrame
                  src={featured.galleryImages?.[1] ?? featured.image}
                  alt={`${copy[featured.id].title} back`}
                  tilt="right"
                  priority
                  className="aspect-[789/512] w-full lg:ml-auto lg:max-w-xl"
                />
              </div>

              <div className="space-y-3 lg:col-span-12 lg:mt-2 sm:space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted sm:text-xs">
                      {t("graphicDesign.featured")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase sm:text-3xl">
                      {copy[featured.id].title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-fg">
                      {copy[featured.id].detail}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(featured)}
                    className="project-pill project-pill--sky inline-flex items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide"
                  >
                    {t("graphicDesign.viewWork")}
                  </button>
                </div>

                <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                  {copy[featured.id].description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs"
                    >
                      {getProjectTagLabel(tag, tagLabels)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ) : null}

        {merch ? (
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="project-card group overflow-hidden rounded-3xl bg-card project-card--purple"
          >
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-2 lg:gap-8 lg:p-8">
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted sm:text-xs">
                  {t("graphicDesign.lightVariant")}
                </p>
                <ArtFrame
                  src={merch.galleryImages?.[0] ?? merch.image}
                  alt={`${copy[merch.id].title} — light`}
                  tilt="left"
                  className="aspect-[2/1] w-full bg-[#111]"
                />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted sm:text-xs">
                  {t("graphicDesign.darkVariant")}
                </p>
                <ArtFrame
                  src={merch.galleryImages?.[1] ?? merch.image}
                  alt={`${copy[merch.id].title} — dark`}
                  tilt="right"
                  className="aspect-[2/1] w-full bg-white"
                />
              </div>

              <div className="space-y-3 lg:col-span-2 lg:mt-2 sm:space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted sm:text-xs">
                      {t("graphicDesign.merch")}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase sm:text-3xl">
                      {copy[merch.id].title}
                    </h3>
                    <p className="mt-1 text-sm font-bold text-fg">
                      {copy[merch.id].detail}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(merch)}
                    className="project-pill project-pill--purple inline-flex items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide"
                  >
                    {t("graphicDesign.viewWork")}
                  </button>
                </div>

                <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                  {copy[merch.id].description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {merch.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs"
                    >
                      {getProjectTagLabel(tag, tagLabels)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        ) : null}

        <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-8">
          {posters.map((project, index) => {
            const work = copy[project.id];
            const isCollage = project.layout === "collage";
            const isWide = index === 0 && !isCollage;

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "project-card group overflow-hidden rounded-3xl bg-card",
                  isCollage
                    ? "lg:col-span-6 project-card--sky"
                    : isWide
                      ? "lg:col-span-7 project-card--lime"
                      : "lg:col-span-5 project-card--pink",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSelected(project)}
                  className="relative block w-full text-left"
                >
                  <ArtFrame
                    src={project.image}
                    alt={work.title}
                    tilt={isCollage ? (index % 2 === 0 ? "left" : "right") : index === 0 ? "none" : "right"}
                    className={cn(
                      "w-full",
                      isCollage || !isWide ? "aspect-square" : "aspect-[819/1024]",
                    )}
                  />
                </button>

                <div className="space-y-3 p-5 sm:space-y-4 sm:p-6">
                  <div>
                    <h3 className="font-display text-lg font-black uppercase leading-snug sm:text-xl">
                      {work.title}
                    </h3>
                    <div className="mt-2 h-1 w-8 rounded-full bg-accent-2 transition-all duration-300 group-hover:w-14 group-hover:bg-accent-4" />
                  </div>

                  <p className="text-sm font-bold text-fg">{work.detail}</p>

                  <p className="line-clamp-3 text-sm leading-relaxed text-muted sm:text-base">
                    {work.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs"
                      >
                        {getProjectTagLabel(tag, tagLabels)}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelected(project)}
                    className="project-pill inline-flex items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide project-pill--purple"
                  >
                    {t("graphicDesign.viewWork")}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </>
  );
}
