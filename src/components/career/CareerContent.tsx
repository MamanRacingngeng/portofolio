"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CertificateDetailModal } from "@/components/certificates/CertificateDetailModal";
import { certificates, type Certificate } from "@/data/certificates";
import {
  careerSections,
  educationIds,
  educationLogos,
  researchIds,
  sectionAccents,
  sectionHeaderImages,
  type CareerSectionId,
} from "@/data/career";
import { certificateThemeStyles } from "@/lib/certificate-themes";
import { mediaRevealZoomSmClass } from "@/lib/media-reveal";
import { revealViewport } from "@/lib/animations";
import { cn } from "@/lib/utils";

type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  thesisLabel: string;
  thesis: string;
};

type ResearchItem = {
  title: string;
  role: string;
  status: string;
  submittedTo: string;
  description: string;
};

function CareerSectionCard({
  sectionId,
  index,
  children,
}: {
  sectionId: CareerSectionId;
  index: number;
  children: React.ReactNode;
}) {
  const t = useTranslations("career");
  const accent = sectionAccents[index % sectionAccents.length];
  const headerImage = sectionHeaderImages[sectionId];
  const logoSrc =
    sectionId === "education" ? educationLogos[educationIds[0]] : undefined;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
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

      <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b-[3px] border-border bg-surface">
        {logoSrc ? (
          <Image
            src={logoSrc}
            alt={t("sections.education")}
            width={220}
            height={110}
            className="h-auto w-40 object-contain mix-blend-lighten sm:w-44 dark:mix-blend-normal"
          />
        ) : headerImage ? (
          <Image
            src={headerImage}
            alt=""
            fill
            quality={100}
            unoptimized
            className={cn("object-cover object-top", mediaRevealZoomSmClass)}
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
        <h2 className="font-display text-lg font-black uppercase leading-snug text-fg sm:text-xl">
          {t(`sections.${sectionId}`)}
        </h2>
        <div className={cn("mt-3 h-[3px] w-10", accent.bar)} />
        <div className="mt-4 min-h-0 flex-1 space-y-4">{children}</div>
      </div>
    </motion.article>
  );
}

function CertificateListItem({
  certificate,
  onSelect,
}: {
  certificate: Certificate;
  onSelect: (certificate: Certificate) => void;
}) {
  const styles = certificateThemeStyles[certificate.category];

  return (
    <button
      type="button"
      onClick={() => onSelect(certificate)}
      className={cn(
        "group/cert w-full border-[3px] border-border bg-card text-left shadow-[3px_3px_0_#111] transition-colors",
        "hover:bg-accent-3/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
        <div className="relative h-14 w-20 shrink-0 overflow-hidden border-[2px] border-border bg-surface sm:h-16 sm:w-24">
          <Image
            src={certificate.previewImage}
            alt=""
            fill
            className="object-cover object-top"
            sizes="96px"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-display text-xs font-black uppercase leading-snug sm:text-sm">
            {certificate.title}
          </p>
          <p className="mt-1 text-[11px] font-bold text-fg sm:text-xs">
            {certificate.issuer}
          </p>
          <span
            className={cn(
              "mt-2 inline-block px-2 py-0.5 text-[10px] font-black uppercase",
              styles.badge,
            )}
          >
            {certificate.date}
          </span>
        </div>
      </div>
    </button>
  );
}

export function CareerContent() {
  const t = useTranslations("career");
  const education = t.raw("education") as Record<string, EducationItem>;
  const research = t.raw("research") as Record<string, ResearchItem>;
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  return (
    <section className="page-section py-16 sm:py-20 lg:py-24">
      <CertificateDetailModal
        certificate={selectedCertificate}
        onClose={() => setSelectedCertificate(null)}
      />

      <div className="page-container max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="pink"
        />

        <div className="card-shadow-grid grid items-stretch gap-8 lg:grid-cols-3 lg:gap-9">
          {careerSections.map((sectionId, index) => (
            <CareerSectionCard
              key={sectionId}
              sectionId={sectionId}
              index={index}
            >
              {sectionId === "education"
                ? educationIds.map((id) => {
                    const item = education[id];
                    if (!item) return null;

                    return (
                      <div key={id} className="space-y-4">
                        <span className="inline-block border-[3px] border-border bg-accent-4 px-3 py-1 text-[10px] font-black uppercase tracking-wide shadow-[3px_3px_0_#38bdf8] sm:text-xs">
                          {item.period}
                        </span>
                        <div>
                          <p className="font-display text-sm font-black uppercase leading-snug sm:text-base">
                            {item.institution}
                          </p>
                          <p className="mt-2 text-sm font-bold text-fg">
                            {item.degree}
                          </p>
                          <p className="mt-1 text-sm text-muted">{item.gpa}</p>
                        </div>
                        <div className="border-t-[3px] border-border pt-4">
                          <p className="text-[10px] font-black uppercase tracking-wide text-muted sm:text-xs">
                            {item.thesisLabel}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed text-fg">
                            {item.thesis}
                          </p>
                        </div>
                      </div>
                    );
                  })
                : null}

              {sectionId === "certifications" ? (
                <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1 sm:max-h-[32rem]">
                  {certificates.map((certificate) => (
                    <CertificateListItem
                      key={certificate.id}
                      certificate={certificate}
                      onSelect={setSelectedCertificate}
                    />
                  ))}
                </div>
              ) : null}

              {sectionId === "research"
                ? researchIds.map((id) => {
                    const item = research[id];
                    if (!item) return null;

                    return (
                      <div key={id} className="space-y-4">
                        <span className="inline-block border-[3px] border-border bg-accent-2 px-3 py-1 text-[10px] font-black uppercase tracking-wide shadow-[3px_3px_0_#111] sm:text-xs">
                          {item.status}
                        </span>
                        <p className="font-display text-sm font-black uppercase leading-snug sm:text-base">
                          {item.title}
                        </p>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-fg">
                            {item.role}
                          </p>
                          <p className="text-sm text-muted">
                            {item.submittedTo}
                          </p>
                        </div>
                        <div className="border-t-[3px] border-border pt-4">
                          <p className="text-sm leading-relaxed text-fg">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })
                : null}
            </CareerSectionCard>
          ))}
        </div>
      </div>
    </section>
  );
}
