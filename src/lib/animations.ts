export const spaceFloat = (duration: number, delay = 0) => ({
  animate: {
    y: [0, -10, 6, -8, 0],
    x: [0, 4, -3, 2, 0],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export const spaceFloatTilt = (duration: number, delay = 0) => ({
  animate: {
    y: [0, -8, 5, -6, 0],
    x: [0, 3, -2, 2, 0],
    rotate: [-2, 1, -3, -1, -2],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export const spaceFloatGentle = (duration: number, delay = 0) => ({
  animate: {
    y: [0, -6, 4, -5, 0],
    x: [0, 2, -2, 1, 0],
    rotate: [-1, 0.5, -1.5, 0, -1],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export const spaceFloatVertical = (duration: number, delay = 0) => ({
  animate: {
    y: [0, -6, 4, -5, 0],
  },
  transition: {
    duration,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export const spaceFloatSoft = (duration: number, delay = 0) => ({
  animate: {
    y: [0, -6, 2, -5, 0],
  },
  transition: {
    duration: duration + 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export const spaceFloatPolkadot = (duration: number, delay = 0) => ({
  animate: {
    y: [0, -8, 4, -7, 0],
    x: [0, 4, -3, 2, 0],
    rotate: [-2, 1.5, -2.5, 1, -2],
  },
  transition: {
    duration: duration + 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

export const floatDurations = {
  lime: 8,
  sky: 9.5,
  pink: 10.5,
} as const;

export const hoverFloat = {
  y: [-4, -10, -6, -12, -4],
  x: [0, 4, -3, 2, 0],
  rotate: [-1, 1.5, -2, 0.5, -1],
};

export const hoverFloatTransition = {
  y: { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const },
  x: { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const },
  rotate: { duration: 2.6, repeat: Infinity, ease: "easeInOut" as const },
  backgroundColor: { duration: 0.2 },
  boxShadow: { duration: 0.2 },
};

export const hoverFloatResetTransition = {
  duration: 0.35,
  ease: "easeOut" as const,
};

export const revealViewport = {
  once: true,
  margin: "-60px",
} as const;

export const revealSpring = {
  type: "spring" as const,
  stiffness: 110,
  damping: 16,
  mass: 0.85,
};

export const scrollRevealUp = {
  hidden: {
    opacity: 0,
    y: 72,
    rotate: 1.5,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: revealSpring,
  },
};

export const scrollRevealLeft = {
  hidden: {
    opacity: 0,
    x: -64,
    rotate: -2,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: revealSpring,
  },
};

export const scrollRevealRight = {
  hidden: {
    opacity: 0,
    x: 64,
    rotate: 2,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: revealSpring,
  },
};

export const scrollRevealPop = {
  hidden: {
    opacity: 0,
    y: 48,
    scale: 0.9,
    rotate: -3,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 140,
      damping: 14,
    },
  },
};

export const scrollRevealStaggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const scrollRevealStaggerItem = {
  hidden: {
    opacity: 0,
    y: 36,
    scale: 0.94,
    rotate: -2,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 130,
      damping: 15,
    },
  },
};

export const scrollRevealLine = {
  hidden: {
    opacity: 0,
    x: -24,
    clipPath: "inset(0 100% 0 0)",
  },
  visible: {
    opacity: 1,
    x: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};
