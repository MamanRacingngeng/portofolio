"use client";

import { useTranslations } from "next-intl";
import { Award } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function CertificatesEmpty() {
  const t = useTranslations("certificates");

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="lime"
          showPolkadots
        />

        <div className="brutal-card flex min-h-[320px] flex-col items-center justify-center p-12 text-center">
          <div className="sticker mb-6 flex h-16 w-16 items-center justify-center bg-accent-2">
            <Award size={28} />
          </div>
          <p className="text-xl font-black uppercase sm:text-2xl">
            {t("emptyTitle")}
          </p>
          <p className="mt-4 max-w-sm text-base text-muted">
            {t("emptyDescription")}
          </p>
        </div>
      </div>
    </section>
  );
}
