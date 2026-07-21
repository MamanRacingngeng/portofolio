import { certificates } from "@/data/certificates";

export function CrawlableCertificatesIndex() {
  return (
    <section
      aria-label="Certificates index"
      className="mx-auto mt-10 max-w-6xl border-t border-border/15 px-4 pt-8 sm:px-6 lg:px-8"
    >
      <h2 className="mb-4 text-sm font-black uppercase tracking-wide text-muted">
        Certificates index ({certificates.length})
      </h2>
      <ol className="grid gap-3 text-sm leading-relaxed text-muted">
        {certificates.map((certificate, index) => (
          <li key={certificate.id}>
            <span className="mr-2 font-mono text-xs text-muted/70">
              {index + 1}.
            </span>
            <strong className="text-fg">{certificate.title}</strong>
            {" — "}
            {certificate.issuer}, {certificate.detail} ({certificate.date})
          </li>
        ))}
      </ol>
    </section>
  );
}
