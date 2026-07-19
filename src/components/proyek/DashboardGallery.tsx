"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  Factory,
  Sparkles,
  X,
} from "lucide-react";
import type { DashboardTheme, ProjectItem } from "@/data/projects";
import { cn } from "@/lib/utils";

type WorkCopy = {
  title: string;
  description: string;
  detail: string;
};

type DashboardCaseStudy = {
  overview: string;
  highlights: string[];
  chartInsights?: string[];
  tools: string[];
  pipeline?: string[];
  metrics?: {
    rmse?: string;
    mape?: string;
    r2?: string;
    mae?: string;
    mse?: string;
  };
  metricsSummary?: string;
};

const themeStyles: Record<
  DashboardTheme,
  {
    card: string;
    pill: string;
    stripe: string;
    badge: string;
    sticker: string;
    frame: string;
  }
> = {
  lstm: {
    card: "project-card--sky",
    pill: "project-pill--sky",
    stripe: "bg-[#1d4ed8]",
    badge: "bg-[#dbeafe] text-[#1e40af]",
    sticker: "bg-accent-4",
    frame: "bg-[linear-gradient(160deg,#eff6ff_0%,#dbeafe_40%,#f8fafc_100%)]",
  },
  rf: {
    card: "project-card--lime",
    pill: "project-pill--purple",
    stripe: "bg-[#059669]",
    badge: "bg-[#d1fae5] text-[#047857]",
    sticker: "bg-accent-2",
    frame: "bg-[linear-gradient(160deg,#ecfdf5_0%,#d1fae5_40%,#f8fafc_100%)]",
  },
  clustering: {
    card: "project-card--pink",
    pill: "project-pill--pink",
    stripe: "bg-[#d97706]",
    badge: "bg-[#ffedd5] text-[#b45309]",
    sticker: "bg-accent-3",
    frame: "bg-[linear-gradient(160deg,#fffbeb_0%,#fef3c7_40%,#f8fafc_100%)]",
  },
};

function PipelineSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-2">
      {steps.map((step, index) => (
        <li
          key={step}
          className="flex items-start gap-2 rounded-xl border-[3px] border-border bg-card px-3 py-2.5 text-sm font-bold"
        >
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-2 text-[10px] font-black">
            {index + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}

function PosterFrame({
  src,
  alt,
  theme,
  onClick,
  priority = false,
}: {
  src: string;
  alt: string;
  theme: DashboardTheme;
  onClick?: () => void;
  priority?: boolean;
}) {
  const styles = themeStyles[theme];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/poster relative block w-full overflow-hidden rounded-2xl border-[3px] border-border p-3 shadow-[6px_6px_0_var(--shadow)] transition-transform duration-500 hover:-translate-y-1 sm:p-4",
        styles.frame,
        onClick ? "cursor-pointer text-left" : "cursor-default",
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative mx-auto aspect-[1190/1684] max-h-[min(72vh,920px)] w-full overflow-hidden rounded-xl border-[3px] border-border bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={100}
          unoptimized
          className="object-contain object-center grayscale transition-all duration-500 group-hover/poster:scale-[1.02] group-hover/poster:grayscale-0"
          sizes="(max-width: 768px) 100vw, 560px"
        />
      </div>
    </button>
  );
}

function DashboardModal({
  project,
  onClose,
}: {
  project: ProjectItem | null;
  onClose: () => void;
}) {
  const t = useTranslations("projects");
  const tCase = useTranslations("projects.caseStudy");
  const theme = project?.dashboardTheme ?? "lstm";
  const styles = themeStyles[theme];

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
  const caseStudy = tCase.raw(`items.${project.id}`) as DashboardCaseStudy | undefined;
  const visuals = [project.image, ...(project.galleryImages ?? [])];
  const visualCaptions = caseStudy?.chartInsights ?? [];

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
          className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)] sm:rounded-3xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-border px-4 py-3 sm:px-6 sm:py-4">
            <div className="min-w-0">
              <p className="truncate text-xs font-black uppercase tracking-widest sm:text-sm">
                {work.title}
              </p>
              <p className="mt-0.5 truncate text-[10px] font-bold text-muted sm:text-xs">
                {work.detail}
              </p>
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
            <div className="grid gap-0 lg:grid-cols-2">
              <div className={cn("space-y-4 border-b-[3px] border-border p-4 sm:p-5 lg:border-b-0 lg:border-r-[3px]", styles.frame)}>
                <PosterFrame src={project.image} alt={work.title} theme={theme} />
                {visuals.length > 1 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visuals.slice(1).map((src, index) => (
                      <div key={src} className="space-y-2">
                        <PosterFrame
                          src={src}
                          alt={`${work.title} ${index + 2}`}
                          theme={theme}
                        />
                        {visualCaptions[index + 1] ? (
                          <p className="px-1 text-[11px] font-bold leading-relaxed text-muted sm:text-xs">
                            {visualCaptions[index + 1]}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
                {visualCaptions[0] ? (
                  <p className="px-1 text-xs font-bold leading-relaxed text-muted sm:text-sm">
                    {visualCaptions[0]}
                  </p>
                ) : null}
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {work.description}
                </p>

                {caseStudy?.metrics ? (
                  <div className="grid grid-cols-3 gap-2">
                    {caseStudy.metrics.r2 ? (
                      <div className="rounded-xl border-[3px] border-border bg-accent p-3 text-center text-white">
                        <p className="text-[10px] font-black uppercase text-white/80">R²</p>
                        <p className="font-display text-lg font-black">{caseStudy.metrics.r2}</p>
                      </div>
                    ) : null}
                    {caseStudy.metrics.mae ? (
                      <div className="rounded-xl border-[3px] border-border bg-accent-2 p-3 text-center">
                        <p className="text-[10px] font-black uppercase text-muted">MAE</p>
                        <p className="font-display text-lg font-black">{caseStudy.metrics.mae}</p>
                      </div>
                    ) : null}
                    {caseStudy.metrics.mse ? (
                      <div className="rounded-xl border-[3px] border-border bg-accent-4/30 p-3 text-center">
                        <p className="text-[10px] font-black uppercase text-muted">MSE</p>
                        <p className="font-display text-lg font-black">{caseStudy.metrics.mse}</p>
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
                        <p className="mt-2 text-xs font-bold sm:text-sm">{caseStudy.metricsSummary}</p>
                      ) : null}
                    </div>

                    {caseStudy.pipeline?.length ? (
                      <div className="border-[3px] border-border bg-card p-4">
                        <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                          {t("dashboards.workflow")}
                        </h3>
                        <div className="mt-3">
                          <PipelineSteps steps={caseStudy.pipeline} />
                        </div>
                      </div>
                    ) : null}

                    <div className="border-[3px] border-border bg-card p-4">
                      <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                        {t("dashboards.highlights")}
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {caseStudy.highlights.map((item) => (
                          <li key={item} className="flex gap-2 text-sm leading-relaxed">
                            <Sparkles size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tools.map((tool) => (
                        <span
                          key={tool}
                          className="rounded-full border-2 border-border bg-accent-4/20 px-3 py-1 text-xs font-black uppercase"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}

                {project.documentUrl ? (
                  <a
                    href={project.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "project-pill inline-flex items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                      styles.pill,
                    )}
                  >
                    {t("dashboards.openPortfolio")}
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface DashboardGalleryProps {
  items: ProjectItem[];
}

export function DashboardGallery({ items }: DashboardGalleryProps) {
  const t = useTranslations("projects");
  const copy = t.raw("items") as Record<string, WorkCopy>;
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  const featured = items.find((item) => item.id === "pertamina-lstm-pipes") ?? items[0];
  const rest = items.filter((item) => item.id !== featured?.id);

  return (
    <>
      <DashboardModal project={selected} onClose={() => setSelected(null)} />

      <div className="space-y-8 sm:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border-[3px] border-border bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#172554_100%)] p-5 text-white shadow-[8px_8px_0_var(--shadow)] sm:p-7 lg:p-8"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,#fff_1px,transparent_1px)] [background-size:20px_20px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-accent-4/15 blur-3xl"
            aria-hidden
          />

          <div className="relative space-y-6">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0_rgba(0,0,0,0.35)] sm:text-xs">
                <Factory size={14} strokeWidth={2.5} />
                {t("dashboards.caseStudyBadge")}
              </span>
              <h3 className="font-display text-2xl font-black uppercase leading-[1.1] sm:text-3xl lg:text-[2.75rem]">
                {t("dashboards.heroTitle")}
              </h3>
              <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
                {t("dashboards.heroDescription")}
              </p>
            </div>

            <dl className="grid gap-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/[0.07] backdrop-blur-sm sm:grid-cols-2">
              {(
                [
                  ["metaIndustryLabel", "metaIndustry"],
                  ["metaDatasetLabel", "metaDataset"],
                  ["metaMethodsLabel", "metaMethods"],
                  ["metaPlatformLabel", "metaPlatform"],
                ] as const
              ).map(([labelKey, valueKey], index) => (
                <div
                  key={valueKey}
                  className={cn(
                    "flex items-baseline gap-3 border-white/10 px-4 py-3.5 sm:px-5 sm:py-4",
                    index < 2 && "border-b",
                    index % 2 === 0 && "sm:border-r",
                  )}
                >
                  <dt className="w-[5.75rem] shrink-0 text-[10px] font-black uppercase tracking-widest text-white/50 sm:w-[6.25rem] sm:text-xs">
                    {t(`dashboards.${labelKey}`)}:
                  </dt>
                  <dd className="min-w-0 text-sm font-bold leading-snug text-white sm:text-base">
                    {t(`dashboards.${valueKey}`)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2">
              {(t.raw("dashboards.heroTags") as string[]).map((tag, index) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full border-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[2px_2px_0_rgba(0,0,0,0.25)] sm:text-xs",
                    index % 3 === 0
                      ? "border-white/25 bg-white/15 text-white"
                      : index % 3 === 1
                        ? "border-accent-2/40 bg-accent-2/90 text-fg"
                        : "border-accent-4/40 bg-accent-4/80 text-white",
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {featured ? (
          <motion.article
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "project-card group relative overflow-hidden rounded-3xl bg-card",
              themeStyles[featured.dashboardTheme ?? "lstm"].card,
            )}
          >
            <div
              className={cn("absolute inset-x-0 top-0 h-2", themeStyles[featured.dashboardTheme ?? "lstm"].stripe)}
              aria-hidden
            />

            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-12 lg:items-start lg:gap-8 lg:p-8">
              <div className="space-y-4 lg:col-span-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-black uppercase text-white sm:text-xs">
                    <Sparkles size={12} />
                    {t("dashboards.featured")}
                  </span>
                  {featured.metricHighlight ? (
                    <span className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs">
                      {featured.metricHighlight}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-display text-2xl font-black uppercase leading-tight sm:text-3xl">
                    {copy[featured.id].title}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-fg">{copy[featured.id].detail}</p>
                </div>

                <p className="text-sm leading-relaxed text-muted sm:text-base">
                  {copy[featured.id].description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase sm:text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelected(featured)}
                    className={cn(
                      "project-pill inline-flex items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                      themeStyles[featured.dashboardTheme ?? "lstm"].pill,
                    )}
                  >
                    {t("dashboards.viewDashboard")}
                  </button>
                  {featured.documentUrl ? (
                    <a
                      href={featured.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-pill project-pill--pink inline-flex items-center rounded-full bg-accent-3 px-5 py-2.5 text-sm font-black uppercase tracking-wide text-white"
                    >
                      {t("dashboards.openPortfolio")}
                    </a>
                  ) : null}
                </div>
              </div>

              <div className="relative lg:col-span-7">
                <PosterFrame
                  src={featured.image}
                  alt={copy[featured.id].title}
                  theme={featured.dashboardTheme ?? "lstm"}
                  onClick={() => setSelected(featured)}
                  priority
                />
              </div>
            </div>
          </motion.article>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-2">
          {rest.map((project, index) => {
            const work = copy[project.id];
            const theme = project.dashboardTheme ?? "rf";
            const styles = themeStyles[theme];

            return (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={cn("project-card group overflow-hidden rounded-3xl bg-card", styles.card)}
              >
                <div className={cn("h-1.5", styles.stripe)} aria-hidden />

                <div className="space-y-4 p-4 sm:p-5">
                  <PosterFrame
                    src={project.image}
                    alt={work.title}
                    theme={theme}
                    onClick={() => setSelected(project)}
                  />

                  <div className="space-y-3 px-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-black uppercase sm:text-xs", styles.badge)}>
                        {t(`dashboards.themes.${theme}`)}
                      </span>
                      {project.metricHighlight ? (
                        <span className="rounded-full border-2 border-border bg-accent px-2.5 py-1 text-[10px] font-black uppercase text-white sm:text-xs">
                          {project.metricHighlight}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-black uppercase leading-snug sm:text-xl">
                        {work.title}
                      </h3>
                      <p className="mt-1 text-sm font-bold text-fg">{work.detail}</p>
                    </div>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted">{work.description}</p>

                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelected(project)}
                        className={cn(
                          "project-pill inline-flex items-center rounded-full bg-accent-2 px-4 py-2 text-xs font-black uppercase sm:text-sm",
                          styles.pill,
                        )}
                      >
                        {t("dashboards.viewDashboard")}
                      </button>
                      {project.documentUrl ? (
                        <a
                          href={project.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-pill project-pill--pink inline-flex items-center rounded-full bg-accent-3 px-4 py-2 text-xs font-black uppercase tracking-wide text-white sm:px-5 sm:py-2.5 sm:text-sm"
                        >
                          {t("dashboards.openPortfolio")}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </>
  );
}
