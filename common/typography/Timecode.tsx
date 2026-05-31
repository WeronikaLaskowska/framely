import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Monospace, upper-case "timecode" label (eyebrows, captions, marquee items). */
export const Timecode = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("fr-timecode", className)} {...props} />
);
