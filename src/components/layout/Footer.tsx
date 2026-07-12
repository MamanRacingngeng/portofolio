import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/data/portfolio";
import { Marquee } from "./Marquee";
import { GetInTouch } from "./GetInTouch";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer>
      <Marquee />
      <div className="border-t-[3px] border-border bg-card px-4 py-12 sm:px-6 sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <div className="min-w-0 flex-1 space-y-4">
            <p className="font-display text-xl font-black sm:text-2xl">
              {siteConfig.firstName}{" "}
              <span className="name-highlight">{siteConfig.lastName}</span>
            </p>
            <p className="text-sm font-bold uppercase tracking-wide text-fg sm:text-base">
              {t("roles")}
            </p>
            <p className="max-w-xl text-sm font-medium leading-relaxed text-muted sm:text-base">
              {t("description")}
            </p>
          </div>
          <div className="shrink-0 lg:mt-8 lg:self-start">
            <GetInTouch />
          </div>
        </div>
      </div>
      <div className="px-4 py-5 text-center">
        <p className="text-xs font-medium text-muted">
          &copy; {year} {siteConfig.fullName}
        </p>
      </div>
    </footer>
  );
}
