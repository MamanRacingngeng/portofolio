import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCategories } from "@/components/proyek/ProjectCategories";
import { CrawlableProjectCategories } from "@/components/seo/CrawlableProjectCategories";
import { createPageMetadata } from "@/lib/seo/metadata";
import type { ProjectCategoryId } from "@/data/portfolio";

type Props = {
  params: Promise<{ locale: string }>;
};

type CategoryCopy = {
  title: string;
  description: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.projects" });

  return {
    ...createPageMetadata({
      title: t("title"),
      description: t("description"),
      locale,
      path: "/proyek",
    }),
  };
}

export default async function ProyekPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("projects");
  const categories = t.raw("categories") as Record<ProjectCategoryId, CategoryCopy>;

  return (
    <>
      <ProjectCategories
        title={t("title")}
        subtitle={t("subtitle")}
        exploreLabel={t("explore")}
        categories={categories}
      />
      <CrawlableProjectCategories locale={locale} />
    </>
  );
}
