import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Certificate } from "@/data/certificates";
import { getCertificateDocumentPages } from "@/data/certificates";

interface CertificateDocumentViewProps {
  certificate: Certificate;
}

export async function CertificateDocumentView({
  certificate,
}: CertificateDocumentViewProps) {
  const t = await getTranslations("certificates");
  const pages = getCertificateDocumentPages(certificate);

  return (
    <section className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-muted">
              {t(`filters.${certificate.category}`)}
            </p>
            <h1 className="mt-2 font-display text-2xl font-black uppercase sm:text-3xl">
              {certificate.title}
            </h1>
            <p className="mt-1 text-sm font-bold text-fg">{certificate.issuer}</p>
          </div>
          <Link
            href="/sertifikat"
            className="project-pill project-pill--sky inline-flex w-fit items-center rounded-full bg-accent-2 px-5 py-2.5 text-sm font-black uppercase tracking-wide"
          >
            {t("backToCertificates")}
          </Link>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {pages.map((page, index) => (
            <article
              key={page}
              className="overflow-hidden rounded-2xl border-[3px] border-border bg-card shadow-[6px_6px_0_var(--shadow)] sm:rounded-3xl"
            >
              {pages.length > 1 ? (
                <div className="border-b-[3px] border-border bg-accent-2 px-4 py-3 sm:px-5">
                  <p className="text-xs font-black uppercase tracking-wide sm:text-sm">
                    {t("pageOf", { current: index + 1, total: pages.length })}
                  </p>
                </div>
              ) : null}
              <div className="relative w-full bg-surface">
                <Image
                  src={page}
                  alt={`${certificate.title} — page ${index + 1}`}
                  width={1200}
                  height={1600}
                  className="h-auto w-full object-contain"
                  sizes="(max-width: 768px) 100vw, 896px"
                  priority={index === 0}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
