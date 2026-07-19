"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  ChevronDown,
  Cpu,
  ExternalLink,
  FileText,
  Filter,
  LineChart,
  Sparkles,
  X,
} from "lucide-react";
import { NotebookViewer } from "@/components/proyek/NotebookViewer";
import { getImageMeta } from "@/data/project-image-meta";
import type { MlTheme, ProjectItem } from "@/data/projects";
import { getProjectTagLabel } from "@/lib/project-tags";
import { cn } from "@/lib/utils";

type WorkCopy = {
  title: string;
  description: string;
  detail: string;
};

type MlCaseStudyCopy = {
  overview: string;
  highlights: string[];
  tools: string[];
  pipeline?: string[];
  metrics?: {
    rmse?: string;
    mape?: string;
    r2?: string;
  };
  metricsSummary?: string;
};

const mlThemeStyles: Record<
  MlTheme,
  {
    card: string;
    pill: string;
    stripe: string;
    badge: string;
    sticker: string;
    filterActive: string;
  }
> = {
  forecast: {
    card: "project-card--sky",
    pill: "project-pill--sky",
    stripe: "bg-[#0ea5e9]",
    badge: "bg-[#e0f2fe] text-[#0369a1]",
    sticker: "bg-accent-4",
    filterActive: "bg-accent-4 text-white",
  },
  classification: {
    card: "project-card--lime",
    pill: "project-pill--purple",
    stripe: "bg-[#22c55e]",
    badge: "bg-[#dcfce7] text-[#15803d]",
    sticker: "bg-accent-2",
    filterActive: "bg-accent-2 text-fg",
  },
  signal: {
    card: "project-card--pink",
    pill: "project-pill--pink",
    stripe: "bg-[#f97316]",
    badge: "bg-[#ffedd5] text-[#c2410c]",
    sticker: "bg-accent-3",
    filterActive: "bg-accent-3 text-white",
  },
  eda: {
    card: "project-card--purple",
    pill: "project-pill--sky",
    stripe: "bg-[#a855f7]",
    badge: "bg-[#f3e8ff] text-[#7e22ce]",
    sticker: "bg-accent",
    filterActive: "bg-accent text-white",
  },
  nlp: {
    card: "project-card--sky",
    pill: "project-pill--pink",
    stripe: "bg-[#6366f1]",
    badge: "bg-[#e0e7ff] text-[#4338ca]",
    sticker: "bg-accent-4",
    filterActive: "bg-accent-4 text-white",
  },
};

const filterThemes: Array<MlTheme | "all"> = [
  "all",
  "forecast",
  "classification",
  "signal",
  "eda",
  "nlp",
];

function PipelineSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step} className="flex flex-col items-center">
          <span className="w-full rounded-xl border-[3px] border-border bg-card px-3 py-2 text-center text-xs font-bold text-fg sm:text-sm">
            {step}
          </span>
          {index < steps.length - 1 ? (
            <ChevronDown
              size={18}
              strokeWidth={3}
              className="my-0.5 shrink-0 text-accent"
              aria-hidden
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function NotebookPreview({
  src,
  alt,
  tall = false,
  expanded = false,
  className,
}: {
  src: string;
  alt: string;
  tall?: boolean;
  /** Wider, taller frame for modal / featured hero */
  expanded?: boolean;
  className?: string;
}) {
  const meta = getImageMeta(src);
  const imageWidth = meta?.width ?? 834;
  const imageHeight = meta?.height ?? 4096;

  return (
    <div
      className={cn(
        "notebook-frame group/notebook relative overflow-hidden rounded-2xl border-[3px] border-border bg-[#0d1117] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        expanded
          ? "h-[min(78vh,880px)]"
          : tall
            ? "h-[min(520px,62vh)]"
            : "h-[300px] sm:h-[340px]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#161b22] px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" aria-hidden />
        <span className="ml-2 truncate text-[10px] font-bold uppercase tracking-wider text-white/50 sm:text-xs">
          notebook.ipynb
        </span>
      </div>

      <div className="notebook-scroll h-[calc(100%-36px)] overflow-y-auto overflow-x-hidden px-1.5 py-1 sm:px-2">
        {/* Native img keeps notebook pixels 1:1 when downscaled (no Next.js resize pass) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={imageWidth}
          height={imageHeight}
          decoding="async"
          className="notebook-image block h-auto w-full max-w-none grayscale transition-all duration-500 group-hover:grayscale-0 group-focus-within:grayscale-0"
        />
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d1117] to-transparent opacity-80 transition-opacity duration-300 group-hover/notebook:opacity-30"
        aria-hidden
      />
      <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] font-black uppercase tracking-widest text-white/40">
        scroll ↓
      </p>
    </div>
  );
}

function AiMlModal({
  project,
  onClose,
}: {
  project: ProjectItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("projects");
  const tCase = useTranslations("projects.caseStudy");
  const theme = project?.mlTheme ?? "forecast";
  const styles = mlThemeStyles[theme];

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
  const caseStudy = tCase.raw(`items.${project.id}`) as MlCaseStudyCopy | undefined;

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
          className="relative z-10 flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)] sm:rounded-3xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-border px-4 py-3 sm:px-6 sm:py-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-widest sm:text-sm">
                {work.title}
              </p>
              {project.metricHighlight ? (
                <p className="mt-0.5 text-[10px] font-bold text-accent sm:text-xs">
                  {project.metricHighlight}
                </p>
              ) : null}
            </div>
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
            <div className="grid gap-0 lg:grid-cols-5">
              <div className="border-b-[3px] border-border p-4 sm:p-5 lg:col-span-3 lg:border-b-0 lg:border-r-[3px]">
                <NotebookViewer slug={project.id} expanded />
              </div>

              <div className="space-y-4 p-5 sm:p-6 lg:col-span-2">
                <div>
                  <p className="text-sm font-bold text-fg">{work.detail}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
                    {work.description}
                  </p>
                </div>

                {caseStudy?.metrics ? (
                  <div className="grid grid-cols-3 gap-2">
                    {caseStudy.metrics.rmse ? (
                      <div className="rounded-xl border-[3px] border-border bg-accent-2 p-3 text-center">
                        <p className="text-[10px] font-black uppercase text-muted">
                          {tCase("labels.rmse")}
                        </p>
                        <p className="mt-1 font-display text-lg font-black sm:text-xl">
                          {caseStudy.metrics.rmse}
                        </p>
                      </div>
                    ) : null}
                    {caseStudy.metrics.mape ? (
                      <div className="rounded-xl border-[3px] border-border bg-accent-4/30 p-3 text-center">
                        <p className="text-[10px] font-black uppercase text-muted">
                          {tCase("labels.mape")}
                        </p>
                        <p className="mt-1 font-display text-lg font-black sm:text-xl">
                          {caseStudy.metrics.mape}
                        </p>
                      </div>
                    ) : null}
                    {caseStudy.metrics.r2 ? (
                      <div className="rounded-xl border-[3px] border-border bg-accent p-3 text-center text-white">
                        <p className="text-[10px] font-black uppercase text-white/80">
                          {tCase("labels.r2")}
                        </p>
                        <p className="mt-1 font-display text-lg font-black sm:text-xl">
                          {caseStudy.metrics.r2}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {caseStudy ? (
                  <>
                    <div className="border-[3px] border-border bg-accent-2 p-4">
                      <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                        {tCase("labels.overview")}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed">{caseStudy.overview}</p>
                      {caseStudy.metricsSummary ? (
                        <p className="mt-2 text-xs font-bold text-fg sm:text-sm">
                          {caseStudy.metricsSummary}
                        </p>
                      ) : null}
                    </div>

                    {caseStudy.pipeline?.length ? (
                      <div className="border-[3px] border-border bg-card p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                          {tCase("labels.pipeline")}
                        </h3>
                        <div className="mt-3">
                          <PipelineSteps steps={caseStudy.pipeline} />
                        </div>
                      </div>
                    ) : null}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="border-[3px] border-border bg-card p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                          {t("aiMl.highlights")}
                        </h3>
                        <ul className="mt-3 space-y-2">
                          {caseStudy.highlights.map((item) => (
                            <li
                              key={item}
                              className="flex gap-2 text-sm leading-relaxed text-fg"
                            >
                              <Sparkles
                                size={14}
                                className="mt-0.5 shrink-0 text-accent"
                                aria-hidden
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="border-[3px] border-border bg-accent-4/20 p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                          {t("aiMl.tools")}
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

                <div className="flex flex-wrap gap-3">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "project-pill inline-flex items-center gap-2 rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                        styles.pill,
                      )}
                    >
                      {tCase("visitSite")}
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                  {project.documentUrl ? (
                    <a
                      href={project.documentUrl}
                      download
                      className="project-pill project-pill--pink inline-flex items-center gap-2 rounded-full bg-accent-3 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white"
                    >
                      <FileText size={16} />
                      {t("aiMl.downloadNotebook")}
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      "project-pill inline-flex items-center rounded-full px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                      project.liveUrl || project.documentUrl
                        ? "border-2 border-border bg-card"
                        : cn("bg-accent-2", styles.pill),
                    )}
                  >
                    {tCase("close")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface AiMlGalleryProps {
  items: ProjectItem[];
}

export function AiMlGallery({ items }: AiMlGalleryProps) {
  const t = useTranslations("projects");
  const copy = t.raw("items") as Record<string, WorkCopy>;
  const tagLabels = t.raw("tagLabels") as Record<string, string>;
  const [selected, setSelected] = useState<ProjectItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<MlTheme | "all">("all");

  const featured = items.find((item) => item.id === "pm25-sca-lstm") ?? items[0];
  const rest = items.filter((item) => item.id !== featured?.id);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return rest;
    return rest.filter((item) => item.mlTheme === activeFilter);
  }, [rest, activeFilter]);

  const themeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const item of items) {
      if (item.mlTheme) counts[item.mlTheme] = (counts[item.mlTheme] ?? 0) + 1;
    }
    return counts;
  }, [items]);

  return (
    <>
      <AiMlModal project={selected} onClose={() => setSelected(null)} />

      <div className="space-y-8 sm:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-3 sm:grid-cols-3"
        >
          {[
            { icon: Brain, label: t("aiMl.statNotebooks"), value: String(items.length) },
            { icon: Cpu, label: t("aiMl.statAlgorithms"), value: "6+" },
            { icon: LineChart, label: t("aiMl.statDomains"), value: "5" },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="brutal-card flex items-center gap-4 rounded-2xl border-[3px] border-border bg-card p-4 sm:p-5"
            >
              <div className="sticker flex h-12 w-12 shrink-0 items-center justify-center bg-accent-2">
                <Icon size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-display text-2xl font-black sm:text-3xl">{value}</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted sm:text-xs">
                  {label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {featured ? (
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="project-card group relative overflow-hidden rounded-3xl bg-card project-card--sky"
          >
            <div className="absolute inset-x-0 top-0 h-2 bg-[#0ea5e9]" aria-hidden />

            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:items-start lg:gap-8 lg:p-8">
              <div className="space-y-4 lg:col-span-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] px-3 py-1 text-[10px] font-black uppercase text-[#0369a1] sm:text-xs">
                    <Sparkles size={12} strokeWidth={3} />
                    {t("aiMl.featured")}
                  </span>
                  {featured.metricHighlight ? (
                    <span className="rounded-full border-2 border-border bg-accent px-3 py-1 text-[10px] font-black uppercase text-white sm:text-xs">
                      {featured.metricHighlight}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-display text-2xl font-black uppercase leading-tight sm:text-3xl lg:text-4xl">
                    {copy[featured.id].title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-fg sm:text-base">
                    {copy[featured.id].detail}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {copy[featured.id].description}
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "RMSE", value: "0.1042" },
                    { label: "MAPE", value: "0.8847" },
                    { label: "R²", value: "0.9787" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border-[3px] border-border bg-accent-2 p-2.5 text-center sm:p-3"
                    >
                      <p className="text-[9px] font-black uppercase text-muted sm:text-[10px]">
                        {metric.label}
                      </p>
                      <p className="font-display text-base font-black sm:text-lg">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

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

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelected(featured)}
                    className="project-pill project-pill--sky inline-flex items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide"
                  >
                    {t("aiMl.viewNotebook")}
                  </button>
                  {featured.documentUrl ? (
                    <a
                      href={featured.documentUrl}
                      download
                      className="project-pill project-pill--pink inline-flex items-center gap-2 rounded-full bg-accent-3 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white"
                    >
                      <FileText size={16} />
                      .ipynb
                    </a>
                  ) : null}
                  {featured.liveUrl ? (
                    <a
                      href={featured.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-pill project-pill--purple inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white"
                    >
                      {t("caseStudy.visitSite")}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="relative lg:col-span-7">
                <button
                  type="button"
                  onClick={() => setSelected(featured)}
                  className="block w-full text-left"
                >
                  <NotebookPreview
                    src={featured.image}
                    alt={copy[featured.id].title}
                    expanded
                  />
                </button>
              </div>
            </div>
          </motion.article>
        ) : null}

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={16} className="text-muted" aria-hidden />
            <span className="text-xs font-black uppercase tracking-widest text-muted">
              {t("aiMl.filterLabel")}
            </span>
            {filterThemes.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setActiveFilter(theme)}
                className={cn(
                  "rounded-full border-2 border-border px-3 py-1.5 text-[10px] font-black uppercase transition-colors sm:text-xs",
                  activeFilter === theme
                    ? theme === "all"
                      ? "bg-fg text-card"
                      : mlThemeStyles[theme as MlTheme].filterActive
                    : "bg-card text-fg hover:bg-accent-2",
                )}
              >
                {t(`aiMl.filters.${theme}`)}
                {themeCounts[theme] ? ` (${themeCounts[theme]})` : ""}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, index) => {
                const work = copy[project.id];
                const theme = project.mlTheme ?? "forecast";
                const styles = mlThemeStyles[theme];

                return (
                  <motion.article
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "project-card group flex flex-col overflow-hidden rounded-3xl bg-card",
                      styles.card,
                    )}
                  >
                    <div className={cn("h-1.5", styles.stripe)} aria-hidden />

                    <button
                      type="button"
                      onClick={() => setSelected(project)}
                      className="relative p-4 pb-0 text-left sm:p-5 sm:pb-0"
                    >
                      <NotebookPreview src={project.image} alt={work.title} />
                    </button>

                    <div className="flex flex-1 flex-col space-y-3 p-4 sm:space-y-4 sm:p-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[10px] font-black uppercase sm:text-xs",
                            styles.badge,
                          )}
                        >
                          {t(`aiMl.filters.${theme}`)}
                        </span>
                        {project.metricHighlight ? (
                          <span className="rounded-full border-2 border-border bg-accent px-2.5 py-1 text-[10px] font-black uppercase text-white sm:text-xs">
                            {project.metricHighlight}
                          </span>
                        ) : null}
                      </div>

                      <div>
                        <h3 className="font-display text-base font-black uppercase leading-snug sm:text-lg">
                          {work.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs font-bold text-fg sm:text-sm">
                          {work.detail}
                        </p>
                      </div>

                      <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                        {work.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border-2 border-border bg-accent-2 px-2.5 py-0.5 text-[9px] font-black uppercase sm:text-[10px]"
                          >
                            {getProjectTagLabel(tag, tagLabels)}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelected(project)}
                        className={cn(
                          "project-pill mt-auto inline-flex w-fit items-center rounded-full bg-accent-2 px-4 py-2 text-xs font-black uppercase tracking-wide sm:text-sm",
                          styles.pill,
                        )}
                      >
                        {t("aiMl.viewNotebook")}
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
