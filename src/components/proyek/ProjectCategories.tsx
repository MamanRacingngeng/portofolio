"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { projectCategories, type ProjectCategoryId } from "@/data/portfolio";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";
import { revealViewport } from "@/lib/animations";

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

const cardAccents = [
  {
    card: "project-card--sky",
    bar: "bg-accent-4",
    btn: "pop-btn-secondary",
  },
  {
    card: "project-card--pink",
    bar: "bg-accent-3",
    btn: "bg-accent-3",
  },
  {
    card: "project-card--lime",
    bar: "bg-accent-2",
    btn: "pop-btn-primary",
  },
] as const;

export function ProjectCategories({
  title,
  subtitle,
  exploreLabel,
  categories,
}: ProjectCategoriesProps) {
  return (
    <section className="page-section py-16 sm:py-20 lg:py-24">
      <div className="page-container max-w-6xl">
        <SectionTitle title={title} subtitle={subtitle} accent="pink" />

        <div className="card-shadow-grid grid items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-9">
          {projectCategories.map((category, index) => {
            const copy = categories[category.id];
            const accent = cardAccents[index % cardAccents.length];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={revealViewport}
                transition={{
                  delay: index * 0.08,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full"
              >
                <Link
                  href={`/proyek/${category.slug}`}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                >
                  <article
                    className={cn(
                      "project-card project-category-card flex h-full flex-col bg-card",
                      accent.card,
                    )}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-full border-b-[3px] border-border sm:h-2",
                        accent.bar,
                      )}
                    />

                    <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-border bg-surface">
                      <Image
                        src={category.image}
                        alt=""
                        fill
                        quality={100}
                        unoptimized
                        className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.03] group-hover:grayscale-0"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    </div>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <h3 className="font-display text-lg font-black uppercase leading-snug text-fg transition-colors duration-300 group-hover:text-accent sm:text-xl">
                        {copy.title}
                      </h3>

                      <div
                        className={cn(
                          "mt-3 h-[3px] w-10 transition-all duration-300 group-hover:w-16",
                          accent.bar,
                        )}
                      />

                      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                        {copy.description}
                      </p>

                      <span
                        className={cn(
                          "pop-btn mt-6 inline-flex w-fit px-5 py-2.5 text-xs font-black uppercase tracking-wide sm:text-sm",
                          accent.btn,
                        )}
                      >
                        {exploreLabel}
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
