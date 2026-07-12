"use client";

import { useEffect, useMemo, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

const COLORS = ["bg-accent-2", "bg-accent-3", "bg-accent-4", "bg-accent"];
const SIZES = [8, 10, 12, 9, 11, 7, 10, 8];
const PATH_STEPS = 120;
const DOT_COUNT = 72;
const TRAVEL_DURATION = 28;
const PATH_START = -8;
const PATH_END = 108;

type PathPoint = { x: number; y: number };

function waveY(t: number, seed: number) {
  return (
    50 +
    Math.sin(t * Math.PI * 5 + seed * 0.15) * 12 +
    Math.sin(t * Math.PI * 2.2 + seed * 0.08) * 5
  );
}

function buildSnakePath(seed: number): PathPoint[] {
  const span = PATH_END - PATH_START;

  return Array.from({ length: PATH_STEPS }, (_, i) => {
    const x = PATH_START + (i / (PATH_STEPS - 1)) * span;
    const t = (x - PATH_START) / span;
    return { x, y: waveY(t, seed) };
  });
}

function interpolatePath(path: PathPoint[], amount: number) {
  const clamped = ((amount % 1) + 1) % 1;
  const idx = clamped * (path.length - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, path.length - 1);
  const frac = idx - i0;

  return {
    x: path[i0].x + (path[i1].x - path[i0].x) * frac,
    y: path[i0].y + (path[i1].y - path[i0].y) * frac,
  };
}

function PolkaDot({
  index,
  progress,
  path,
  seed,
}: {
  index: number;
  progress: MotionValue<number>;
  path: PathPoint[];
  seed: number;
}) {
  const spacing = 1 / DOT_COUNT;

  const left = useTransform(progress, (p) => {
    const t = (index * spacing + p) % 1;
    return `${interpolatePath(path, t).x}%`;
  });

  const top = useTransform(progress, (p) => {
    const t = (index * spacing + p) % 1;
    return `${interpolatePath(path, t).y}%`;
  });

  const size = SIZES[(index + seed) % SIZES.length];

  return (
    <motion.span
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-border shadow-[1.5px_1.5px_0_var(--border)]",
        COLORS[(index + seed) % COLORS.length],
        index % 4 === 0 ? "border-[3px]" : "border-2",
      )}
      style={{
        left,
        top,
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
}

export function WavyPolkaDivider({
  className,
  seed = 0,
}: {
  className?: string;
  seed?: number;
}) {
  const [mounted, setMounted] = useState(false);
  const progress = useMotionValue(0);
  const path = useMemo(() => buildSnakePath(seed), [seed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const controls = animate(progress, [0, 1], {
      duration: TRAVEL_DURATION,
      repeat: Infinity,
      ease: "linear",
    });

    return () => {
      controls.stop();
    };
  }, [mounted, progress, seed]);

  return (
    <div aria-hidden className={cn("w-full py-10 sm:py-12", className)}>
      <div className="relative left-1/2 h-20 w-screen -translate-x-1/2 overflow-hidden sm:h-24">
        {mounted
          ? Array.from({ length: DOT_COUNT }, (_, index) => (
              <PolkaDot
                key={index}
                index={index}
                progress={progress}
                path={path}
                seed={seed}
              />
            ))
          : null}
      </div>
    </div>
  );
}
