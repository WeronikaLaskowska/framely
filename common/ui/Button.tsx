import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import { buttonVariantClass, type ButtonVariant } from "@/common/ui/buttonVariants";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export const Button = ({ variant = "ghost", className, ...props }: ButtonProps) => (
  <button className={cn(buttonVariantClass[variant], className)} {...props} />
);
