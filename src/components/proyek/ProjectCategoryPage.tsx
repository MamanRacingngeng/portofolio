import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { FolderOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { ProjectCategoryId } from "@/data/portfolio";
import { getProjectsByCategory } from "@/data/projects";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { GallerySkeleton } from "@/components/proyek/GallerySkeleton";

const AiMlGallery = dynamic(
  () =>
    import("@/components/proyek/AiMlGallery").then((module) => module.AiMlGallery),
  { loading: () => <GallerySkeleton /> },
);

const DashboardGallery = dynamic(
  () =>
    import("@/components/proyek/DashboardGallery").then(
      (module) => module.DashboardGallery,
    ),
  { loading: () => <GallerySkeleton /> },
);

const ProjectCategoryList = dynamic(
  () =>
    import("@/components/proyek/ProjectCategoryList").then(
      (module) => module.ProjectCategoryList,
    ),
  { loading: () => <GallerySkeleton /> },
);

type CategoryCopy = {
  title: string;
  description: string;
};

const accentMap = {
  "ai-ml": "sky" as const,
  dashboards: "pink" as const,
  "software-dev": "lime" as const,
};

interface ProjectCategoryPageProps {
  categoryId: ProjectCategoryId;
}

export async function ProjectCategoryPage({ categoryId }: ProjectCategoryPageProps) {
  const t = await getTranslations("projects");
  const categories = t.raw("categories") as Record<ProjectCategoryId, CategoryCopy>;
  const copy = categories[categoryId];
  const categoryProjects = getProjectsByCategory(categoryId);

  return (
    <section className="page-section py-16 sm:py-20 lg:py-24">
      <div className="page-container max-w-6xl">
        <div className="mb-8 border-b-[3px] border-border/10 pb-6 sm:mb-10 sm:pb-8">
          <Link
            href="/proyek"
            className="pop-btn pop-btn-ghost inline-flex items-center px-4 py-2 text-sm"
          >
            {t("back")}
          </Link>
        </div>

        <SectionTitle
          title={copy.title}
          subtitle={copy.description}
          accent={accentMap[categoryId]}
          align="center"
          size="md"
          showPolkadots
          className="mb-10 sm:mb-12"
        />

        {categoryId === "ai-ml" && categoryProjects.length > 0 ? (
          <AiMlGallery items={categoryProjects} />
        ) : categoryId === "dashboards" && categoryProjects.length > 0 ? (
          <DashboardGallery items={categoryProjects} />
        ) : categoryProjects.length > 0 ? (
          <ProjectCategoryList items={categoryProjects} />
        ) : (
          <div className="brutal-card flex min-h-[280px] flex-col items-center justify-center rounded-3xl p-10 text-center">
            <div className="sticker mb-6 flex h-16 w-16 items-center justify-center bg-accent-2">
              <FolderOpen size={28} />
            </div>
            <p className="text-xl font-black uppercase sm:text-2xl">
              {t("categoryEmptyTitle")}
            </p>
            <p className="mt-4 max-w-md text-base text-muted">
              {t("categoryEmptyDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
