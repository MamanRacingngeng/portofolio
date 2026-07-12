"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projectMeta } from "@/data/portfolio";
import { SectionTitle } from "@/components/ui/SectionTitle";

type ProjectItem = {
  title: string;
  description: string;
};

export function ProjectGrid() {
  const t = useTranslations("projects");
  const items = t.raw("items") as ProjectItem[];

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="pink"
          showPolkadots
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, index) => {
            const meta = projectMeta[index];
            return (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: index * 0.12,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <article className="brutal-card group flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                      <span className="absolute inset-0 flex items-center justify-center font-display text-6xl font-black text-border/10">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6 sm:p-7">
                      <h3 className="text-lg font-black uppercase leading-snug sm:text-xl">
                        {project.title}
                      </h3>
                      <p className="mt-4 flex-1 text-justify text-sm leading-relaxed text-muted sm:text-base">
                        {project.description}
                      </p>

                      {meta && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {meta.tags.map((tag) => (
                            <span
                              key={tag}
                              className="sticker bg-surface px-3 py-1 text-xs font-bold uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {meta && (
                        <a
                          href={meta.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-6 inline-flex items-center gap-2 text-sm font-black uppercase"
                        >
                          {t("openProject")}
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                  </article>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
