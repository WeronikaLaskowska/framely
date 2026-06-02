import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const StockText = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <span className={cn("fr-stock-text", className)}>{children}</span>;
