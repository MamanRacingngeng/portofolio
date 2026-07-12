"use client";

import { useScroll, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-[3px] origin-left bg-fg"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
