"use client";

import { useScroll, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-gradient-to-r from-accent-2 via-accent-4 to-accent-3"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
