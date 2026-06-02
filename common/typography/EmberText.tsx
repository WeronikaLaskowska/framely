import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const EmberText = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => <span className={cn("fr-ember-text", className)}>{children}</span>;
