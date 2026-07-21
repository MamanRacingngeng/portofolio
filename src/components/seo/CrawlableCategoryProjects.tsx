import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ProjectCategoryId } from "@/data/portfolio";
import type { ProjectItem } from "@/data/projects";

type Props = {
  locale: string;
  categoryId: ProjectCategoryId;
  items: ProjectItem[];
};

export async function CrawlableCategoryProjects({
  locale,
  categoryId,
  items,
}: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("projects.items");
  const categoryT = await getTranslations("projects.categories");
  const categoryTitle = categoryT(`${categoryId}.title`);

  return (
    <section
      aria-label={`${categoryTitle} project index`}
      className="mt-10 border-t border-border/15 pt-8"
    >
      <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-muted">
        {categoryTitle} — full project index ({items.length})
      </h2>
      <ol className="grid gap-4 text-sm leading-relaxed text-muted">
        {items.map((project, index) => {
          const title = t(`${project.id}.title`);
          const description = t(`${project.id}.description`);

          return (
            <li key={project.id} id={`project-${project.id}`}>
              <span className="mr-2 font-mono text-xs text-muted/70">
                {index + 1}.
              </span>
              <strong className="text-fg">{title}</strong>
              {" — "}
              {description}
              {project.liveUrl ? (
                <>
                  {" "}
                  <a
                    href={project.liveUrl}
                    className="underline underline-offset-2"
                    rel="noopener noreferrer"
                  >
                    Live site
                  </a>
                </>
              ) : null}
              {project.documentUrl ? (
                <>
                  {" "}
                  <a
                    href={project.documentUrl}
                    className="underline underline-offset-2"
                  >
                    Notebook
                  </a>
                </>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
