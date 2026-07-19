"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Award, CalendarDays } from "lucide-react";
import {
  certificateCategories,
  certificates,
  type Certificate,
  type CertificateCategory,
} from "@/data/certificates";
import { CertificateDetailModal } from "@/components/certificates/CertificateDetailModal";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { revealViewport } from "@/lib/animations";
import { cn } from "@/lib/utils";

type FilterId = "all" | CertificateCategory;

const filterIds: FilterId[] = ["all", ...certificateCategories];

const certCardReveal = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 15,
    },
  },
};

const certCardStagger = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const cardThemes = [
  "project-card--sky",
  "project-card--pink",
  "project-card--lime",
  "project-card--sky",
] as const;

const pillThemes = [
  "project-pill--sky",
  "project-pill--pink",
  "project-pill--purple",
  "project-pill--sky",
] as const;

const categoryStyle = {
  certification: {
    badge: "bg-accent-4",
    preview: "from-accent-4/25 to-surface",
    dot: "bg-accent-4",
  },
  training: {
    badge: "bg-accent-2",
    preview: "from-accent-2/30 to-surface",
    dot: "bg-accent-2",
  },
  language: {
    badge: "bg-accent text-white",
    preview: "from-accent/20 to-surface",
    dot: "bg-accent",
  },
  achievement: {
    badge: "bg-accent-3",
    preview: "from-accent-3/30 to-surface",
    dot: "bg-accent-3",
  },
} as const;

function CertificatePreview({
  certificate,
  previewLabel,
}: {
  certificate: Certificate;
  previewLabel: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = certificate.previewImage && !imageFailed;
  const style = categoryStyle[certificate.category];

  if (showImage) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={certificate.previewImage!}
          alt={certificate.title}
          fill
          className="object-cover object-top transition-all duration-500 group-hover:scale-[1.05] group-hover:grayscale-0 grayscale"
          sizes="(max-width: 640px) 100vw, 50vw"
          onError={() => setImageFailed(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-fg/30 via-fg/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-40" />
        <span className="absolute left-4 top-4 rounded-full border-[3px] border-border bg-card px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[3px_3px_0_var(--shadow)] sm:text-xs">
          {previewLabel}
        </span>
        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-full border-[3px] border-border bg-card px-3 py-1.5 text-[10px] font-black uppercase shadow-[3px_3px_0_var(--shadow)] sm:text-xs">
          <CalendarDays size={12} aria-hidden />
          {certificate.date}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden bg-gradient-to-br p-6",
        style.preview,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <span className="absolute left-4 top-4 z-10 rounded-full border-[3px] border-border bg-card px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[3px_3px_0_var(--shadow)] sm:text-xs">
        {previewLabel}
      </span>
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-[3px] border-border bg-accent-2 shadow-[4px_4px_0_var(--shadow)] sm:h-[4.5rem] sm:w-[4.5rem]">
        <Award size={30} className="text-fg" />
      </div>
      <span className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border-[3px] border-border bg-card px-3 py-1.5 text-[10px] font-black uppercase shadow-[3px_3px_0_var(--shadow)] sm:text-xs">
        <CalendarDays size={12} aria-hidden />
        {certificate.date}
      </span>
    </div>
  );
}

export function CertificatesGrid() {
  const t = useTranslations("certificates");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(
    null,
  );

  const filteredCertificates = useMemo(() => {
    if (activeFilter === "all") return certificates;
    return certificates.filter((item) => item.category === activeFilter);
  }, [activeFilter]);

  return (
    <section className="overflow-x-hidden px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <CertificateDetailModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="lime"
          showPolkadots
        />

        <div className="mb-10 flex justify-center sm:mb-12">
          <div className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border-[3px] border-border bg-card p-2 shadow-[5px_5px_0_var(--shadow)] sm:gap-2.5 sm:p-2.5">
            {filterIds.map((filterId) => {
              const isActive = activeFilter === filterId;

              return (
                <button
                  key={filterId}
                  type="button"
                  onClick={() => setActiveFilter(filterId)}
                  aria-pressed={isActive}
                  className={cn(
                    "relative overflow-hidden rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide transition-colors sm:px-5 sm:py-2.5 sm:text-sm",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {isActive ? (
                    <motion.span
                      layoutId="cert-filter-pill"
                      className="absolute inset-0 rounded-full bg-accent-4"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    />
                  ) : null}
                  <span className="relative z-10">{t(`filters.${filterId}`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {filteredCertificates.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <motion.div
                variants={certCardStagger}
                initial="hidden"
                whileInView="visible"
                viewport={revealViewport}
                className="grid items-stretch gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
              >
                {filteredCertificates.map((certificate, index) => {
                  const style = categoryStyle[certificate.category];

                  return (
                    <motion.article
                      key={certificate.id}
                      variants={certCardReveal}
                      whileHover={{
                        y: -6,
                        transition: { type: "spring", stiffness: 320, damping: 22 },
                      }}
                      className={cn(
                        "project-card group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl bg-card sm:rounded-3xl",
                        cardThemes[index % cardThemes.length],
                      )}
                      role="button"
                      tabIndex={0}
                      onClick={() => setSelectedCertificate(certificate)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedCertificate(certificate);
                        }
                      }}
                    >
                      <CertificatePreview
                        certificate={certificate}
                        previewLabel={t("preview")}
                      />

                      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                        <div className="min-h-[4.75rem]">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="line-clamp-2 min-w-0 flex-1 font-display text-base font-black uppercase leading-snug transition-colors duration-300 group-hover:text-accent sm:text-lg">
                              {certificate.title}
                            </h3>
                            <span
                              className={cn(
                                "shrink-0 rounded-full border-[3px] border-border px-3 py-1 text-[10px] font-black uppercase tracking-wide shadow-[3px_3px_0_var(--shadow)] sm:text-xs",
                                style.badge,
                              )}
                            >
                              {t(`filters.${certificate.category}`)}
                            </span>
                          </div>

                          <div className="mt-3 h-1 w-10 rounded-full bg-accent-2 transition-all duration-300 group-hover:w-16 group-hover:bg-accent-4" />
                        </div>

                        <div className="mt-4 min-h-[3.75rem]">
                          <p className="line-clamp-1 text-sm font-bold text-fg">
                            {certificate.issuer}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-sm font-medium leading-relaxed text-muted">
                            {certificate.detail}
                          </p>
                        </div>

                        <div className="mt-auto pt-5">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedCertificate(certificate);
                            }}
                            className={cn(
                              "project-pill inline-flex w-fit items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide",
                              pillThemes[index % pillThemes.length],
                            )}
                          >
                            {t("view")}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="brutal-card flex min-h-[240px] flex-col items-center justify-center rounded-3xl p-10 text-center"
            >
              <p className="text-lg font-black uppercase sm:text-xl">
                {t("emptyFilterTitle")}
              </p>
              <p className="mt-3 max-w-sm text-sm text-muted sm:text-base">
                {t("emptyFilterDescription")}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
