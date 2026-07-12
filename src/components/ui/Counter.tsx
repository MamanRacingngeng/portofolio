"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion, useSpring, useTransform } from "framer-motion";

interface CounterProps {
  value: string;
  className?: string;
}

function parseValue(val: string): { num: number; suffix: string } {
  const match = val.match(/^(\d+)(.*)$/);
  if (!match) return { num: 0, suffix: val };
  return { num: parseInt(match[1], 10), suffix: match[2] };
}

export function Counter({ value, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const { num, suffix } = parseValue(value);
  const motionVal = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(motionVal, (v) => Math.round(v));
  const [shown, setShown] = useState("0");

  useEffect(() => {
    if (isInView) motionVal.set(num);
  }, [isInView, motionVal, num]);

  useEffect(() => {
    return display.on("change", (v) => setShown(String(v)));
  }, [display]);

  return (
    <motion.span ref={ref} className={className}>
      {shown}
      {suffix}
    </motion.span>
  );
}
