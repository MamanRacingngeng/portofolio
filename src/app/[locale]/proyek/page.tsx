import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCategories } from "@/components/proyek/ProjectCategories";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.projects" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ProyekPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectCategories />;
}
