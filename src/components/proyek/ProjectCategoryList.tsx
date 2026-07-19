"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { ProjectItem } from "@/data/projects";
import { ProjectCaseStudyModal } from "@/components/proyek/ProjectCaseStudyModal";
import { getProjectTagLabel } from "@/lib/project-tags";
import { cn } from "@/lib/utils";

const cardThemes = ["project-card--sky", "project-card--pink", "project-card--lime"] as const;
const pillThemes = ["project-pill--sky", "project-pill--pink", "project-pill--purple"] as const;

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

      <div className="grid items-stretch gap-6 sm:gap-7 lg:grid-cols-2">
      {items.map((project, index) => {
        const projectCopy = copy[project.id];

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
              "project-card group flex h-full flex-col overflow-hidden rounded-3xl bg-card",
              cardThemes[index % cardThemes.length],
            )}
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={project.image}
                alt={projectCopy.title}
                fill
                className="object-cover object-top grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fg/30 via-fg/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-40" />
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
              <div className="min-h-[4.75rem]">
                <h3 className="line-clamp-2 font-display text-base font-black uppercase leading-snug transition-colors duration-300 group-hover:text-accent sm:text-lg">
                  {projectCopy.title}
                </h3>
                <div className="mt-3 h-1 w-10 rounded-full bg-accent-2 transition-all duration-300 group-hover:w-16 group-hover:bg-accent-4" />
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
                    className="rounded-full border-2 border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase tracking-wide sm:text-xs"
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
                      "project-pill inline-flex w-fit items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                      pillThemes[index % pillThemes.length],
                    )}
                  >
                    {t("visitSite")}
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => setCaseStudyProject(project)}
                  className={cn(
                    "project-pill inline-flex w-fit cursor-pointer items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                    pillThemes[(index + 1) % pillThemes.length],
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
