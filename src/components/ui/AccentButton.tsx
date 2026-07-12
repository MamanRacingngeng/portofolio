"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface AccentButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

const variants: Record<ButtonVariant, string> = {
  primary: "pop-btn pop-btn-primary",
  secondary: "pop-btn pop-btn-secondary",
  ghost: "pop-btn pop-btn-ghost",
};

function isAppRoute(href: string) {
  return (
    href.startsWith("/") &&
    !href.startsWith("/cv") &&
    !href.endsWith(".pdf") &&
    !href.endsWith(".zip")
  );
}

export function AccentButton({
  variant = "primary",
  href,
  children,
  className,
  type = "button",
  onClick,
}: AccentButtonProps) {
  const classes = cn("px-5 py-2.5", variants[variant], className);

  if (href) {
    if (isAppRoute(href)) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
