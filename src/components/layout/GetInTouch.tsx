"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/data/portfolio";
import { AccentButton } from "@/components/ui/AccentButton";
import { cn } from "@/lib/utils";

type ContactItem = {
  id: "email" | "linkedin" | "github" | "discord" | "resume" | "whatsapp";
  href: string;
  external: boolean;
  className: string;
};

const contactItems: ContactItem[] = [
  {
    id: "email",
    href: siteConfig.emailComposeUrl,
    external: true,
    className: "bg-accent-4",
  },
  {
    id: "linkedin",
    href: siteConfig.social.linkedin,
    external: true,
    className: "bg-accent-3",
  },
  {
    id: "github",
    href: siteConfig.social.github,
    external: true,
    className: "bg-card",
  },
  {
    id: "discord",
    href: siteConfig.social.discord,
    external: true,
    className: "bg-accent text-white",
  },
  {
    id: "resume",
    href: siteConfig.resumeUrl,
    external: false,
    className: "bg-accent-2",
  },
  {
    id: "whatsapp",
    href: `https://wa.me/${siteConfig.whatsapp}`,
    external: true,
    className: "bg-card",
  },
];

interface GetInTouchProps {
  className?: string;
}

export function GetInTouch({ className }: GetInTouchProps) {
  const t = useTranslations("footer");
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const modal =
    open && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label={t("modal.close")}
              className="absolute inset-0 bg-fg/50 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="brutal-card relative z-10 w-full max-w-sm bg-card p-6 sm:max-w-md sm:p-8"
            >
              <button
                type="button"
                aria-label={t("modal.close")}
                onClick={() => setOpen(false)}
                className="pop-btn pop-btn-ghost absolute right-4 top-4 px-2.5 py-1.5 text-lg leading-none"
              >
                ×
              </button>

              <h2
                id={titleId}
                className="font-display pr-10 text-2xl font-black sm:text-3xl"
              >
                {t("modal.title")}
              </h2>

              <ul className="mt-6 space-y-3">
                {contactItems.map(({ id, href, external, className: itemClass }) => (
                  <li key={id}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t(`social.${id}Aria`)}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "pop-btn w-full justify-center px-4 py-3.5 text-base normal-case tracking-normal",
                          itemClass,
                        )}
                      >
                        {t(`social.${id}`)}
                      </a>
                    ) : (
                      <Link
                        href={href}
                        aria-label={t(`social.${id}Aria`)}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "pop-btn w-full justify-center px-4 py-3.5 text-base normal-case tracking-normal",
                          itemClass,
                        )}
                      >
                        {t(`social.${id}`)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <AccentButton
        variant="primary"
        onClick={() => setOpen(true)}
        className={cn("w-full px-6 py-3.5 sm:w-auto", className)}
      >
        {t("getInTouch")}
      </AccentButton>
      {modal}
    </>
  );
}
