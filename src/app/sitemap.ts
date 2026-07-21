import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, localePath, publicPaths } from "@/lib/seo/paths";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticFiles: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/portfolio-summary.json"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const pages = routing.locales.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: now,
      changeFrequency: path.startsWith("/proyek") ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/proyek" ? 0.9 : 0.8,
    })),
  );

  return [...pages, ...staticFiles];
}
