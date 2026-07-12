"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const localeLabels: Record<Locale, string> = {
  id: "ID",
  en: "EN",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative inline-grid h-9 grid-cols-2 rounded-lg border-[3px] border-border bg-card p-0.5",
        className,
      )}
      role="group"
      aria-label="Language"
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-accent transition-transform duration-200 ease-out",
          locale === "en" && "translate-x-full",
        )}
      />

      {routing.locales.map((loc) => {
        const isActive = locale === loc;

        return (
          <button
            key={loc}
            type="button"
            onClick={() => !isActive && router.replace(pathname, { locale: loc })}
            className={cn(
              "relative z-10 inline-flex items-center justify-center rounded-md px-2.5 text-xs font-bold leading-none outline-none transition-colors [-webkit-tap-highlight-color:transparent]",
              isActive
                ? "text-white"
                : "text-muted hover:text-fg active:text-fg",
            )}
            aria-pressed={isActive}
          >
            {localeLabels[loc]}
          </button>
        );
      })}
    </div>
  );
}
