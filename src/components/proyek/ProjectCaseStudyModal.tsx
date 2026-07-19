"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import type { ProjectItem } from "@/data/projects";
import { cn } from "@/lib/utils";

interface ProjectCaseStudyModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

type CaseStudyContent = {
  overview: string;
  problem: string;
  solution: string;
  roles: string[];
  features: string[];
  techStack: string[];
  challenges: string;
  result?: string;
  research?: string;
  pipeline?: string[];
  metrics?: {
    rmse?: string;
    mape?: string;
    r2?: string;
  };
  metricsSummary?: string;
  modelName?: string;
  chartSeries?: {
    actual: number[];
    predicted: number[];
  };
  chartCaption?: string;
};

function CaseStudyBlock({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-[3px] border-border p-4 sm:p-5", className)}>
      <h3 className="text-xs font-black uppercase tracking-widest text-fg sm:text-sm">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PipelineSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, index) => (
        <li key={step} className="flex flex-col items-center">
          <span className="w-full rounded-xl border-[3px] border-border bg-card px-4 py-3 text-center text-sm font-bold text-fg sm:text-base">
            {step}
          </span>
          {index < steps.length - 1 ? (
            <ChevronDown
              size={20}
              strokeWidth={3}
              className="my-1 shrink-0 text-accent"
              aria-hidden
            />
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function ForecastChart({
  caption,
  modelName,
  metrics,
  chartSeries,
}: {
  caption: string;
  modelName?: string;
  metrics?: CaseStudyContent["metrics"];
  chartSeries?: CaseStudyContent["chartSeries"];
}) {
  const actual = chartSeries?.actual ?? [];
  const predicted = chartSeries?.predicted ?? [];
  const count = Math.min(actual.length, predicted.length);

  const chartLeft = 48;
  const chartRight = 380;
  const chartTop = 36;
  const chartBottom = 158;

  const allValues = [...actual, ...predicted];
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const valueRange = maxValue - minValue || 1;

  const toPoint = (index: number, value: number) => {
    const x =
      chartLeft +
      (index / Math.max(count - 1, 1)) * (chartRight - chartLeft);
    const y =
      chartBottom -
      ((value - minValue) / valueRange) * (chartBottom - chartTop);
    return { x, y };
  };

  const toPath = (values: number[]) =>
    values
      .slice(0, count)
      .map((value, index) => {
        const point = toPoint(index, value);
        return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
      })
      .join(" ");

  const predictedPoints = predicted.slice(0, count).map((value, index) => {
    const point = toPoint(index, value);
    return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
  });

  const fillPath =
    count > 0
      ? `${toPath(predicted)} L${chartRight} ${chartBottom} L${chartLeft} ${chartBottom} Z`
      : "";

  const yTicks = [minValue, minValue + valueRange * 0.5, maxValue];

  return (
    <figure className="overflow-hidden rounded-2xl border-[3px] border-border bg-surface p-4 sm:p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {modelName ? (
          <span className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase tracking-wide sm:text-xs">
            {modelName}
          </span>
        ) : null}
        {metrics ? (
          <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wide text-muted sm:text-xs">
            {metrics.rmse ? <span>RMSE {metrics.rmse}</span> : null}
            {metrics.mape ? <span>MAPE {metrics.mape}</span> : null}
            {metrics.r2 ? <span>R² {metrics.r2}</span> : null}
          </div>
        ) : null}
      </div>
      <svg
        viewBox="0 0 400 180"
        className="h-auto w-full"
        role="img"
        aria-label={caption}
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-4)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent-4)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map((tick) => {
          const y =
            chartBottom -
            ((tick - minValue) / valueRange) * (chartBottom - chartTop);
          return (
            <g key={tick}>
              <line
                x1={chartLeft}
                y1={y}
                x2={chartRight}
                y2={y}
                stroke="var(--border)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              <text
                x={8}
                y={y + 4}
                fill="var(--muted)"
                fontSize="10"
                fontWeight="700"
              >
                {tick.toFixed(2)}
              </text>
            </g>
          );
        })}
        {fillPath ? <path d={fillPath} fill="url(#chartFill)" /> : null}
        {count > 0 ? (
          <>
            <path
              d={toPath(actual)}
              fill="none"
              stroke="var(--fg)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 6"
            />
            <path
              d={toPath(predicted)}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {predictedPoints.map((point, index) => {
              const [cx, cy] = point.split(",");
              return (
                <circle
                  key={`${point}-${index}`}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="var(--accent)"
                />
              );
            })}
          </>
        ) : null}
        <text x={chartLeft} y={20} fill="var(--muted)" fontSize="11" fontWeight="700">
          PM2.5 (normalized)
        </text>
        <text x={chartRight - 120} y={20} fill="var(--fg)" fontSize="11" fontWeight="700">
          — Actual
        </text>
        <text x={chartRight - 58} y={20} fill="var(--accent)" fontSize="11" fontWeight="700">
          — Predicted
        </text>
      </svg>
      <figcaption className="mt-3 text-center text-xs font-bold uppercase tracking-wide text-muted sm:text-sm">
        {caption}
      </figcaption>
    </figure>
  );
}

function MetricsPanel({
  labels,
  metrics,
}: {
  labels: { rmse: string; mape: string; r2: string };
  metrics?: CaseStudyContent["metrics"];
}) {
  const items = [
    { key: "rmse" as const, label: labels.rmse, value: metrics?.rmse },
    { key: "mape" as const, label: labels.mape, value: metrics?.mape },
    { key: "r2" as const, label: labels.r2, value: metrics?.r2 },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.key}
          className="rounded-2xl border-[3px] border-border bg-accent-4/30 p-4 text-center shadow-[4px_4px_0_var(--shadow)]"
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-muted sm:text-xs">
            {item.label}
          </p>
          <p className="mt-2 font-display text-2xl font-black uppercase text-fg sm:text-3xl">
            {item.value ?? "—"}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ProjectCaseStudyModal({
  project,
  onClose,
}: ProjectCaseStudyModalProps) {
  const t = useTranslations("projects.caseStudy");

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

  const content = project
    ? (t.raw(`items.${project.id}`) as CaseStudyContent)
    : null;
  const title = project
    ? (t.raw(`titles.${project.id}`) as string)
    : "";

  return (
    <AnimatePresence>
      {project && content ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-fg/60 backdrop-blur-[2px]" aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)] sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
              <p
                id="case-study-title"
                className="min-w-0 truncate text-xs font-black uppercase tracking-widest text-fg sm:text-sm"
              >
                {t("title")} · {title}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="pop-btn flex h-10 w-10 shrink-0 items-center justify-center bg-accent-3 text-fg"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="relative aspect-[16/9] w-full bg-surface">
                <Image
                  src={project.image}
                  alt={title}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-fg/50 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5">
                  <p className="font-display text-xl font-black uppercase text-white sm:text-2xl">
                    {title}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <CaseStudyBlock title={t("labels.overview")} className="bg-accent-2">
                  <p className="text-sm leading-relaxed text-fg sm:text-base">
                    {content.overview}
                  </p>
                </CaseStudyBlock>

                <div className="grid gap-4 sm:grid-cols-2">
                  <CaseStudyBlock title={t("labels.problem")} className="bg-accent-3/40">
                    <p className="text-sm leading-relaxed text-fg sm:text-base">
                      {content.problem}
                    </p>
                  </CaseStudyBlock>
                  <CaseStudyBlock title={t("labels.solution")} className="bg-accent-4/25">
                    <p className="text-sm leading-relaxed text-fg sm:text-base">
                      {content.solution}
                    </p>
                  </CaseStudyBlock>
                </div>

                <CaseStudyBlock title={t("labels.role")} className="bg-card">
                  <ul className="flex flex-wrap gap-2">
                    {content.roles.map((role) => (
                      <li
                        key={role}
                        className="rounded-full border-[3px] border-border bg-accent-2 px-3 py-1.5 text-xs font-black uppercase tracking-wide sm:text-sm"
                      >
                        {role}
                      </li>
                    ))}
                  </ul>
                </CaseStudyBlock>

                <CaseStudyBlock title={t("labels.features")} className="bg-card">
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {content.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 rounded-xl border-2 border-border bg-surface px-3 py-2.5 text-sm font-medium text-fg"
                      >
                        <span
                          aria-hidden
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CaseStudyBlock>

                {content.pipeline?.length ? (
                  <CaseStudyBlock title={t("labels.pipeline")} className="bg-accent-2/60">
                    <PipelineSteps steps={content.pipeline} />
                  </CaseStudyBlock>
                ) : null}

                {content.metrics ? (
                  <CaseStudyBlock title={t("labels.modelPerformance")} className="bg-card">
                    {content.metricsSummary ? (
                      <p className="mb-4 text-sm leading-relaxed text-fg sm:text-base">
                        {content.metricsSummary}
                      </p>
                    ) : null}
                    <MetricsPanel
                      labels={{
                        rmse: t("labels.rmse"),
                        mape: t("labels.mape"),
                        r2: t("labels.r2"),
                      }}
                      metrics={content.metrics}
                    />
                    {content.chartCaption ? (
                      <div className="mt-4">
                        <ForecastChart
                          caption={content.chartCaption}
                          modelName={content.modelName}
                          metrics={content.metrics}
                          chartSeries={content.chartSeries}
                        />
                      </div>
                    ) : null}
                  </CaseStudyBlock>
                ) : null}

                <CaseStudyBlock title={t("labels.techStack")} className="bg-accent-4/20">
                  <ul className="flex flex-wrap gap-2">
                    {content.techStack.map((tech) => (
                      <li
                        key={tech}
                        className="rounded-full border-2 border-border bg-card px-3 py-1 text-xs font-black uppercase tracking-wide sm:text-sm"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </CaseStudyBlock>

                <CaseStudyBlock title={t("labels.challenges")} className="bg-card">
                  <p className="text-sm leading-relaxed text-fg sm:text-base">
                    {content.challenges}
                  </p>
                </CaseStudyBlock>

                {content.research ? (
                  <CaseStudyBlock title={t("labels.research")} className="bg-accent text-white">
                    <p className="text-sm leading-relaxed sm:text-base">{content.research}</p>
                  </CaseStudyBlock>
                ) : null}

                {content.result ? (
                  <CaseStudyBlock title={t("labels.result")} className="bg-accent-2">
                    <p className="text-sm leading-relaxed text-fg sm:text-base">
                      {content.result}
                    </p>
                  </CaseStudyBlock>
                ) : null}

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-pill project-pill--sky inline-flex items-center rounded-full bg-accent-2 px-6 py-2.5 text-sm font-black uppercase tracking-wide"
                  >
                    {t("visitSite")}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
