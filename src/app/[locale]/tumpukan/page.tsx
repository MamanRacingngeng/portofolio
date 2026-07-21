import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TechGrid } from "@/components/shared/TechGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.stack" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TumpukanPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stackPage");

  return (
    <div className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="sky"
          showPolkadots
        />
      </div>
      <TechGrid title={t("stackTitle")} showTitle={false} variant="grid" />
    </div>
  );
}
