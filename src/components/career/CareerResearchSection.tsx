"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { researchIds, researchJournalLinks } from "@/data/career";
import { scrollRevealStaggerContainer, scrollRevealStaggerItem } from "@/lib/animations";

type ResearchItem = {
  title: string;
  role: string;
  status: string;
  submittedTo: string;
  description: string;
};

export function CareerResearchSection() {
  const t = useTranslations("career");
  const research = t.raw("research") as Record<string, ResearchItem>;

  return (
    <motion.div
      variants={scrollRevealStaggerContainer}
      initial={false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="space-y-6"
    >
      {researchIds.map((id) => {
        const item = research[id];
        if (!item) return null;
        const journalUrl = researchJournalLinks[id];

        return (
          <motion.article
            key={id}
            variants={scrollRevealStaggerItem}
            className="border-[3px] border-border bg-card p-5 shadow-[5px_5px_0_#111] sm:p-7"
          >
            <span className="inline-block border-[3px] border-border bg-accent-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[4px_4px_0_#111] sm:px-4 sm:py-2 sm:text-xs">
              {item.status}
            </span>

            <h3 className="mt-4 font-display text-lg font-black uppercase leading-tight sm:mt-5 sm:text-xl lg:text-2xl">
              {item.title}
            </h3>

            <div className="mt-4 space-y-1 sm:mt-5">
              <p className="text-sm font-bold text-fg sm:text-base">{item.role}</p>
              <p className="text-sm font-medium text-muted sm:text-base">
                {item.submittedTo}
              </p>
            </div>

            <hr className="my-6 border-t-[3px] border-border" />

            <p className="text-justify text-sm leading-relaxed text-fg sm:text-base sm:leading-[1.75]">
              {item.description}
            </p>

            {journalUrl ? (
              <a
                href={journalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-pill pop-btn pop-btn-primary mt-6 inline-flex w-fit px-5 py-2.5 text-sm"
              >
                {t("viewJournal")}
              </a>
            ) : null}
          </motion.article>
        );
      })}
    </motion.div>
  );
}
