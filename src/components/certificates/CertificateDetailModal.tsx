"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Certificate } from "@/data/certificates";
import { hasMultiPageDocument } from "@/data/certificates";
import { certificateThemeStyles } from "@/lib/certificate-themes";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

interface CertificateDetailModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

function getPreviewPages(certificate: Certificate) {
  if (certificate.previewImages?.length) return certificate.previewImages;
  if (certificate.previewImage) return [certificate.previewImage];
  return [];
}

function ModalPreview({
  certificate,
  pageLabel,
  badgeClass,
  stickerClass,
}: {
  certificate: Certificate;
  pageLabel: (current: number, total: number) => string;
  badgeClass: string;
  stickerClass: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const pages = useMemo(() => getPreviewPages(certificate), [certificate]);
  const showPdf =
    pages.length === 0 &&
    certificate.documentUrl?.toLowerCase().endsWith(".pdf");

  useEffect(() => {
    setPageIndex(0);
    setImageFailed(false);
  }, [certificate.id]);

  if (pages.length > 0 && !imageFailed) {
    const total = pages.length;
    const current = Math.min(pageIndex, total - 1);

    return (
      <div className="border-b-[3px] border-border bg-surface">
        <div className="relative aspect-[3/4] w-full bg-surface sm:aspect-[4/5]">
          <Image
            src={pages[current]}
            alt={`${certificate.title} — page ${current + 1}`}
            fill
            className="object-contain object-center p-2 sm:p-3"
            sizes="(max-width: 768px) 100vw, 640px"
            onError={() => setImageFailed(true)}
          />
          {total > 1 ? (
            <>
              <span
                className={cn(
                  "absolute right-3 top-3 px-2.5 py-1 text-[10px] sm:text-xs",
                  badgeClass,
                )}
              >
                {pageLabel(current + 1, total)}
              </span>
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2 px-3">
                <button
                  type="button"
                  onClick={() => setPageIndex((index) => Math.max(0, index - 1))}
                  disabled={current === 0}
                  aria-label="Previous page"
                  className="pop-btn flex h-9 w-9 items-center justify-center bg-card disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="flex items-center gap-1.5">
                  {pages.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setPageIndex(index)}
                      aria-label={`Page ${index + 1}`}
                      className={cn(
                        "h-2.5 rounded-full border-2 border-border transition-all",
                        index === current
                          ? "w-6 bg-accent-4"
                          : "w-2.5 bg-card hover:bg-accent-2",
                      )}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setPageIndex((index) => Math.min(total - 1, index + 1))
                  }
                  disabled={current === total - 1}
                  aria-label="Next page"
                  className="pop-btn flex h-9 w-9 items-center justify-center bg-card disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  }

  if (showPdf) {
    return (
      <div className="relative overflow-hidden border-b-[3px] border-border bg-surface">
        <iframe
          src={`${certificate.documentUrl}#toolbar=0&navpanes=0&view=FitH`}
          title={certificate.title}
          className="aspect-[3/4] w-full bg-surface sm:aspect-[4/5]"
        />
      </div>
    );
  }

  return (
    <div className="relative flex aspect-[3/4] flex-col items-center justify-center gap-4 border-b-[3px] border-border bg-surface p-8 sm:aspect-[4/5]">
      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center border-[3px] border-border shadow-[4px_4px_0_var(--shadow)] sm:h-20 sm:w-20",
          stickerClass,
        )}
      >
        <Award size={32} className="text-fg" />
      </div>
      <p className="text-center text-sm font-black uppercase tracking-wide text-muted">
        {certificate.title}
      </p>
    </div>
  );
}

function getCompetencyUnits(
  t: ReturnType<typeof useTranslations<"certificates">>,
  certificateId: string,
): string[] | undefined {
  const key = `items.${certificateId}.competencyUnits`;
  if (!t.has(key)) return undefined;

  const units = t.raw(key);
  return Array.isArray(units) && units.length > 0 ? units : undefined;
}

export function CertificateDetailModal({
  certificate,
  onClose,
}: CertificateDetailModalProps) {
  const t = useTranslations("certificates");
  const competencyUnits = certificate
    ? getCompetencyUnits(t, certificate.id)
    : undefined;
  const styles = certificate
    ? certificateThemeStyles[certificate.category]
    : null;

  useEffect(() => {
    if (!certificate) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [certificate, onClose]);

  return (
    <AnimatePresence>
      {certificate ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-fg/60 backdrop-blur-[2px]" aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b-[3px] border-border bg-card px-4 py-3 sm:px-6 sm:py-4">
              <p
                id="certificate-modal-title"
                className="min-w-0 truncate text-xs font-black uppercase tracking-widest text-fg sm:text-sm"
              >
                {certificate.title}
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("close")}
                className="pop-btn flex h-10 w-10 shrink-0 items-center justify-center bg-accent-3 text-fg"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ModalPreview
                certificate={certificate}
                pageLabel={(current, total) => t("pageOf", { current, total })}
                badgeClass={styles!.badge}
                stickerClass={styles!.sticker}
              />

              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className={cn("px-3 py-1 text-[10px] sm:text-xs", styles!.badge)}>
                    {t(`filters.${certificate.category}`)}
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-bold text-fg sm:text-base">
                    {certificate.issuer}
                  </p>
                  {certificate.detail ? (
                    <p className="text-sm font-medium text-muted sm:text-base">
                      {certificate.detail}
                    </p>
                  ) : null}
                  <p className="text-sm font-black uppercase tracking-wide text-muted">
                    {certificate.date}
                  </p>
                </div>

                <div className={cn("border-[3px] border-border p-4 sm:p-5", styles!.panel)}>
                  <p className="text-sm font-medium leading-relaxed text-fg sm:text-base">
                    {t(`items.${certificate.id}.description`)}
                  </p>
                </div>

                {competencyUnits?.length ? (
                  <div className="border-[3px] border-border bg-card p-4 sm:p-5">
                    <h3 className="text-sm font-black uppercase tracking-wide sm:text-base">
                      {t(`items.${certificate.id}.competencyTitle`)}
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {competencyUnits.map((unit) => (
                        <li
                          key={unit}
                          className="flex gap-2 text-sm leading-relaxed text-fg sm:text-base"
                        >
                          <span
                            aria-hidden
                            className={cn("mt-2 h-1.5 w-1.5 shrink-0", styles!.stripe)}
                          />
                          <span>{unit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {certificate.documentUrl || hasMultiPageDocument(certificate) ? (
                  hasMultiPageDocument(certificate) ? (
                    <Link
                      href={`/sertifikat/dokumen/${certificate.id}`}
                      className={cn(
                        "project-pill pop-btn w-fit px-6 py-2.5 text-sm",
                        styles!.pill,
                      )}
                    >
                      {t("openDocument")}
                    </Link>
                  ) : (
                    <a
                      href={certificate.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "project-pill pop-btn w-fit px-6 py-2.5 text-sm",
                        styles!.pill,
                      )}
                    >
                      {t("openDocument")}
                    </a>
                  )
                ) : (
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    {t("documentSoon")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
