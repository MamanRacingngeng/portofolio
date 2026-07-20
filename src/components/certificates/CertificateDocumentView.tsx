import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Certificate } from "@/data/certificates";
import { getCertificateDocumentPages } from "@/data/certificates";
import { certificateThemeStyles } from "@/lib/certificate-themes";
import { cn } from "@/lib/utils";

interface CertificateDocumentViewProps {
  certificate: Certificate;
}

export async function CertificateDocumentView({
  certificate,
}: CertificateDocumentViewProps) {
  const t = await getTranslations("certificates");
  const pages = getCertificateDocumentPages(certificate);
  const styles = certificateThemeStyles[certificate.category];

  return (
    <section className="min-h-screen px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className={cn("inline-block px-3 py-1 text-[10px] sm:text-xs", styles.badge)}>
              {t(`filters.${certificate.category}`)}
            </span>
            <h1 className="mt-3 font-display text-2xl font-black uppercase sm:text-3xl">
              {certificate.title}
            </h1>
            <p className="mt-2 text-sm font-bold text-fg">{certificate.issuer}</p>
          </div>
          <Link
            href="/sertifikat"
            className={cn("project-pill pop-btn w-fit px-5 py-2.5 text-sm", styles.pill)}
          >
            {t("backToCertificates")}
          </Link>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {pages.map((page, index) => (
            <article
              key={page}
              className="overflow-hidden border-[3px] border-border bg-card shadow-[6px_6px_0_var(--shadow)]"
            >
              {pages.length > 1 ? (
                <div className={cn("border-b-[3px] border-border px-4 py-3 sm:px-5", styles.panel)}>
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
