import type { ReactNode } from "react";
import { Badge } from "@/common/ui/Badge";
import { DisplayHeading } from "@/common/typography/DisplayHeading";

type GameHeaderProps = {
  badge?: ReactNode;
  title: ReactNode;
  blurb?: ReactNode;
};

export const GameHeader = ({ badge, title, blurb }: GameHeaderProps) => (
  <header className="mt-6">
    {badge && <Badge>{badge}</Badge>}
    <DisplayHeading className="mt-4 text-[clamp(2.25rem,6vw,3.75rem)]">
      {title}
    </DisplayHeading>
    {blurb && <p className="mt-2 max-w-xl text-sm text-fr-fg-muted">{blurb}</p>}
  </header>
);
