import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getFeaturedProjects } from "@/data/projects";

type Props = {
  locale: string;
};

export async function CrawlableFeaturedProjects({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("projects.items");
  const featured = getFeaturedProjects();

  return (
    <section
      aria-label="Featured projects index"
      className="mx-auto max-w-4xl px-4 pb-8 sm:px-6 lg:px-8"
    >
      <h2 className="sr-only">Featured Projects</h2>
      <ul className="grid gap-3 border-t border-border/15 pt-6 text-sm text-muted">
        {featured.map((project) => {
          const title = t(`${project.id}.title`);
          const description = t(`${project.id}.description`);

          return (
            <li key={project.id} className="leading-relaxed">
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
              {" · "}
              <Link
                href={`/proyek/${project.category}`}
                className="underline underline-offset-2"
              >
                View category
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
