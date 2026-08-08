"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

type DocumentType = "cv" | "resume";

const documentConfig: Record<
  DocumentType,
  { pdfUrl: string; fileName: string; iframeTitleKey: "iframeTitleCv" | "iframeTitleResume" }
> = {
  cv: {
    pdfUrl: siteConfig.cvPdfUrl,
    fileName: siteConfig.cvFileName,
    iframeTitleKey: "iframeTitleCv",
  },
  resume: {
    pdfUrl: siteConfig.resumePdfUrl,
    fileName: siteConfig.resumeFileName,
    iframeTitleKey: "iframeTitleResume",
  },
};

export function CvPreview() {
  const t = useTranslations("cv");
  const [activeDoc, setActiveDoc] = useState<DocumentType>("cv");
  const current = documentConfig[activeDoc];

  return (
    <section className="page-section min-h-screen py-10 sm:py-14">
      <div className="page-container max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black uppercase sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="project-pill pop-btn w-fit bg-card px-5 py-2.5 text-sm"
            >
              {t("backHome")}
            </Link>
            <a
              href={current.pdfUrl}
              download={current.fileName}
              className={cn(
                "project-pill pop-btn w-fit px-5 py-2.5 text-sm",
                "pop-btn-secondary",
              )}
            >
              {activeDoc === "cv" ? t("downloadCv") : t("downloadResume")}
            </a>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["cv", "resume"] as const).map((docType) => {
            const isActive = activeDoc === docType;

            return (
              <button
                key={docType}
                type="button"
                onClick={() => setActiveDoc(docType)}
                aria-pressed={isActive}
                className={cn(
                  "brutal-chip px-4 py-2 text-xs font-black uppercase tracking-wide sm:text-sm",
                  isActive && "brutal-chip--active brutal-chip--sky",
                )}
              >
                {t(`tabs.${docType}`)}
              </button>
            );
          })}
        </div>

        <article className="overflow-hidden border-[3px] border-border bg-card shadow-[6px_6px_0_var(--shadow)]">
          <iframe
            key={activeDoc}
            src={`${current.pdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            title={t(current.iframeTitleKey)}
            className="aspect-[3/4] w-full bg-surface sm:aspect-[4/5] lg:aspect-auto lg:min-h-[80vh]"
          />
        </article>
      </div>
    </section>
  );
}
