import type { ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { AttributeResult, Verdict } from "@/models/guess";
import { cn } from "@/lib/cn";
import { Timecode } from "@/common/typography/Timecode";

const TILE_VERDICT: Record<Verdict, string> = {
  correct: "fr-tile--correct",
  close: "fr-tile--close",
  wrong: "fr-tile--wrong",
};

type GuessAttributeTileProps = {
  label: string;
  result: AttributeResult;
  children: ReactNode;
};

/** One attribute cell in a guess dossier, coloured by its verdict. */
export const GuessAttributeTile = ({
  label,
  result,
  children,
}: GuessAttributeTileProps) => (
  <div
    className={cn(
      "fr-tile flex min-h-[68px] flex-col items-center justify-center gap-1 px-2 py-2.5 text-center",
      TILE_VERDICT[result.verdict],
    )}
  >
    <Timecode className="text-[8px]">{label}</Timecode>
    <span className="flex items-center gap-1 text-sm font-semibold leading-tight">
      {children}
      {result.direction === "up" && <ArrowUp size={13} className="shrink-0" />}
      {result.direction === "down" && <ArrowDown size={13} className="shrink-0" />}
    </span>
  </div>
);
