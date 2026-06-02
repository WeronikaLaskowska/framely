import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionTitleProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

export const SectionTitle = ({
  as: Tag = "h2",
  className,
  children,
}: SectionTitleProps) => (
  <Tag className={cn("fr-section-title", className)}>{children}</Tag>
);
