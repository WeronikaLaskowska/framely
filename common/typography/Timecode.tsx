import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Timecode = ({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span className={cn("fr-timecode", className)} {...props} />
);
