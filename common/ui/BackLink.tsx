import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const BackLink = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="inline-flex items-center gap-2 text-sm text-fr-fg-muted transition-colors hover:text-fr-fg"
  >
    <ArrowLeft size={15} /> {label}
  </Link>
);
