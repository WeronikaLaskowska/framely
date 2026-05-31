import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Grainy film-stock text fill used in the hero wordmark. */
export const StockText = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <span className={cn("fr-stock-text", className)}>{children}</span>;
