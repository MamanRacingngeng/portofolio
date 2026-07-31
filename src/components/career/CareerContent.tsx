"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { GraduationCap, Award, BookOpen, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  certificationDocumentIds,
  certificationIds,
  educationIds,
  educationLogos,
  researchIds,
} from "@/data/career";
import {
  revealViewport,
  scrollRevealStaggerContainer,
  scrollRevealStaggerItem,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

type EducationItem = {
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  thesisLabel: string;
  thesis: string;
};

type CertificationItem = {
  title: string;
  issuer: string;
  period: string;
  description: string;
};

type ResearchItem = {
  title: string;
  role: string;
  status: string;
  submittedTo: string;
  description: string;
};

const sectionIcons = {
  education: GraduationCap,
  certifications: Award,
  research: BookOpen,
} as const;

function CareerCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.article
      variants={scrollRevealStaggerItem}
      className={cn(
        "border-[3px] border-border bg-card p-5 text-left shadow-[5px_5px_0_#111] sm:p-7",
        className,
      )}
      whileHover={{
        backgroundColor: "rgba(212, 240, 106, 0.1)",
        boxShadow: "7px 7px 0 #f9a8b8",
        transition: { duration: 0.25 },
      }}
    >
      {children}
    </motion.article>
  );
}

function SectionBlock({
  sectionKey,
  accent,
  children,
}: {
  sectionKey: keyof typeof sectionIcons;
  accent: "lime" | "sky" | "pink";
  children: React.ReactNode;
}) {
  const t = useTranslations("career.sections");
  const Icon = sectionIcons[sectionKey];

  return (
    <section className="space-y-5 sm:space-y-6">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "inline-flex h-11 w-11 items-center justify-center border-[3px] border-border bg-card shadow-[3px_3px_0_#111] sm:h-12 sm:w-12",
            accent === "sky" && "bg-accent-4",
            accent === "lime" && "bg-accent-3",
            accent === "pink" && "bg-accent-2",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h2 className="font-display text-xl font-black uppercase tracking-tight sm:text-2xl">
          {t(sectionKey)}
        </h2>
      </div>
      {children}
    </section>
  );
}

export function CareerContent() {
  const t = useTranslations("career");
  const education = t.raw("education") as Record<string, EducationItem>;
  const certifications = t.raw("certifications") as Record<string, CertificationItem>;
  const research = t.raw("research") as Record<string, ResearchItem>;

  return (
    <section className="page-section min-h-screen py-10 sm:py-14">
      <div className="page-container max-w-4xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="sky"
          align="left"
        />

        <motion.div
          variants={scrollRevealStaggerContainer}
          initial={false}
          whileInView="visible"
          viewport={revealViewport}
          className="space-y-12 sm:space-y-14"
        >
          <SectionBlock sectionKey="education" accent="sky">
            <div className="space-y-5">
              {educationIds.map((id) => {
                const item = education[id];
                if (!item) return null;
                const logoSrc = educationLogos[id];

                return (
                  <CareerCard key={id}>
                    <span className="inline-block border-[3px] border-border bg-accent-4 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[4px_4px_0_#38bdf8] sm:px-4 sm:py-2 sm:text-xs">
                      {item.period}
                    </span>
                    <div className="mt-4 flex flex-col gap-4 sm:mt-5 sm:flex-row sm:items-start sm:gap-5">
                      {logoSrc ? (
                        <div className="shrink-0 self-start overflow-hidden border-[3px] border-border bg-black p-3 shadow-[4px_4px_0_#111] sm:p-4">
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
                    <hr className="my-5 border-t-[3px] border-border" />
                    <p className="text-xs font-black uppercase tracking-wide text-muted sm:text-sm">
                      {item.thesisLabel}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-fg sm:text-base sm:leading-[1.75]">
                      {item.thesis}
                    </p>
                  </CareerCard>
                );
              })}
            </div>
          </SectionBlock>

          <SectionBlock sectionKey="certifications" accent="lime">
            <div className="space-y-5">
              {certificationIds.map((id) => {
                const item = certifications[id];
                if (!item) return null;
                const documentId = certificationDocumentIds[id];

                return (
                  <CareerCard key={id}>
                    <span className="inline-block border-[3px] border-border bg-accent-3 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[4px_4px_0_#111] sm:px-4 sm:py-2 sm:text-xs">
                      {item.period}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-black uppercase leading-tight sm:mt-4 sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm font-bold text-fg sm:text-base">
                      {item.issuer}
                    </p>
                    <hr className="my-5 border-t-[3px] border-border" />
                    <p className="text-justify text-sm leading-relaxed text-fg sm:text-base sm:leading-[1.75]">
                      {item.description}
                    </p>
                    {documentId ? (
                      <Link
                        href={`/sertifikat/dokumen/${documentId}`}
                        className="project-pill pop-btn pop-btn-secondary mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm"
                      >
                        {t("viewCertificate")}
                        <ExternalLink className="h-4 w-4" aria-hidden />
                      </Link>
                    ) : null}
                  </CareerCard>
                );
              })}
            </div>
          </SectionBlock>

          <SectionBlock sectionKey="research" accent="pink">
            <div className="space-y-5">
              {researchIds.map((id) => {
                const item = research[id];
                if (!item) return null;

                return (
                  <CareerCard key={id}>
                    <span className="inline-block border-[3px] border-border bg-accent-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide shadow-[4px_4px_0_#111] sm:px-4 sm:py-2 sm:text-xs">
                      {item.status}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-black uppercase leading-tight sm:mt-4 sm:text-xl lg:text-2xl">
                      {item.title}
                    </h3>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-bold text-fg sm:text-base">
                        {item.role}
                      </p>
                      <p className="text-sm font-medium text-muted sm:text-base">
                        {item.submittedTo}
                      </p>
                    </div>
                    <hr className="my-5 border-t-[3px] border-border" />
                    <p className="text-justify text-sm leading-relaxed text-fg sm:text-base sm:leading-[1.75]">
                      {item.description}
                    </p>
                  </CareerCard>
                );
              })}
            </div>
          </SectionBlock>
        </motion.div>
      </div>
    </section>
  );
}
