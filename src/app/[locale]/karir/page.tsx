import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CareerContent } from "@/components/career/CareerContent";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.career" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function KarirPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CareerContent />;
}
