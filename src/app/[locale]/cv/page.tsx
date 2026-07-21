import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CvPreview } from "@/components/cv/CvPreview";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.cv" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function CvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CvPreview />;
}
