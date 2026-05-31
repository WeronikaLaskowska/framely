import Link, { type LinkProps } from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { buttonVariantClass, type ButtonVariant } from "@/common/ui/buttonVariants";

type ButtonLinkProps = LinkProps & {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
};

/** A next/link rendered with the pixel-art button skin. */
export const ButtonLink = ({
  variant = "ghost",
  className,
  children,
  ...props
}: ButtonLinkProps) => (
  <Link className={cn(buttonVariantClass[variant], className)} {...props}>
    {children}
  </Link>
);
