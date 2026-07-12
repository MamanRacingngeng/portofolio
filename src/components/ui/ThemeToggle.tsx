"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[3px] border-border bg-card text-fg outline-none transition-colors [-webkit-tap-highlight-color:transparent] hover:bg-accent hover:text-white active:bg-accent active:text-white focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
      aria-label={theme === "light" ? t("dark") : t("light")}
    >
      {theme === "light" ? <Moon size={16} strokeWidth={2.25} /> : <Sun size={16} strokeWidth={2.25} />}
    </button>
  );
}
