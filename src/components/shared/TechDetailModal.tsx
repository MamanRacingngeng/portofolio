"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { TechItem } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface TechDetailModalProps {
  tech: TechItem | null;
  onClose: () => void;
}

function ModalTechIcon({ tech }: { tech: TechItem }) {
  if (tech.logo) {
    const scale = tech.logoScale ?? 1;

    return (
      <div className="relative flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
        <Image
          src={tech.logo}
          alt=""
          width={64}
          height={64}
          unoptimized
          className={cn(
            "max-h-full max-w-full object-contain",
            tech.logoBlend === "multiply" && "mix-blend-multiply",
          )}
          style={
            scale !== 1
              ? { transform: `scale(${scale})`, transformOrigin: "center" }
              : undefined
          }
        />
      </div>
    );
  }

  return <span className="text-3xl sm:text-4xl">{tech.icon}</span>;
}

export function TechDetailModal({ tech, onClose }: TechDetailModalProps) {
  const t = useTranslations("tech");

  useEffect(() => {
    if (!tech) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [tech, onClose]);

  const displayName = tech?.labelLines
    ? tech.labelLines.join(" ")
    : tech?.name ?? "";

  return (
    <AnimatePresence>
      {tech ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6"
          role="presentation"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-fg/60 backdrop-blur-[2px]" aria-hidden />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tech-modal-title"
            initial={{ opacity: 0, y: 32, scale: 0.94, rotate: -1 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: 24, scale: 0.96, rotate: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="relative z-10 w-full max-w-lg border-[3px] border-border bg-card shadow-[8px_8px_0_var(--shadow)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="pop-btn absolute -right-2 -top-2 z-20 flex h-10 w-10 items-center justify-center bg-accent-3 text-fg sm:-right-3 sm:-top-3"
            >
              <X size={18} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-4 border-b-[3px] border-border p-5 sm:gap-5 sm:p-6">
              <div className="sticker flex shrink-0 items-center justify-center bg-accent-3 p-3 sm:p-3.5">
                <ModalTechIcon tech={tech} />
              </div>
              <h2
                id="tech-modal-title"
                className="font-display text-xl font-black uppercase leading-tight tracking-tight sm:text-2xl"
              >
                {displayName}
              </h2>
            </div>

            <div className="p-5 sm:p-6">
              <div className="border-[3px] border-border bg-accent-2 p-4 sm:p-5">
                <p className="text-sm font-medium leading-relaxed text-fg sm:text-base">
                  {t(`items.${tech.id}.description`)}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
