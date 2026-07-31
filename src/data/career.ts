export const careerSectionCategories = [
  { id: "education" as const, slug: "education" },
  { id: "certifications" as const, slug: "certifications" },
  { id: "research" as const, slug: "research" },
] as const;

export type CareerSectionId = (typeof careerSectionCategories)[number]["id"];

export const educationIds = ["uad-informatics"] as const;

export const educationLogos: Partial<Record<(typeof educationIds)[number], string>> = {
  "uad-informatics": "/images/career/uad-logo.png",
};

export const researchIds = ["sca-lstm-thesis"] as const;

export const researchJournalLinks: Partial<
  Record<(typeof researchIds)[number], string>
> = {
  "sca-lstm-thesis":
    "https://jurnal.fikom.umi.ac.id/index.php/BUSITI/author",
};

export const sectionHeaderImages: Record<CareerSectionId, string> = {
  education: "/images/career/education.png",
  certifications: "/images/career/certifications.png",
  research: "/images/career/research.png",
};

export const sectionAccents = [
  {
    card: "project-card--sky",
    bar: "bg-accent-4",
    btn: "pop-btn-secondary",
  },
  {
    card: "project-card--pink",
    bar: "bg-accent-3",
    btn: "bg-accent-3",
  },
  {
    card: "project-card--lime",
    bar: "bg-accent-2",
    btn: "pop-btn-primary",
  },
] as const;

export function isCareerSection(value: string): value is CareerSectionId {
  return careerSectionCategories.some((item) => item.slug === value);
}

export function getCareerSectionSlug(sectionId: CareerSectionId): string {
  return (
    careerSectionCategories.find((item) => item.id === sectionId)?.slug ??
    sectionId
  );
}
