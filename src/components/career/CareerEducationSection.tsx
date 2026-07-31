"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { educationIds, educationLogos } from "@/data/career";
import { scrollRevealStaggerContainer, scrollRevealStaggerItem } from "@/lib/animations";

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
            className="border-[3px] border-border bg-card p-5 shadow-[5px_5px_0_#111] sm:p-7"
          >
            <span className="inline-block border-[3px] border-border bg-accent-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[4px_4px_0_#38bdf8] sm:px-4 sm:py-2 sm:text-xs">
              {item.period}
            </span>

            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
              {logoSrc ? (
                <div className="flex shrink-0 items-center justify-center self-start border-[3px] border-border bg-[#111] p-3 sm:p-4">
                  <Image
                    src={logoSrc}
                    alt={item.institution}
                    width={200}
                    height={96}
                    className="h-auto w-36 object-contain sm:w-40"
                  />
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <h3 className="font-display text-xl font-black uppercase leading-tight sm:text-2xl">
                  {item.institution}
                </h3>
                <p className="mt-2 text-sm font-bold text-fg sm:text-base">
                  {item.degree}
                </p>
                <p className="mt-1 text-sm font-medium text-muted sm:text-base">
                  {item.gpa}
                </p>
              </div>
            </div>

            <hr className="my-6 border-t-[3px] border-border" />

            <p className="text-xs font-black uppercase tracking-wide text-muted sm:text-sm">
              {item.thesisLabel}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-fg sm:text-base sm:leading-[1.75]">
              {item.thesis}
            </p>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
