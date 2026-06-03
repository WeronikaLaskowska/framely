import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Caption = ({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn(
      "text-center text-xs uppercase tracking-widest text-fr-fg-subtle",
      className,
    )}
    {...props}
  />
);
