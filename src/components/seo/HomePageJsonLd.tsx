import { getTranslations, setRequestLocale } from "next-intl/server";
import { JsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/site";
import { absoluteUrl } from "@/lib/seo/paths";
import { getFeaturedProjects } from "@/data/projects";

type Props = {
  locale: string;
};

export async function HomePageJsonLd({ locale }: Props) {
  setRequestLocale(locale);
  const t = await getTranslations("projects.items");
  const featured = getFeaturedProjects();

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.fullName,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: siteConfig.title,
    sameAs: [
      "https://github.com/MamanRacingngeng",
      "https://www.linkedin.com/in/rahmanarto",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.fullName} Portfolio`,
    url: siteConfig.url,
    description:
      "Portfolio of Rahman Nendhiarto — machine learning research, full-stack applications, and data-driven products.",
    inLanguage: locale === "id" ? "id-ID" : "en-US",
  };

  const featuredList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Featured Projects",
    itemListElement: featured.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: t(`${project.id}.title`),
      description: t(`${project.id}.description`),
      url: project.liveUrl ?? absoluteUrl(`/proyek/${project.category}#project-${project.id}`),
    })),
  };

  return <JsonLd data={[person, website, featuredList]} />;
}
