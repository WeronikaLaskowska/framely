import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Inline word highlight with the animated gold→orange wordmark gradient. */
export const EmberText = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <span className={cn("fr-ember-text", className)}>{children}</span>;
