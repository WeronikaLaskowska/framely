import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Monospace numeric read-out (years, streaks, "Guess 3 / 8"). */
export const Counter = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("fr-counter", className)} {...props} />
);
