export const educationIds = ["uad-informatics"] as const;

export const educationLogos: Partial<Record<(typeof educationIds)[number], string>> = {
  "uad-informatics": "/images/career/uad-logo.png",
};

export const certificationIds = ["ads-bnsp", "data-science-training"] as const;

export const researchIds = ["sca-lstm-thesis"] as const;

/** Maps career certification entries to certificate document routes */
export const certificationDocumentIds: Partial<
  Record<(typeof certificationIds)[number], string>
> = {
  "ads-bnsp": "ads-bnsp",
  "data-science-training": "pelatihan-data-science",
};
