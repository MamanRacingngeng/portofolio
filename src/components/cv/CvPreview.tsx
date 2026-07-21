import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export async function CvPreview() {
  const t = await getTranslations("cv");

  return (
    <section className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-black uppercase sm:text-3xl">
              {t("title")}
            </h1>
            <p className="mt-2 text-sm font-medium text-muted sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="project-pill pop-btn w-fit bg-card px-5 py-2.5 text-sm"
            >
              {t("backHome")}
            </Link>
            <a
              href={siteConfig.resumePdfUrl}
              download={siteConfig.resumeFileName}
              className={cn(
                "project-pill pop-btn w-fit px-5 py-2.5 text-sm",
                "pop-btn-secondary",
              )}
            >
              {t("download")}
            </a>
          </div>
        </div>

        <article className="overflow-hidden border-[3px] border-border bg-card shadow-[6px_6px_0_var(--shadow)]">
          <iframe
            src={`${siteConfig.resumePdfUrl}#toolbar=1&navpanes=0&view=FitH`}
            title={t("iframeTitle")}
            className="aspect-[3/4] w-full bg-surface sm:aspect-[4/5] lg:aspect-auto lg:min-h-[80vh]"
          />
        </article>
      </div>
    </section>
  );
}
