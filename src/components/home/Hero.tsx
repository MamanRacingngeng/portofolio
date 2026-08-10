"use client";

import { useState } from "react";
import { useTranslations, useMessages } from "next-intl";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Image from "next/image";
import { siteConfig } from "@/data/portfolio";
import { AccentButton } from "@/components/ui/AccentButton";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import {
  revealViewport,
  scrollRevealPop,
  scrollRevealStaggerContainer,
  scrollRevealStaggerItem,
  spaceFloat,
  spaceFloatGentle,
  spaceFloatTilt,
} from "@/lib/animations";
import { cn } from "@/lib/utils";
import { WavyPolkaDivider } from "@/components/ui/WavyPolkaDivider";

export function Hero() {
  const t = useTranslations("hero");
  const hero = useMessages().hero as {
    taglineLines: string[];
    bio: string;
  };
  const taglineLines = hero.taglineLines;
  const [bioVisible, setBioVisible] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 48) setBioVisible(true);
  });

  return (
    <section
      className={cn(
        "page-section relative overflow-x-clip pt-14 sm:pt-20 lg:pt-24",
        siteConfig.showWavyPolkaDivider ? "pb-0" : "pb-14 sm:pb-16 lg:pb-20",
      )}
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="relative">
          <div className="min-w-0 sm:max-w-[calc(100%-17.5rem)] md:max-w-[calc(100%-19rem)] lg:max-w-[calc(100%-21rem)] sm:pt-6 md:pt-8 lg:pt-10">
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="relative inline-block"
            >
              <motion.span
                aria-hidden
                {...spaceFloatGentle(12, 0.2)}
                className="pointer-events-none absolute -right-2 -top-2 z-10 h-4 w-4 rounded-full border-[3px] border-border bg-accent-2 shadow-[2px_2px_0_var(--border)] sm:-right-3 sm:-top-3 sm:h-5 sm:w-5"
              />
              <motion.div
                {...spaceFloatTilt(8, 0)}
                className="sticker mb-10 inline-block bg-accent-3 px-4 py-2 text-xs font-black uppercase tracking-widest text-fg sm:mb-12 sm:text-sm"
              >
                {t("badge")}
              </motion.div>
            </motion.div>

            <motion.div {...spaceFloat(9, 0.4)}>
              <motion.h1
                initial={false}
                animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                transition={{
                  delay: 0.08,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-5xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
              >
                <motion.span
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 100 }}
                  className="block"
                >
                  {siteConfig.firstName}
                </motion.span>
                <motion.span
                  initial={false}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.28, type: "spring", stiffness: 100 }}
                  className="mt-1 block"
                >
                  <span className="name-highlight">{siteConfig.lastName}</span>
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-xl border-l-[5px] border-accent-2 pl-4 sm:mt-6 sm:pl-5"
            >
              <p className="font-display text-[0.975rem] font-bold leading-[1.35] text-muted sm:text-lg sm:leading-[1.4]">
                {taglineLines.map((line, index) => (
                  <span key={`${index}-${line}`} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={false}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.12, type: "spring", stiffness: 90, damping: 14 }}
            className="relative z-0 mx-auto mb-8 mt-10 w-full max-w-[280px] shrink-0 sm:absolute sm:right-0 sm:bottom-0 sm:mx-0 sm:mb-0 sm:mt-0 sm:w-[260px] md:w-[280px] lg:w-[300px]"
          >
            <div className="group/profile relative">
              <div
                aria-hidden
                className="absolute right-0 top-0 h-full w-full translate-x-2.5 translate-y-2.5 border-[3px] border-border bg-fg sm:translate-x-3 sm:translate-y-3"
              />
              <div className="brutal-card relative overflow-hidden bg-card">
                <Image
                  src={siteConfig.profileImage}
                  alt={`${siteConfig.firstName} ${siteConfig.lastName}`}
                  width={300}
                  height={400}
                  className="aspect-[3/4] h-auto w-full object-cover object-top grayscale transition-all duration-500 group-active/profile:grayscale-0 group-focus-within/profile:grayscale-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/profile:grayscale-0"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 280px, 300px"
                />
              </div>
              <motion.span
                {...spaceFloatTilt(7, 0)}
                className="sticker absolute -bottom-3 left-3 max-w-[calc(100%-1.5rem)] bg-accent-2 px-3 py-1.5 text-[10px] font-black uppercase leading-tight sm:-bottom-4 sm:left-4 sm:px-4 sm:py-2 sm:text-xs"
              >
                {t("status")}
              </motion.span>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={scrollRevealPop}
          initial="hidden"
          animate={bioVisible ? "visible" : "hidden"}
          className="brutal-card relative z-10 mt-6 bg-card p-5 sm:mt-10 sm:p-7 lg:p-8"
        >
          <p className="text-pretty text-justify text-[0.975rem] font-medium leading-[1.8] text-fg sm:text-lg sm:leading-[1.85]">
            {hero.bio}
          </p>
        </motion.div>

        <motion.div
          variants={scrollRevealStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="relative z-0 mt-5 grid grid-cols-2 items-stretch gap-3 sm:mt-6 sm:flex sm:flex-wrap sm:items-center sm:gap-4"
        >
          <motion.div variants={scrollRevealStaggerItem} className="min-w-0">
            <AccentButton
              variant="primary"
              href="/proyek"
              className="w-full justify-center px-3 py-3 text-center text-xs leading-snug sm:w-auto sm:px-6 sm:py-3.5 sm:text-sm"
            >
              {t("exploreProjects")}
            </AccentButton>
          </motion.div>
          <motion.div variants={scrollRevealStaggerItem} className="min-w-0">
            <AccentButton
              variant="secondary"
              href={siteConfig.resumeUrl}
              className="w-full justify-center px-3 py-3 text-center text-xs leading-snug sm:w-auto sm:px-6 sm:py-3.5 sm:text-sm"
            >
              {t("viewCv")}
            </AccentButton>
          </motion.div>
          <motion.div variants={scrollRevealStaggerItem} className="min-w-0">
            <a
              href={siteConfig.social.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("social.githubAria")}
              className="pop-btn flex w-full justify-center bg-card px-3 py-3 text-center text-xs leading-snug text-fg sm:w-auto sm:px-5 sm:py-3.5 sm:text-sm"
            >
              <GithubIcon size={20} />
              {t("social.github")}
            </a>
          </motion.div>
          <motion.div variants={scrollRevealStaggerItem} className="min-w-0">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("social.linkedinAria")}
              className="pop-btn flex w-full justify-center bg-accent-3 px-3 py-3 text-center text-xs leading-snug text-fg sm:w-auto sm:px-5 sm:py-3.5 sm:text-sm"
            >
              <LinkedinIcon size={20} />
              {t("social.linkedin")}
            </a>
          </motion.div>
        </motion.div>
      </div>
      {siteConfig.showWavyPolkaDivider ? <WavyPolkaDivider /> : null}
    </section>
  );
}
