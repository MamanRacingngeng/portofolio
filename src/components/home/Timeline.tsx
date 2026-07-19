"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { WavyPolkaDivider } from "@/components/ui/WavyPolkaDivider";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import {
  revealViewport,
  scrollRevealStaggerContainer,
  scrollRevealStaggerItem,
} from "@/lib/animations";

type TimelineEntry = {
  title: string;
  subtitle?: string;
  hasDetail?: boolean;
  detailId?: string;
};

type TimelineYear = {
  year: string;
  entries: TimelineEntry[];
};

type TimelineDetail = {
  period: string;
  role: string;
  organization: string;
  project: string;
  description: string;
};

export function Timeline() {
  const t = useTranslations("timeline");
  const years = t.raw("years") as TimelineYear[];
  const details = t.raw("details") as Record<string, TimelineDetail>;
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.2"],
  });

  const lineFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const markerTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const flatEntries = years.flatMap((yearGroup) =>
    yearGroup.entries.map((entry) => ({
      ...entry,
      year: yearGroup.year,
    }))
  );

  return (
    <section
      className={cn(
        "px-4 sm:px-6 lg:px-8",
        siteConfig.showWavyPolkaDivider
          ? "pt-0 pb-0"
          : "pt-10 pb-16 sm:pt-12 sm:pb-20",
      )}
    >
      <div className="mx-auto max-w-4xl">
        <SectionTitle title={t("title")} accent="lime" align="center" showPolkadots />

        <div ref={containerRef} className="relative">
          <div className="absolute bottom-0 left-[5px] top-0 w-[3px] sm:left-[7px]">
            <div className="absolute inset-0 bg-border/20" />
            <motion.div
              style={{ height: lineFill }}
              className="absolute left-0 top-0 w-full bg-border"
            />
            <motion.div
              style={{ top: markerTop }}
              className="absolute left-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 border-[3px] border-border bg-accent-3 sm:h-6 sm:w-6"
            />
          </div>

          <motion.div
            variants={scrollRevealStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="space-y-8 sm:space-y-9"
          >
            {flatEntries.map((entry, index) => {
              const detail = entry.detailId ? details[entry.detailId] : null;
              const period = detail?.period ?? entry.year;
              const role = detail?.role ?? entry.title;
              const organization = detail?.organization;
              const project = detail?.project;
              const description =
                detail?.description ??
                (!detail && entry.subtitle ? entry.subtitle : undefined);
              const isShort = !detail;

              return (
                <motion.article
                  key={`${entry.title}-${index}`}
                  variants={scrollRevealStaggerItem}
                  className="relative pl-8 text-left sm:pl-10"
                >
                  <motion.div
                    className="w-full border-[3px] border-border bg-card p-5 text-left shadow-[5px_5px_0_#111] sm:p-7"
                    initial={{ boxShadow: "0px 0px 0 #111" }}
                    whileInView={{ boxShadow: "5px 5px 0 #111" }}
                    viewport={revealViewport}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    whileHover={{
                      backgroundColor: "rgba(212, 240, 106, 0.12)",
                      boxShadow: "7px 7px 0 #f9a8b8",
                      transition: { duration: 0.25 },
                    }}
                  >
                    <span
                      className="inline-block border-[3px] border-border bg-accent-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[4px_4px_0_#38bdf8] sm:px-4 sm:py-2 sm:text-xs"
                    >
                      {period}
                    </span>

                    <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight sm:mt-4 sm:text-2xl lg:text-3xl">
                      {role}
                    </h3>

                    {(organization || project) && (
                      <div className="mt-3 space-y-0.5 sm:mt-4">
                        {organization && (
                          <p className="text-sm font-bold text-fg sm:text-base">
                            {organization}
                          </p>
                        )}
                        {project && (
                          <p className="text-sm font-medium text-muted sm:text-base">
                            {project}
                          </p>
                        )}
                      </div>
                    )}

                    {description && (
                      <>
                        <hr className="my-5 border-t-[3px] border-border" />
                        <p
                          className={cn(
                            "text-justify text-sm leading-relaxed sm:text-base",
                            isShort
                              ? "font-medium text-muted"
                              : "text-fg leading-[1.75] sm:text-lg"
                          )}
                        >
                          {description}
                        </p>
                      </>
                    )}
                  </motion.div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </div>
      {siteConfig.showWavyPolkaDivider ? <WavyPolkaDivider seed={4} /> : null}
    </section>
  );
}
