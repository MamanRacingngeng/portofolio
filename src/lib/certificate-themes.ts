import type { CertificateCategory } from "@/data/certificates";

export const certificateThemeStyles: Record<
  CertificateCategory,
  {
    card: string;
    pill: string;
    stripe: string;
    badge: string;
    sticker: string;
    filterActive: string;
    preview: string;
    panel: string;
  }
> = {
  certification: {
    card: "project-card--sky",
    pill: "pop-btn-secondary",
    stripe: "bg-accent-4",
    badge: "brutal-tag brutal-tag--sky",
    sticker: "bg-accent-4",
    filterActive: "brutal-chip--active brutal-chip--sky",
    preview: "from-accent-4/25 to-surface",
    panel: "bg-accent-4",
  },
  training: {
    card: "project-card--lime",
    pill: "pop-btn-primary",
    stripe: "bg-accent-2",
    badge: "brutal-tag brutal-tag--lime",
    sticker: "bg-accent-2",
    filterActive: "brutal-chip--active brutal-chip--lime",
    preview: "from-accent-2/30 to-surface",
    panel: "bg-accent-2",
  },
  language: {
    card: "project-card--purple",
    pill: "bg-accent text-white",
    stripe: "bg-accent",
    badge: "brutal-tag brutal-tag--purple",
    sticker: "bg-accent",
    filterActive: "brutal-chip--active brutal-chip--purple",
    preview: "from-accent/20 to-surface",
    panel: "bg-accent",
  },
  achievement: {
    card: "project-card--pink",
    pill: "bg-accent-3",
    stripe: "bg-accent-3",
    badge: "brutal-tag brutal-tag--pink",
    sticker: "bg-accent-3",
    filterActive: "brutal-chip--active brutal-chip--pink",
    preview: "from-accent-3/30 to-surface",
    panel: "bg-accent-3",
  },
};
