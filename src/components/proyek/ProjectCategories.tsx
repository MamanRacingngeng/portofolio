"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { projectCategories, type ProjectCategoryId } from "@/data/portfolio";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";

type CategoryCopy = {
  title: string;
  description: string;
};

const cardAccents = [
  "group-hover:shadow-[10px_12px_0_var(--accent-4)]",
  "group-hover:shadow-[10px_12px_0_var(--accent-3)]",
  "group-hover:shadow-[10px_12px_0_var(--accent-2)]",
];

const pillAccents = [
  "group-hover:bg-accent-4",
  "group-hover:bg-accent-3",
  "group-hover:bg-accent group-hover:text-white",
];

export function ProjectCategories() {
  const t = useTranslations("projects");
  const categories = t.raw("categories") as Record<ProjectCategoryId, CategoryCopy>;

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
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
                  className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border-[3px] border-border bg-card shadow-[6px_6px_0_var(--shadow)] transition-all duration-300 hover:-translate-y-1.5 ${cardAccents[index % cardAccents.length]}`}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                    <Image
                      src={category.image}
                      alt=""
                      fill
                      className="object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fg/25 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-30" />

                    <span className="absolute left-4 top-4 rounded-full border-2 border-border/80 bg-card/90 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-sm sm:text-xs">
                      0{index + 1}
                    </span>
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
                      className={`project-pill mt-6 inline-flex w-fit items-center rounded-full border-2 border-border bg-accent-2 px-6 py-2.5 text-sm font-black uppercase tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--border)] active:translate-y-0 active:shadow-none ${pillAccents[index % pillAccents.length]}`}
                    >
                      {t("explore")}
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
