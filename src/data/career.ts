export const careerSections = ["education", "certifications", "research"] as const;

export type CareerSectionId = (typeof careerSections)[number];

export const educationIds = ["uad-informatics"] as const;

export const educationLogos: Partial<Record<(typeof educationIds)[number], string>> = {
  "uad-informatics": "/images/career/uad-logo.png",
};

export const researchIds = ["sca-lstm-thesis"] as const;

export const sectionHeaderImages: Record<CareerSectionId, string | null> = {
  education: null,
  certifications: "/images/certificates/ads-bnsp.png",
  research: "/images/projects/ai-ml/pm25-sca-lstm.png",
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
