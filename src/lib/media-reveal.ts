import { cn } from "@/lib/utils";

/** Grayscale → color on hover (pointer), touch (active/focus-within), and touch-only devices. */
export const mediaRevealClass =
  "grayscale transition-all duration-500 group-active:grayscale-0 group-focus-within:grayscale-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover:grayscale-0 [@media(hover:none)]:grayscale-0";

export const mediaRevealZoomClass = cn(
  mediaRevealClass,
  "group-active:scale-[1.04] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.04]",
);

export const mediaRevealZoomSmClass = cn(
  mediaRevealClass,
  "group-active:scale-[1.03] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.03]",
);

export const mediaRevealZoomLgClass = cn(
  mediaRevealClass,
  "group-active:scale-[1.05] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.05]",
);

export const mediaRevealOverlayClass =
  "transition-opacity duration-300 group-active:opacity-40 group-focus-within:opacity-40 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-40";
