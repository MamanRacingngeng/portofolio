"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-20">
      <div className="brutal-card max-w-lg rounded-3xl p-8 text-center sm:p-10">
        <p className="text-xs font-black uppercase tracking-widest text-muted">
          {t("title")}
        </p>
        <h1 className="mt-3 font-display text-2xl font-black uppercase sm:text-3xl">
          {t("heading")}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          {t("description")}
        </p>
        <button
          type="button"
          onClick={reset}
          className="project-pill project-pill--sky mt-6 inline-flex items-center rounded-full bg-accent-2 px-6 py-3 text-sm font-black uppercase tracking-wide"
        >
          {t("retry")}
        </button>
      </div>
    </section>
  );
}
