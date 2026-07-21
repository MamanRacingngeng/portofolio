import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projectCategories, type ProjectCategoryId } from "@/data/portfolio";
import { getProjectsByCategory } from "@/data/projects";

type Props = {
  locale: string;
};

export async function CrawlableProjectCategories({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  return (
    <section
      aria-label="Project categories index"
      className="mx-auto mt-8 max-w-4xl border-t border-border/15 px-4 pt-8 sm:px-6 lg:px-8"
    >
      <h2 className="sr-only">Project Categories</h2>
      <ul className="grid gap-4 text-sm leading-relaxed text-muted">
        {projectCategories.map((category) => {
          const copy = t.raw(`categories.${category.id}`) as {
            title: string;
            description: string;
          };
          const count = getProjectsByCategory(
            category.id as ProjectCategoryId,
          ).length;

          return (
            <li key={category.id}>
              <Link
                href={`/proyek/${category.slug}`}
                className="font-black text-fg underline underline-offset-2"
              >
                {copy.title}
              </Link>
              {" — "}
              {copy.description} ({count} projects)
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-muted">
        Machine-readable portfolio summary:{" "}
        <a href="/portfolio-summary.json" className="underline underline-offset-2">
          /portfolio-summary.json
        </a>
      </p>
    </section>
  );
}
