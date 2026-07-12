import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProjectCategoryPage } from "@/components/proyek/ProjectCategoryPage";
import {
  projectCategories,
  type ProjectCategoryId,
} from "@/data/portfolio";

type Props = {
  params: Promise<{ locale: string; category: string }>;
};

const categoryIds = projectCategories.map((item) => item.slug);

function isProjectCategory(value: string): value is ProjectCategoryId {
  return projectCategories.some((item) => item.slug === value);
}

export function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;

  if (!isProjectCategory(category)) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "projects" });
  const categories = t.raw("categories") as Record<
    ProjectCategoryId,
    { title: string; description: string }
  >;

  return {
    title: `${categories[category].title} — RAHN.`,
    description: categories[category].description,
  };
}

export default async function ProjectCategoryRoute({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isProjectCategory(category)) {
    notFound();
  }

  return <ProjectCategoryPage categoryId={category} />;
}
