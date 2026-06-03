import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const MutedText = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-sm text-fr-fg-muted", className)} {...props} />
);
