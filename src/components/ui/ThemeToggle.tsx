"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("theme");
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "theme-toggle pop-btn relative h-10 w-10 shrink-0 overflow-hidden",
        isLight ? "bg-accent-4 text-fg" : "bg-accent-2 text-fg",
      )}
      aria-label={isLight ? t("dark") : t("light")}
      aria-pressed={!isLight}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -72, scale: 0.45 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 72, scale: 0.45 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isLight ? (
            <Moon size={18} strokeWidth={2.75} aria-hidden />
          ) : (
            <Sun size={18} strokeWidth={2.75} aria-hidden />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
