import { routing } from "@/i18n/routing";
import { projectCategories } from "@/data/portfolio";

export const publicPaths = [
  "",
  "/proyek",
  ...projectCategories.map((category) => `/proyek/${category.slug}`),
  "/sertifikat",
  "/blog",
  "/buku-tamu",
  "/tumpukan",
] as const;

export type PublicPath = (typeof publicPaths)[number];

export function localePath(locale: string, path: PublicPath | string): string {
  const normalized = path.startsWith("/") || path === "" ? path : `/${path}`;

  if (locale === routing.defaultLocale) {
    return normalized || "/";
  }

  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://nendhi.vercel.app";
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
