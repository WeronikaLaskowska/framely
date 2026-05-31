import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionTitleProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** The pixel-art heading used to introduce a section. Defaults to an h2. */
export const SectionTitle = ({
  as: Tag = "h2",
  className,
  children,
}: SectionTitleProps) => (
  <Tag className={cn("fr-section-title", className)}>{children}</Tag>
);
