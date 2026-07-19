"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { projectCategories, type ProjectCategoryId } from "@/data/portfolio";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";

type CategoryCopy = {
  title: string;
  description: string;
};

interface ProjectCategoriesProps {
  title: string;
  subtitle: string;
  exploreLabel: string;
  categories: Record<ProjectCategoryId, CategoryCopy>;
}

const cardThemes = ["project-card--sky", "project-card--pink", "project-card--lime"] as const;
const pillThemes = ["project-pill--sky", "project-pill--pink", "project-pill--purple"] as const;

export function ProjectCategories({
  title,
  subtitle,
  exploreLabel,
  categories,
}: ProjectCategoriesProps) {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title={title}
          subtitle={subtitle}
          accent="pink"
          showPolkadots
        />

        <div className="grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projectCategories.map((category, index) => {
            const copy = categories[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              >
                <article
                  className={cn(
                    "project-card group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card",
                    cardThemes[index % cardThemes.length],
                  )}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      quality={100}
                      unoptimized
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fg/25 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-30" />
                  </div>

                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-lg font-black uppercase leading-snug transition-colors duration-300 group-hover:text-accent sm:text-xl">
                      {copy.title}
                    </h3>
                    <div className="mt-2 h-1 w-8 rounded-full bg-accent-2 transition-all duration-300 group-hover:w-16 group-hover:bg-accent-4" />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:text-base">
                      {copy.description}
                    </p>

                    <Link
                      href={`/proyek/${category.slug}`}
                      className={cn(
                        "project-pill border-0 mt-6 inline-flex w-fit items-center rounded-full bg-accent-2 px-6 py-2.5 text-sm font-black uppercase tracking-wide",
                        pillThemes[index % pillThemes.length],
                      )}
                    >
                      {exploreLabel}
                    </Link>
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
