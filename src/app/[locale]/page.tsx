import { Hero } from "@/components/home/Hero";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Timeline } from "@/components/home/Timeline";
import { TechGrid } from "@/components/shared/TechGrid";
import { CrawlableFeaturedProjects } from "@/components/seo/CrawlableFeaturedProjects";
import { HomePageJsonLd } from "@/components/seo/HomePageJsonLd";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomePageJsonLd locale={locale} />
      <Hero />
      <Timeline />
      <ProjectShowcase />
      <CrawlableFeaturedProjects locale={locale} />
      <TechGrid />
    </>
  );
}
