"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "div";
}

export function TextReveal({
  text,
  className,
  delay = 0,
  as = "span",
}: TextRevealProps) {
  const words = text.split(" ");
  const Wrapper = as;

  return (
    <Wrapper className={cn("inline", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            delay: delay + i * 0.06,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mr-[0.3em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </Wrapper>
  );
}
