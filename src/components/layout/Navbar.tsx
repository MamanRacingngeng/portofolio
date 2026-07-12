"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { navRoutes, siteConfig } from "@/data/portfolio";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-card">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem]">
        <Link
          href="/"
          className="pop-btn pop-btn-primary px-3 py-1.5 font-display text-sm font-black sm:text-base"
        >
          {siteConfig.logo}
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navRoutes.map((route) => {
            const isActive = pathname === route.href;
            return (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={cn(
                    "px-4 py-2 text-sm font-black uppercase tracking-wide",
                    isActive
                      ? "pop-btn bg-accent-4 text-fg"
                      : "text-muted hover:text-fg",
                  )}
                >
                  {t(route.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-1.5 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1.5 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="pop-btn pop-btn-ghost flex h-10 w-10 items-center justify-center"
            aria-label={isOpen ? t("closeMenu") : t("openMenu")}
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-[3px] border-border md:hidden"
          >
            <ul className="flex flex-col p-3">
              {navRoutes.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <li key={route.href}>
                    <Link
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-3 text-sm font-black uppercase",
                        isActive ? "bg-accent-4 text-fg" : "text-muted",
                      )}
                    >
                      {t(route.key)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
