import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/cn";

type CardProps<T extends ElementType> = {
  as?: T;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className">;

export const Card = <T extends ElementType = "div">({
  as,
  className,
  ...props
}: CardProps<T>) => {
  const Tag = as ?? "div";
  return <Tag className={cn("fr-card", className)} {...props} />;
};
