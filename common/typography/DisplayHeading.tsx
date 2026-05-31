import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type DisplayHeadingProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
};

/** Large pixel-art display heading (the game/hero titles). */
export const DisplayHeading = ({
  as: Tag = "h1",
  className,
  children,
}: DisplayHeadingProps) => (
  <Tag className={cn("fr-display", className)}>{children}</Tag>
);
