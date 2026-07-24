"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { ProjectItem } from "@/data/projects";
import { ProjectCaseStudyModal } from "@/components/proyek/ProjectCaseStudyModal";
import { getProjectTagLabel } from "@/lib/project-tags";
import {
  mediaRevealOverlayClass,
  mediaRevealZoomClass,
} from "@/lib/media-reveal";
import { cn } from "@/lib/utils";
import { revealViewport } from "@/lib/animations";

const cardThemes = [
  {
    card: "project-card--sky",
    bar: "bg-accent-4",
    tag: "brutal-tag brutal-tag--sky",
    btn: "pop-btn-secondary",
  },
  {
    card: "project-card--pink",
    bar: "bg-accent-3",
    tag: "brutal-tag brutal-tag--pink",
    btn: "bg-accent-3",
  },
  {
    card: "project-card--lime",
    bar: "bg-accent-2",
    tag: "brutal-tag brutal-tag--lime",
    btn: "pop-btn-primary",
  },
] as const;

type ProjectCopy = {
  title: string;
  description: string;
  detail: string;
};

interface ProjectCategoryListProps {
  items: ProjectItem[];
}

export function ProjectCategoryList({ items }: ProjectCategoryListProps) {
  const t = useTranslations("projects");
  const tagLabels = t.raw("tagLabels") as Record<string, string>;
  const copy = t.raw("items") as Record<string, ProjectCopy>;
  const [caseStudyProject, setCaseStudyProject] = useState<ProjectItem | null>(null);

  return (
    <>
      <ProjectCaseStudyModal
        project={caseStudyProject}
        onClose={() => setCaseStudyProject(null)}
      />

      <div className="card-shadow-grid grid items-stretch gap-6 sm:gap-7 lg:grid-cols-2">
        {items.map((project, index) => {
          const projectCopy = copy[project.id];
          const theme = cardThemes[index % cardThemes.length];

          return (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{
                delay: index * 0.08,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "group project-card project-category-card flex h-full flex-col overflow-hidden bg-card",
                theme.card,
              )}
            >
              <div className={cn("h-1.5 border-b-[3px] border-border sm:h-2", theme.bar)} />

              <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-border bg-surface">
                <Image
                  src={project.image}
                  alt={projectCopy.title}
                  fill
                  className={cn("object-cover object-top", mediaRevealZoomClass)}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-t from-fg/30 via-fg/5 to-transparent opacity-70",
                    mediaRevealOverlayClass,
                  )}
                />
              </div>

              <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                <div className="min-h-[4.75rem]">
                  <h3 className="line-clamp-2 font-display text-base font-black uppercase leading-snug transition-colors duration-300 group-active:text-accent group-focus-within:text-accent [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-accent sm:text-lg">
                    {projectCopy.title}
                  </h3>
                  <div
                    className={cn(
                      "mt-3 h-[3px] w-10 transition-all duration-300 group-active:w-16 group-focus-within:w-16 [@media(hover:hover)_and_(pointer:fine)]:group-hover:w-16",
                      theme.bar,
                    )}
                  />
                </div>

                <div className="mt-4 min-h-[3.75rem]">
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed text-muted sm:text-base">
                    {projectCopy.description}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm font-bold text-fg">
                    {projectCopy.detail}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "brutal-tag px-3 py-1 text-[10px] sm:text-xs",
                        theme.tag,
                      )}
                    >
                      {getProjectTagLabel(tag, tagLabels)}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-3 pt-5">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "project-pill pop-btn px-5 py-2.5 text-sm",
                        theme.btn,
                      )}
                    >
                      {t("visitSite")}
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setCaseStudyProject(project)}
                    className={cn(
                      "project-pill pop-btn cursor-pointer px-5 py-2.5 text-sm",
                      theme.btn,
                    )}
                  >
                    {t("caseStudyBtn")}
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </div>
    </>
  );
}
