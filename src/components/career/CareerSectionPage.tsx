import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CareerSectionId } from "@/data/career";
import { CareerEducationSection } from "@/components/career/CareerEducationSection";
import { CareerResearchSection } from "@/components/career/CareerResearchSection";
import { CertificatesGrid } from "@/components/certificates/CertificatesGrid";
import { SectionTitle } from "@/components/ui/SectionTitle";

type CategoryCopy = {
  title: string;
  description: string;
};

const accentMap = {
  education: "sky" as const,
  certifications: "lime" as const,
  research: "pink" as const,
};

interface CareerSectionPageProps {
  sectionId: CareerSectionId;
}

export async function CareerSectionPage({ sectionId }: CareerSectionPageProps) {
  const t = await getTranslations("career");
  const categories = t.raw("categories") as Record<CareerSectionId, CategoryCopy>;
  const copy = categories[sectionId];

  return (
    <section className="page-section py-16 sm:py-20 lg:py-24">
      <div className="page-container max-w-6xl">
        <div className="mb-8 border-b-[3px] border-border/10 pb-6 sm:mb-10 sm:pb-8">
          <Link
            href="/karir"
            className="pop-btn pop-btn-ghost inline-flex items-center px-4 py-2 text-sm"
          >
            {t("back")}
          </Link>
        </div>

        <SectionTitle
          title={copy.title}
          subtitle={copy.description}
          accent={accentMap[sectionId]}
          align="center"
          size="md"
          className="mb-10 sm:mb-12"
        />

        {sectionId === "education" ? <CareerEducationSection /> : null}
        {sectionId === "certifications" ? <CertificatesGrid embedded /> : null}
        {sectionId === "research" ? <CareerResearchSection /> : null}
      </div>
    </section>
  );
}
