"use client";

import { useEffect, useRef, useState, type PointerEvent, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Monitor, Smartphone, X } from "lucide-react";
import { getImageMeta } from "@/data/project-image-meta";
import type { ProjectItem, UiTheme } from "@/data/projects";
import {
  getProjectTagLabel,
  isUiUxClientProject,
  isUiUxCompetencyProject,
} from "@/lib/project-tags";
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
  screenLabels?: string[];
};

type ScreenSet = {
  full: string[];
  preview: string[];
};

const themeStyles: Record<
  UiTheme,
  {
    card: string;
    pill: string;
    stripe: string;
    badge: string;
    ring: string;
    accent: string;
  }
> = {
  teal: {
    card: "project-card--lime",
    pill: "project-pill--sky",
    stripe: "bg-[#84cc16]",
    badge: "bg-[#ecfccb] text-[#3f6212]",
    ring: "ring-[#84cc16]",
    accent: "#84cc16",
  },
  purple: {
    card: "project-card--purple",
    pill: "project-pill--purple",
    stripe: "bg-[#a855f7]",
    badge: "bg-[#f3e8ff] text-[#6b21a8]",
    ring: "ring-[#a855f7]",
    accent: "#a855f7",
  },
  indigo: {
    card: "project-card--sky",
    pill: "project-pill--pink",
    stripe: "bg-[#6366f1]",
    badge: "bg-[#eef2ff] text-[#3730a3]",
    ring: "ring-[#6366f1]",
    accent: "#6366f1",
  },
  violet: {
    card: "project-card--pink",
    pill: "project-pill--purple",
    stripe: "bg-[#8b5cf6]",
    badge: "bg-[#ede9fe] text-[#5b21b6]",
    ring: "ring-[#8b5cf6]",
    accent: "#8b5cf6",
  },
};

function isPortraitMockup(src: string): boolean {
  const meta = getImageMeta(src);
  if (!meta) return false;
  return meta.height > meta.width * 1.2;
}

function isMobileProject(project: ProjectItem): boolean {
  if (project.layout === "mobile") return true;
  if (project.layout === "featured") return false;
  return isPortraitMockup(project.image);
}

function getScreenSet(project: ProjectItem): ScreenSet {
  const full = project.galleryImages ?? [project.image];
  const preview = project.galleryPreviewImages ?? full;

  return { full, preview };
}

function getThumbSrc(src: string): string {
  const base = src.replace(/-preview\.png$/, ".png");
  return base.replace(/\.png$/, "-thumb.png");
}

function mockupToneClass(tinted = false): string {
  return cn(
    "ui-mockup-image transition-[filter] duration-300",
    tinted ? "grayscale-0" : "grayscale",
  );
}

function usePreviewTint() {
  const [tinted, setTinted] = useState(false);

  const clearTint = () => setTinted(false);
  const applyTint = () => setTinted(true);

  const heroBind = {
    onPointerEnter: (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") applyTint();
    },
    onPointerLeave: clearTint,
    onPointerDown: applyTint,
    onPointerUp: clearTint,
    onPointerCancel: clearTint,
  };

  const thumbBind = {
    onPointerDown: applyTint,
    onPointerUp: clearTint,
    onPointerLeave: clearTint,
    onPointerCancel: clearTint,
  };

  return { tinted, heroBind, thumbBind };
}

function WebHeroPreview({
  src,
  alt,
  tinted = false,
  className,
  heroBind,
}: {
  src: string;
  alt: string;
  tinted?: boolean;
  className?: string;
  heroBind?: Record<string, unknown>;
}) {
  const meta = getImageMeta(src);

  return (
    <div
      {...heroBind}
      className={cn(
        "group/preview relative touch-manipulation overflow-hidden rounded-2xl border-[3px] border-border bg-white shadow-[6px_6px_0_var(--shadow)]",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={meta?.width ?? 2040}
        height={meta?.height ?? 1275}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={cn(
          "pointer-events-none block h-auto max-h-[min(22rem,52vw)] w-full select-none object-contain object-top",
          mockupToneClass(tinted),
        )}
      />
    </div>
  );
}

function PhoneHeroPreview({
  src,
  alt,
  tinted = false,
  className,
  heroBind,
}: {
  src: string;
  alt: string;
  tinted?: boolean;
  className?: string;
  heroBind?: Record<string, unknown>;
}) {
  const meta = getImageMeta(src);

  return (
    <div {...heroBind} className={cn("group/preview flex touch-manipulation justify-center", className)}>
      <div className="relative w-full max-w-[15.5rem] overflow-hidden rounded-[2rem] border-[3px] border-border bg-[#111] p-2 shadow-[6px_6px_0_var(--shadow)] sm:max-w-[17rem]">
        <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-white/20" aria-hidden />
        <div
          className="overflow-hidden rounded-[1.35rem] bg-white"
          style={
            meta
              ? { aspectRatio: `${meta.width} / ${Math.min(meta.height, meta.width * 1.85)}` }
              : { aspectRatio: "9 / 16" }
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={meta?.width ?? 390}
            height={meta?.height ?? 844}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className={cn(
              "pointer-events-none block h-full w-full select-none object-cover object-top",
              mockupToneClass(tinted),
            )}
          />
        </div>
      </div>
    </div>
  );
}

function ViewScreensButton({
  label,
  pillClass,
  onClick,
  compact = false,
}: {
  label: string;
  pillClass: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "project-pill inline-flex w-fit items-center rounded-full bg-accent-2 font-black uppercase tracking-wide",
        pillClass,
        compact ? "px-5 py-2.5 text-sm" : "px-6 py-2.5 text-sm",
      )}
    >
      {label}
    </button>
  );
}

function ScrollPanel({
  src,
  alt,
  mobile,
  scrollRef,
  className,
}: {
  src: string;
  alt: string;
  mobile: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const meta = getImageMeta(src);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-[3px] border-border bg-white shadow-[6px_6px_0_var(--shadow)]",
        className,
      )}
    >
      <div
        ref={scrollRef}
        className={cn(
          "notebook-scroll max-h-[min(72vh,780px)] overflow-x-hidden overflow-y-auto bg-[#f8f8f8]",
          mobile ? "px-4 py-4 sm:px-6" : "px-3 py-3 sm:px-4",
        )}
      >
        <div className={cn("mx-auto", mobile ? "max-w-[17.5rem]" : "w-full max-w-3xl")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            width={meta?.width ?? 1020}
            height={meta?.height ?? 844}
            decoding="async"
            className="ui-mockup-image block h-auto w-full rounded-lg border border-border/40 bg-white shadow-sm"
          />
        </div>
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent"
        aria-hidden
      />
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] font-bold uppercase tracking-widest text-muted">
        scroll ↓
      </p>
    </div>
  );
}

function ScreenPicker({
  screens,
  previewScreens,
  labels,
  title,
  theme,
  activeIndex,
  onSelect,
  mobile,
  thumbBind,
}: {
  screens: string[];
  previewScreens: string[];
  labels?: string[];
  title: string;
  theme: UiTheme;
  activeIndex: number;
  onSelect: (index: number) => void;
  mobile: boolean;
  thumbBind?: Record<string, unknown>;
}) {
  const styles = themeStyles[theme];

  if (screens.length <= 1) return null;

  return (
    <div className="ui-screen-rail flex gap-1.5 overflow-x-auto pb-0.5 sm:gap-2">
      {screens.map((src, index) => {
        const label = labels?.[index] ?? `Screen ${index + 1}`;
        const active = index === activeIndex;
        const thumbSrc = getThumbSrc(src);

        return (
          <button
            key={src}
            type="button"
            {...thumbBind}
            onClick={() => onSelect(index)}
            aria-label={`${title} — ${label}`}
            aria-pressed={active}
            className={cn(
              "group/thumb shrink-0 touch-manipulation text-left transition-[transform,opacity] duration-200",
              active ? "opacity-100" : "opacity-80 hover:opacity-100",
            )}
          >
            <div
              className={cn(
                "pointer-events-none overflow-hidden rounded-lg border-2 border-border bg-white shadow-[2px_2px_0_var(--shadow)] transition-shadow",
                active && cn("border-[3px] ring-2 ring-offset-1 ring-offset-card", styles.ring),
                mobile ? "h-[5.25rem] w-[3rem] sm:h-[5.5rem] sm:w-[3.125rem]" : "h-[3.5rem] w-[5.75rem] sm:h-[4rem] sm:w-[6.5rem]",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbSrc}
                alt={label}
                width={mobile ? 120 : 208}
                height={mobile ? 260 : 128}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={cn(
                  "ui-mockup-image block h-full w-full select-none bg-white transition-[filter] duration-300",
                  mobile
                    ? "object-cover object-top grayscale group-active/thumb:grayscale-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/thumb:grayscale-0"
                    : "object-contain object-top grayscale group-active/thumb:grayscale-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/thumb:grayscale-0",
                )}
              />
            </div>
            <p
              className={cn(
                "mt-0.5 truncate text-center text-[10px] font-bold leading-tight",
                mobile ? "max-w-[3.125rem]" : "max-w-[6.5rem]",
                active ? "text-fg" : "text-muted",
              )}
            >
              {label}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function ProjectPreview({
  screens,
  previewScreens,
  labels,
  title,
  theme,
  mobile,
}: {
  screens: string[];
  previewScreens: string[];
  labels?: string[];
  title: string;
  theme: UiTheme;
  mobile: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { tinted, heroBind, thumbBind } = usePreviewTint();
  const activeFull = screens[activeIndex] ?? screens[0];
  const activePreview = previewScreens[activeIndex] ?? previewScreens[0] ?? activeFull;
  const activeLabel = labels?.[activeIndex];

  return (
    <div className="space-y-2">
      {mobile ? (
        <PhoneHeroPreview
          src={activePreview}
          alt={activeLabel ? `${title} — ${activeLabel}` : title}
          tinted={tinted}
          heroBind={heroBind}
        />
      ) : (
        <WebHeroPreview
          src={activePreview}
          alt={activeLabel ? `${title} — ${activeLabel}` : title}
          tinted={tinted}
          heroBind={heroBind}
        />
      )}

      <ScreenPicker
        screens={screens}
        previewScreens={previewScreens}
        labels={labels}
        title={title}
        theme={theme}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        mobile={mobile}
        thumbBind={thumbBind}
      />
    </div>
  );
}

function ModalPreview({
  screens,
  labels,
  title,
  mobile,
}: {
  screens: string[];
  labels?: string[];
  title: string;
  mobile: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeSrc = screens[activeIndex] ?? screens[0];
  const activeLabel = labels?.[activeIndex];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeIndex, activeSrc]);

  return (
    <div className="space-y-4">
      <ScrollPanel
        src={activeSrc}
        alt={activeLabel ? `${title} — ${activeLabel}` : title}
        mobile={mobile}
        scrollRef={scrollRef}
      />

      {screens.length > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="pop-btn flex h-9 w-9 items-center justify-center bg-card disabled:opacity-40"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[8rem] text-center text-xs font-bold">
            {activeLabel ?? `Screen ${activeIndex + 1}`}
            <span className="block text-[10px] font-medium text-muted">
              {activeIndex + 1} / {screens.length}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.min(screens.length - 1, i + 1))}
            disabled={activeIndex === screens.length - 1}
            className="pop-btn flex h-9 w-9 items-center justify-center bg-card disabled:opacity-40"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      ) : null}
    </div>
  );
}

function UiUxModal({ project, onClose }: { project: ProjectItem | null; onClose: () => void }) {
  const t = useTranslations("projects");
  const tCase = useTranslations("projects.caseStudy");

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
  const { full: screens } = getScreenSet(project);
  const screenLabels = caseStudy?.screenLabels;
  const mobile = isMobileProject(project);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6"
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
            <div className="bg-surface p-4 sm:p-6">
              <ModalPreview
                screens={screens}
                labels={screenLabels}
                title={work.title}
                mobile={mobile}
              />
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
                        {t("uiUxDesign.highlights")}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {caseStudy.highlights.map((item) => (
                          <li key={item} className="flex gap-2 text-sm leading-relaxed text-fg">
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
                        {t("uiUxDesign.tools")}
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

export function UiUxDesignGallery({ items }: { items: ProjectItem[] }) {
  const t = useTranslations("projects");
  const copy = t.raw("items") as Record<string, WorkCopy>;
  const tagLabels = t.raw("tagLabels") as Record<string, string>;
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  const featured = items.find((item) => item.layout === "featured") ?? items[0];
  const rest = items.filter((item) => item.id !== featured?.id);

  return (
    <>
      <UiUxModal project={selected} onClose={() => setSelected(null)} />

      <div className="space-y-10 sm:space-y-14">
        {featured ? (
          <FeaturedShowcase
            project={featured}
            work={copy[featured.id]}
            tagLabels={tagLabels}
            onOpen={() => setSelected(featured)}
          />
        ) : null}

        <div className="space-y-8 sm:space-y-10">
          {rest.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              work={copy[project.id]}
              tagLabels={tagLabels}
              index={index}
              reversed={index % 2 === 1}
              onOpen={() => setSelected(project)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function FeaturedShowcase({
  project,
  work,
  tagLabels,
  onOpen,
}: {
  project: ProjectItem;
  work: WorkCopy;
  tagLabels: Record<string, string>;
  onOpen: () => void;
}) {
  const t = useTranslations("projects");
  const tCase = useTranslations("projects.caseStudy");
  const theme = project.uiTheme ?? "purple";
  const styles = themeStyles[theme];
  const screenCount = project.galleryImages?.length ?? 1;
  const caseStudy = tCase.raw(`items.${project.id}`) as CaseStudyCopy | undefined;
  const screenLabels = caseStudy?.screenLabels;
  const { full, preview } = getScreenSet(project);
  const mobile = isMobileProject(project);
  const DeviceIcon = mobile ? Smartphone : Monitor;

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn("project-card overflow-hidden rounded-3xl bg-card", styles.card)}
    >
      <div className={cn("h-1.5", styles.stripe)} aria-hidden />

      <div className="grid gap-0 lg:grid-cols-2">
        <div className="border-b-[3px] border-border bg-surface p-4 sm:p-6 lg:border-b-0 lg:border-r-[3px]">
          <ProjectPreview
            screens={full}
            previewScreens={preview}
            labels={screenLabels}
            title={work.title}
            theme={theme}
            mobile={mobile}
          />
        </div>

        <div className="flex flex-col justify-center gap-3 p-5 sm:p-7 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase sm:text-xs",
                styles.badge,
              )}
            >
              <DeviceIcon size={12} strokeWidth={3} />
              {t("uiUxDesign.featured")}
            </span>
            <span className="rounded-full border-2 border-border bg-accent-3 px-3 py-1 text-[10px] font-black uppercase sm:text-xs">
              {t("uiUxDesign.clientProject")}
            </span>
            <span className="rounded-full border-2 border-border bg-card px-3 py-1 text-[10px] font-black uppercase text-muted sm:text-xs">
              {t("uiUxDesign.screens", { count: screenCount })}
            </span>
          </div>

          <div>
            <h3 className="font-display text-balance text-2xl font-black uppercase leading-tight sm:text-3xl">
              {work.title}
            </h3>
            <p className="mt-2 text-sm font-bold text-fg sm:text-base">{work.detail}</p>
          </div>

          <p className="text-sm leading-relaxed text-muted sm:text-base">{work.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs"
              >
                {getProjectTagLabel(tag, tagLabels)}
              </span>
            ))}
          </div>

          <ViewScreensButton
            label={t("uiUxDesign.viewScreens")}
            pillClass={styles.pill}
            onClick={onOpen}
          />
        </div>
      </div>
    </motion.article>
  );
}

function ProjectCard({
  project,
  work,
  tagLabels,
  index,
  reversed,
  onOpen,
}: {
  project: ProjectItem;
  work: WorkCopy;
  tagLabels: Record<string, string>;
  index: number;
  reversed: boolean;
  onOpen: () => void;
}) {
  const t = useTranslations("projects");
  const tCase = useTranslations("projects.caseStudy");
  const theme = project.uiTheme ?? "purple";
  const styles = themeStyles[theme];
  const screenCount = project.galleryImages?.length ?? 1;
  const isCompetency = isUiUxCompetencyProject(project.tags);
  const isClient = isUiUxClientProject(project.tags);
  const caseStudy = tCase.raw(`items.${project.id}`) as CaseStudyCopy | undefined;
  const screenLabels = caseStudy?.screenLabels;
  const { full, preview } = getScreenSet(project);
  const mobile = isMobileProject(project);
  const DeviceIcon = mobile ? Smartphone : Monitor;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: (index % 3) * 0.05,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "project-card group overflow-hidden rounded-3xl bg-card",
        styles.card,
      )}
    >
      <div className={cn("h-1", styles.stripe)} aria-hidden />

      <div
        className={cn(
          "grid gap-0 lg:grid-cols-2",
          reversed && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div
          className={cn(
            "border-b-[3px] border-border bg-surface p-4 sm:p-5 lg:border-b-0 lg:border-r-[3px]",
            reversed && "lg:border-r-0 lg:border-l-[3px]",
          )}
        >
          <ProjectPreview
            screens={full}
            previewScreens={preview}
            labels={screenLabels}
            title={work.title}
            theme={theme}
            mobile={mobile}
          />
        </div>

        <div className="flex flex-col justify-center gap-3 p-5 sm:p-6 lg:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase sm:text-xs",
                styles.badge,
              )}
            >
              <DeviceIcon size={12} strokeWidth={3} />
              {mobile ? t("uiUxDesign.mobileApp") : t("uiUxDesign.webDesign")}
            </span>
            {isCompetency ? (
              <span className="rounded-full border-2 border-border bg-accent-3 px-3 py-1 text-[10px] font-black uppercase sm:text-xs">
                {t("uiUxDesign.competencyProject")}
              </span>
            ) : null}
            {isClient ? (
              <span className="rounded-full border-2 border-border bg-accent-3 px-3 py-1 text-[10px] font-black uppercase sm:text-xs">
                {t("uiUxDesign.clientProject")}
              </span>
            ) : null}
            {screenCount > 1 ? (
              <span className="rounded-full border-2 border-border bg-card px-3 py-1 text-[10px] font-black uppercase text-muted sm:text-xs">
                {t("uiUxDesign.screens", { count: screenCount })}
              </span>
            ) : null}
          </div>

          <div>
            <h3 className="font-display text-balance text-xl font-black uppercase leading-snug sm:text-2xl">
              {work.title}
            </h3>
            <p className="mt-2 text-sm font-bold text-fg">{work.detail}</p>
          </div>

          <p className="text-sm leading-relaxed text-muted sm:text-base">{work.description}</p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs"
              >
                {getProjectTagLabel(tag, tagLabels)}
              </span>
            ))}
          </div>

          <ViewScreensButton
            label={t("uiUxDesign.viewScreens")}
            pillClass={styles.pill}
            onClick={onOpen}
            compact
          />
        </div>
      </div>
    </motion.article>
  );
}
