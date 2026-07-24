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
import { certificateThemeStyles } from "@/lib/certificate-themes";
import { mediaRevealOverlayClass, mediaRevealZoomLgClass } from "@/lib/media-reveal";
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

function CertificatePreview({
  certificate,
  badgeClass,
  stickerClass,
  previewGradient,
}: {
  certificate: Certificate;
  badgeClass: string;
  stickerClass: string;
  previewGradient: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = certificate.previewImage && !imageFailed;

  if (showImage) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden border-b-[3px] border-border bg-surface">
        <Image
          src={certificate.previewImage!}
          alt={certificate.title}
          fill
          className={cn("object-cover object-top", mediaRevealZoomLgClass)}
          sizes="(max-width: 640px) 100vw, 50vw"
          onError={() => setImageFailed(true)}
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-fg/30 via-fg/5 to-transparent opacity-70",
            mediaRevealOverlayClass,
          )}
        />
        <span
          className={cn(
            "absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs",
            badgeClass,
          )}
        >
          <CalendarDays size={12} aria-hidden />
          {certificate.date}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] flex-col items-center justify-center overflow-hidden border-b-[3px] border-border bg-gradient-to-br p-6",
        previewGradient,
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
      <div
        className={cn(
          "relative z-10 flex h-16 w-16 items-center justify-center border-[3px] border-border shadow-[4px_4px_0_var(--shadow)] sm:h-[4.5rem] sm:w-[4.5rem]",
          stickerClass,
        )}
      >
        <Award size={30} className="text-fg" />
      </div>
      <span
        className={cn(
          "absolute bottom-4 right-4 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-xs",
          badgeClass,
        )}
      >
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
    <section className="page-section overflow-x-clip py-20 sm:py-24">
      <CertificateDetailModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <div className="page-container max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="lime"
          showPolkadots
        />

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2 sm:mb-12">
          {filterIds.map((filterId) => {
            const isActive = activeFilter === filterId;

            return (
              <button
                key={filterId}
                type="button"
                onClick={() => setActiveFilter(filterId)}
                aria-pressed={isActive}
                className={cn(
                  "brutal-chip px-3 py-1.5 text-[10px] sm:text-xs",
                  isActive
                    ? filterId === "all"
                      ? "brutal-chip--active"
                      : certificateThemeStyles[filterId].filterActive
                    : "",
                )}
              >
                {t(`filters.${filterId}`)}
              </button>
            );
          })}
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
                className="card-shadow-grid grid items-stretch gap-6 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3 lg:gap-8"
              >
                {filteredCertificates.map((certificate) => {
                  const styles = certificateThemeStyles[certificate.category];

                  return (
                    <motion.article
                      key={certificate.id}
                      variants={certCardReveal}
                      whileHover={{
                        y: -6,
                        transition: { type: "spring", stiffness: 320, damping: 22 },
                      }}
                      className={cn(
                        "project-card project-category-card group relative flex h-full cursor-pointer flex-col overflow-hidden bg-card",
                        styles.card,
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
                      <div
                        className={cn(
                          "h-1.5 border-b-[3px] border-border",
                          styles.stripe,
                        )}
                        aria-hidden
                      />

                      <CertificatePreview
                        certificate={certificate}
                        badgeClass={styles.badge}
                        stickerClass={styles.sticker}
                        previewGradient={styles.preview}
                      />

                      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                        <div className="min-h-[4.75rem]">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h3 className="line-clamp-2 min-w-0 flex-1 font-display text-base font-black uppercase leading-snug sm:text-lg">
                              {certificate.title}
                            </h3>
                            <span
                              className={cn(
                                "shrink-0 px-3 py-1 text-[10px] sm:text-xs",
                                styles.badge,
                              )}
                            >
                              {t(`filters.${certificate.category}`)}
                            </span>
                          </div>

                          <div
                            className={cn(
                              "mt-3 h-[3px] w-10 transition-all duration-300 group-hover:w-16",
                              styles.stripe,
                            )}
                          />
                        </div>

                        <div className="mt-4 min-h-[3.75rem]">
                          <p className="line-clamp-1 text-sm font-bold text-fg">
                            {certificate.issuer}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm font-medium leading-relaxed text-muted">
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
                              "project-pill pop-btn w-fit px-5 py-2.5 text-sm",
                              styles.pill,
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
              className="brutal-card flex min-h-[240px] flex-col items-center justify-center p-10 text-center"
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
