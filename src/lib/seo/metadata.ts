import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { absoluteUrl, localePath } from "@/lib/seo/paths";
import { routing } from "@/i18n/routing";

type PageMetadataInput = {
  title: string;
  description: string;
  locale: string;
  path?: string;
  imagePath?: string;
};

export function createPageMetadata({
  title,
  description,
  locale,
  path = "/",
  imagePath = siteConfig.ogImagePath,
}: PageMetadataInput): Metadata {
  const canonicalPath = localePath(locale, path);
  const canonical = absoluteUrl(canonicalPath);
  const imageUrl = absoluteUrl(imagePath);

  const languages = Object.fromEntries(
    routing.locales.map((entry) => [entry, absoluteUrl(localePath(entry, path))]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "id" ? "id_ID" : "en_US",
      url: canonical,
      siteName: siteConfig.fullName,
      title,
      description,
      images: [{ url: imageUrl, alt: siteConfig.fullName }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
