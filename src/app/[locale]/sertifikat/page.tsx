import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CertificatesEmpty } from "@/components/certificates/CertificatesEmpty";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta.certificates" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function SertifikatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CertificatesEmpty />;
}
