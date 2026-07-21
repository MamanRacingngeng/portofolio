import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GuestbookForm } from "@/components/buku-tamu/GuestbookForm";
import { createPageMetadata } from "@/lib/seo/metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.guestbook" });

  return createPageMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    path: "/buku-tamu",
  });
}

export default async function BukuTamuPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GuestbookForm />;
}
