import type { ReactNode } from "react";
import { BackLink } from "@/common/ui/BackLink";

type GameTopBarProps = {
  backHref: string;
  backLabel?: string;
  right?: ReactNode;
};

export const GameTopBar = ({ backHref, backLabel = "Games", right }: GameTopBarProps) => (
  <div className="flex items-center justify-between gap-4">
    <BackLink href={backHref} label={backLabel} />
    {right}
  </div>
);
