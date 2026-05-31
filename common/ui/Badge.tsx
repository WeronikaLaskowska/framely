import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Pixel-art "tape" chip used for section eyebrows (e.g. "Genre · Action"). */
export const Badge = ({ className, ...props }: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("fr-tape", className)} {...props} />
);
