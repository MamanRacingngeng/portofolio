import { Hero } from "@/components/home/Hero";
import { ProjectShowcase } from "@/components/home/ProjectShowcase";
import { Timeline } from "@/components/home/Timeline";
import { TechGrid } from "@/components/shared/TechGrid";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Timeline />
      <ProjectShowcase />
      <TechGrid />
    </>
  );
}
