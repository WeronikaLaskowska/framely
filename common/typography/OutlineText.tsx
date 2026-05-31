import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Hollow, stroked text used for the hero and step numerals. */
export const OutlineText = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <span className={cn("fr-outline-text", className)}>{children}</span>;
