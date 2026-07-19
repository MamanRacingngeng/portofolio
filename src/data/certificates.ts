export const certificateCategories = [
  "certification",
  "training",
  "language",
  "achievement",
] as const;

export type CertificateCategory = (typeof certificateCategories)[number];

export type Certificate = {
  id: string;
  category: CertificateCategory;
  title: string;
  issuer: string;
  date: string;
  detail: string;
  previewImage: string;
  previewImages?: string[];
  documentUrl?: string;
};

export function getCertificateDocumentPages(certificate: Certificate): string[] {
  if (certificate.previewImages?.length) return certificate.previewImages;
  if (certificate.documentUrl) return [certificate.documentUrl];
  return [certificate.previewImage];
}

export function hasMultiPageDocument(certificate: Certificate): boolean {
  return getCertificateDocumentPages(certificate).length > 1;
}

export function getCertificateById(id: string): Certificate | undefined {
  return certificates.find((item) => item.id === id);
}

export const certificates: Certificate[] = [
  {
    id: "ads-bnsp",
    category: "certification",
    title: "Associate Data Scientist",
    issuer: "BNSP",
    detail: "Artificial Intelligence · LSP Universitas Ahmad Dahlan",
    date: "Sept 2025",
    previewImage: "/images/certificates/ads-bnsp.png",
    previewImages: [
      "/images/certificates/ads-bnsp.png",
      "/images/certificates/ads-bnsp-page-2.png",
    ],
    documentUrl: "/images/certificates/ads-bnsp.png",
  },
  {
    id: "ads-digital-talent",
    category: "training",
    title: "Associate Data Scientist Microskill",
    issuer: "Digital Talent Scholarship",
    detail: "Kominfo · Data Science Microskill",
    date: "2025",
    previewImage: "/images/certificates/ads-digital-talent.png",
    documentUrl: "/certificates/ads-digital-talent.pdf",
  },
  {
    id: "pelatihan-data-science",
    category: "training",
    title: "Data Science Training",
    issuer: "Training Program",
    detail: "Analytics Workflows · Modeling Fundamentals",
    date: "2025",
    previewImage: "/images/certificates/pelatihan-data-science.png",
    documentUrl: "/certificates/pelatihan-data-science.pdf",
  },
  {
    id: "ui-ux",
    category: "training",
    title: "UI/UX Design",
    issuer: "Design Training",
    detail: "User-Centered Design · Interface Usability",
    date: "2025",
    previewImage: "/images/certificates/ui-ux.png",
    documentUrl: "/certificates/ui-ux.pdf",
  },
  {
    id: "adept-uad",
    category: "language",
    title: "ADEPT",
    issuer: "Ahmad Dahlan Language Center",
    detail: "Total Score 476",
    date: "Jun 2026",
    previewImage: "/images/certificates/adept-uad.png",
    documentUrl: "/certificates/toefl-itp.pdf",
  },
  {
    id: "magang-bbspjikb",
    category: "training",
    title: "Internship Certificate",
    issuer: "BBSPJIKB Yogyakarta",
    detail: "Kementerian Perindustrian RI · Bagian Data dan Informasi",
    date: "Jan 2026",
    previewImage: "/images/certificates/magang-bbspjikb.png",
    documentUrl: "/images/certificates/magang-bbspjikb.png",
  },
  {
    id: "soft-skills-uad",
    category: "training",
    title: "Soft Skills Training Phase II",
    issuer: "Universitas Ahmad Dahlan",
    detail: "Career Development Center",
    date: "Jul 2025",
    previewImage: "/images/certificates/soft-skills-uad.png",
    documentUrl: "/images/certificates/soft-skills-uad.png",
  },
  {
    id: "literasi-ms-word",
    category: "training",
    title: "MS Word Literacy Training",
    issuer: "Universitas Ahmad Dahlan",
    detail: "Scientific Writing Literacy Program",
    date: "2025",
    previewImage: "/images/certificates/literasi-ms-word.png",
    documentUrl: "/certificates/literasi-ms-word.pdf",
  },
  {
    id: "literasi-database",
    category: "training",
    title: "Database Literacy Training",
    issuer: "Universitas Ahmad Dahlan",
    detail: "Scientific Writing Literacy Program",
    date: "2025",
    previewImage: "/images/certificates/literasi-database.png",
    documentUrl: "/certificates/literasi-database.pdf",
  },
  {
    id: "literasi-mendeley",
    category: "training",
    title: "Mendeley Reference Management",
    issuer: "Universitas Ahmad Dahlan",
    detail: "Scientific Writing Literacy Program",
    date: "2025",
    previewImage: "/images/certificates/literasi-mendeley.png",
    documentUrl: "/certificates/literasi-mendeley.pdf",
  },
  {
    id: "literasi-penelusuran-database",
    category: "training",
    title: "Online Database Search Training",
    issuer: "Universitas Ahmad Dahlan",
    detail: "Scientific Writing Literacy Program",
    date: "2025",
    previewImage: "/images/certificates/literasi-penelusuran-database.png",
    documentUrl: "/certificates/literasi-penelusuran-database.pdf",
  },
];
