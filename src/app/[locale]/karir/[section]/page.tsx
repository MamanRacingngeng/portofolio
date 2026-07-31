import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CareerSectionPage } from "@/components/career/CareerSectionPage";
import {
  careerSectionCategories,
  isCareerSection,
  type CareerSectionId,
} from "@/data/career";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; section: string }>;
};

const sectionSlugs = careerSectionCategories.map((item) => item.slug);

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    sectionSlugs.map((section) => ({ locale, section })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, section } = await params;

  if (!isCareerSection(section)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "career" });
  const categories = t.raw("categories") as Record<
    CareerSectionId,
    { title: string; description: string }
  >;

  return {
    title: `${categories[section].title} — RAHN.`,
    description: categories[section].description,
  };
}

export default async function CareerSectionRoute({ params }: Props) {
  const { locale, section } = await params;
  setRequestLocale(locale);

  if (!isCareerSection(section)) {
    notFound();
  }

  return <CareerSectionPage sectionId={section} />;
}
