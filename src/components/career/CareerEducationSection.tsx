"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { educationIds, educationLogos } from "@/data/career";
import {
  scrollRevealStaggerContainer,
  scrollRevealStaggerItem,
} from "@/lib/animations";

type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  thesisLabel: string;
  thesis: string;
};

export function CareerEducationSection() {
  const t = useTranslations("career");
  const education = t.raw("education") as Record<string, EducationItem>;

  return (
    <motion.div
      variants={scrollRevealStaggerContainer}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-6"
    >
      {educationIds.map((id) => {
        const item = education[id];
        if (!item) return null;
        const logoSrc = educationLogos[id];

        return (
          <motion.article
            key={id}
            variants={scrollRevealStaggerItem}
            className="project-card project-card--sky overflow-hidden bg-card"
          >
            <div className="h-1.5 border-b-[3px] border-border bg-accent-4/35" />

            <div className="border-b-[3px] border-border bg-card px-5 py-6 sm:px-8 sm:py-8">
              <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
                {logoSrc ? (
                  <div className="flex shrink-0 items-center justify-center">
                    <Image
                      src={logoSrc}
                      alt={item.institution}
                      width={240}
                      height={128}
                      className="h-auto w-36 object-contain sm:w-44"
                    />
                  </div>
                ) : null}

                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h3 className="font-display text-xl font-black uppercase leading-tight sm:text-2xl lg:text-[1.75rem]">
                    {item.institution}
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-snug text-fg sm:text-base">
                    {item.degree}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center border-2 border-border bg-accent-4/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-fg sm:text-xs">
                      {item.period}
                    </span>
                    <span className="brutal-chip px-3 py-1.5 text-[10px] sm:text-xs">
                      {item.gpa}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-7">
              <div className="border-[3px] border-border bg-surface p-5 shadow-[4px_4px_0_#111] sm:p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-muted sm:text-xs">
                  {item.thesisLabel}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg sm:text-base sm:leading-[1.75]">
                  {item.thesis}
                </p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
