import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Counter = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("fr-counter", className)} {...props} />
);
