"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Factory, Sparkles, X } from "lucide-react";
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
    panel: string;
    heroTag: string;
    metaPanel: string;
  }
> = {
  lstm: {
    card: "project-card--sky",
    pill: "pop-btn-secondary",
    stripe: "bg-accent-4",
    badge: "brutal-tag brutal-tag--sky",
    sticker: "bg-accent-4",
    panel: "bg-accent-4",
    heroTag: "brutal-tag brutal-tag--sky",
    metaPanel: "bg-accent-4/25",
  },
  rf: {
    card: "project-card--lime",
    pill: "pop-btn-primary",
    stripe: "bg-accent-2",
    badge: "brutal-tag brutal-tag--lime",
    sticker: "bg-accent-2",
    panel: "bg-accent-2",
    heroTag: "brutal-tag brutal-tag--lime",
    metaPanel: "bg-accent-2/40",
  },
  clustering: {
    card: "project-card--pink",
    pill: "bg-accent-3",
    stripe: "bg-accent-3",
    badge: "brutal-tag brutal-tag--pink",
    sticker: "bg-accent-3",
    panel: "bg-accent-3",
    heroTag: "brutal-tag brutal-tag--pink",
    metaPanel: "bg-accent-3/30",
  },
};

const heroTagVariants = [
  "brutal-tag brutal-tag--sky",
  "brutal-tag brutal-tag--lime",
  "brutal-tag brutal-tag--pink",
] as const;

const heroMetaVariants = [
  "bg-accent-4/25",
  "bg-accent-2/40",
  "bg-accent-3/30",
  "bg-accent-4/25",
] as const;

function PipelineSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step} className="flex flex-col items-center">
          <span className="brutal-tag w-full px-3 py-2 text-center text-xs font-bold sm:text-sm">
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

function PosterFrame({
  src,
  alt,
  onClick,
  priority = false,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
  priority?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/poster relative block w-full overflow-hidden border-[3px] border-border bg-card p-3 shadow-[6px_6px_0_var(--shadow)] transition-transform duration-500 hover:-translate-y-1 sm:p-4",
        onClick ? "cursor-pointer text-left" : "cursor-default",
      )}
    >
      <div className="relative mx-auto aspect-[1190/1684] max-h-[min(72vh,920px)] w-full overflow-hidden border-[3px] border-border bg-white">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={100}
          unoptimized
          className="object-contain object-center grayscale transition-all duration-500 group-active/poster:scale-[1.02] group-active/poster:grayscale-0 group-focus-within/poster:grayscale-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/poster:scale-[1.02] [@media(hover:hover)_and_(pointer:fine)]:group-hover/poster:grayscale-0"
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
          className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)]"
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
              <div className="space-y-4 border-b-[3px] border-border bg-card p-4 sm:p-5 lg:border-b-0 lg:border-r-[3px]">
                <PosterFrame src={project.image} alt={work.title} />
                {visuals.length > 1 ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {visuals.slice(1).map((src, index) => (
                      <div key={src} className="space-y-2">
                        <PosterFrame src={src} alt={`${work.title} ${index + 2}`} />
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
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {caseStudy.metrics.r2 ? (
                      <div className="brutal-metric p-3">
                        <p className="text-[10px] font-black uppercase text-muted">R²</p>
                        <p className="mt-1 font-display text-lg font-black sm:text-xl">
                          {caseStudy.metrics.r2}
                        </p>
                      </div>
                    ) : null}
                    {caseStudy.metrics.mae ? (
                      <div className="brutal-metric p-3">
                        <p className="text-[10px] font-black uppercase text-muted">MAE</p>
                        <p className="mt-1 font-display text-lg font-black sm:text-xl">
                          {caseStudy.metrics.mae}
                        </p>
                      </div>
                    ) : null}
                    {caseStudy.metrics.mse ? (
                      <div className="brutal-metric p-3">
                        <p className="text-[10px] font-black uppercase text-muted">MSE</p>
                        <p className="mt-1 font-display text-lg font-black sm:text-xl">
                          {caseStudy.metrics.mse}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {caseStudy ? (
                  <>
                    <div className={cn("border-[3px] border-border p-4", styles.panel)}>
                      <h3 className="text-xs font-black uppercase tracking-widest sm:text-sm">
                        {tCase("labels.overview")}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed">{caseStudy.overview}</p>
                      {caseStudy.metricsSummary ? (
                        <p className="mt-2 text-xs font-bold sm:text-sm">
                          {caseStudy.metricsSummary}
                        </p>
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

                    <div className="flex flex-wrap gap-2">
                      {caseStudy.tools.map((tool) => (
                        <span
                          key={tool}
                          className={cn("brutal-tag px-3 py-1 text-xs", styles.badge)}
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
                    className="project-pill pop-btn bg-accent-3 px-5 py-2.5 text-sm"
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
  const featuredTheme = featured?.dashboardTheme ?? "lstm";
  const featuredStyles = themeStyles[featuredTheme];

  return (
    <>
      <DashboardModal project={selected} onClose={() => setSelected(null)} />

      <div className="space-y-8 sm:space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="brutal-card border-[3px] border-border bg-card p-6 shadow-[8px_8px_0_var(--shadow)] sm:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-6 sm:gap-7 lg:gap-8">
            <div className="flex flex-col gap-4 sm:gap-5">
              <span className="brutal-tag inline-flex w-fit items-center gap-2 px-3 py-1.5 text-[10px] sm:text-xs">
                <Factory size={14} strokeWidth={3} />
                {t("dashboards.caseStudyBadge")}
              </span>
              <h3 className="font-display text-2xl font-black uppercase leading-[1.1] sm:text-3xl lg:text-4xl">
                {t("dashboards.heroTitle")}
              </h3>
              <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base lg:text-lg">
                {t("dashboards.heroDescription")}
              </p>
            </div>

            <dl className="grid gap-3 sm:grid-cols-2 sm:gap-4">
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
                    "border-[3px] border-border p-4 sm:p-5",
                    heroMetaVariants[index],
                  )}
                >
                  <dt className="text-[10px] font-black uppercase tracking-widest text-muted sm:text-xs">
                    {t(`dashboards.${labelKey}`)}
                  </dt>
                  <dd className="mt-2 text-sm font-bold leading-snug sm:text-base">
                    {t(`dashboards.${valueKey}`)}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-3">
              {(t.raw("dashboards.heroTags") as string[]).map((tag, index) => (
                <span
                  key={tag}
                  className={cn(
                    "brutal-tag px-3 py-1.5 text-[10px] sm:text-xs",
                    heroTagVariants[index % heroTagVariants.length],
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
              "project-card project-category-card group relative overflow-hidden bg-card",
              featuredStyles.card,
            )}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-2 border-b-[3px] border-border",
                featuredStyles.stripe,
              )}
              aria-hidden
            />

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:items-center lg:gap-12 lg:p-12 xl:gap-14">
              <div className="flex flex-col justify-center gap-8 sm:gap-9 lg:col-span-5 lg:gap-10 lg:py-4 xl:gap-12">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  <span
                    className={cn(
                      "brutal-tag inline-flex items-center gap-1.5 px-3 py-1 text-[10px] sm:text-xs",
                      featuredStyles.badge,
                    )}
                  >
                    <Sparkles size={12} strokeWidth={3} />
                    {t("dashboards.featured")}
                  </span>
                  {featured.metricHighlight ? (
                    <span
                      className={cn(
                        "brutal-tag px-3 py-1 text-[10px] sm:text-xs",
                        featuredStyles.badge,
                      )}
                    >
                      {featured.metricHighlight}
                    </span>
                  ) : null}
                </div>

                <div>
                  <h3 className="font-display text-2xl font-black uppercase leading-tight sm:text-3xl lg:text-4xl">
                    {copy[featured.id].title}
                  </h3>
                  <p className="mt-4 text-sm font-bold text-fg sm:mt-5 sm:text-base">
                    {copy[featured.id].detail}
                  </p>
                </div>

                <p className="text-sm leading-relaxed text-muted sm:text-base lg:max-w-prose lg:text-[1.05rem] lg:leading-8">
                  {copy[featured.id].description}
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {featured.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "brutal-tag px-3 py-1 text-[10px] sm:text-xs",
                        featuredStyles.badge,
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 pt-2 sm:gap-5 sm:pt-4 lg:pt-6">
                  <button
                    type="button"
                    onClick={() => setSelected(featured)}
                    className={cn(
                      "project-pill pop-btn px-5 py-2.5 text-sm",
                      featuredStyles.pill,
                    )}
                  >
                    {t("dashboards.viewDashboard")}
                  </button>
                </div>
              </div>

              <div className="relative lg:col-span-7 lg:self-center">
                <PosterFrame
                  src={featured.image}
                  alt={copy[featured.id].title}
                  onClick={() => setSelected(featured)}
                  priority
                />
              </div>
            </div>
          </motion.article>
        ) : null}

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
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
                className={cn(
                  "project-card project-category-card group overflow-hidden bg-card",
                  styles.card,
                )}
              >
                <div
                  className={cn("h-1.5 border-b-[3px] border-border", styles.stripe)}
                  aria-hidden
                />

                <div className="space-y-4 p-4 sm:p-5">
                  <PosterFrame
                    src={project.image}
                    alt={work.title}
                    onClick={() => setSelected(project)}
                  />

                  <div className="space-y-4 px-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "brutal-tag px-2.5 py-1 text-[10px] sm:text-xs",
                          styles.badge,
                        )}
                      >
                        {t(`dashboards.themes.${theme}`)}
                      </span>
                      {project.metricHighlight ? (
                        <span
                          className={cn(
                            "brutal-tag px-2.5 py-1 text-[10px] sm:text-xs",
                            styles.badge,
                          )}
                        >
                          {project.metricHighlight}
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <h3 className="font-display text-lg font-black uppercase leading-snug sm:text-xl">
                        {work.title}
                      </h3>
                      <p className="mt-2 text-sm font-bold text-fg">{work.detail}</p>
                    </div>

                    <p className="line-clamp-3 text-sm leading-relaxed text-muted">
                      {work.description}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelected(project)}
                      className={cn(
                        "project-pill pop-btn px-4 py-2 text-xs sm:px-5 sm:py-2.5 sm:text-sm",
                        styles.pill,
                      )}
                    >
                      {t("dashboards.viewDashboard")}
                    </button>
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
