import { defineRouting } from "next-intl/routing";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "id",
  localePrefix: "as-needed",
});
