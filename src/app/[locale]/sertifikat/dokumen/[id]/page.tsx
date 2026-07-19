import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CertificateDocumentView } from "@/components/certificates/CertificateDocumentView";
import { certificates, getCertificateById } from "@/data/certificates";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export function generateStaticParams() {
  return certificates.map((certificate) => ({ id: certificate.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const certificate = getCertificateById(id);

  if (!certificate) {
    return {};
  }

  const t = await getTranslations({ locale, namespace: "meta.certificates" });

  return {
    title: `${certificate.title} — ${t("title")}`,
    description: t("description"),
  };
}

export default async function CertificateDocumentPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const certificate = getCertificateById(id);

  if (!certificate) {
    notFound();
  }

  return <CertificateDocumentView certificate={certificate} />;
}
