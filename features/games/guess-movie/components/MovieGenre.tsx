import { cn } from "@/lib/cn";

const CHIP_MATCHED = "border-fr-correct-border bg-fr-correct-bg text-fr-correct";
const CHIP_UNMATCHED = "border-fr-border-strong bg-white/[0.02] text-fr-fg-muted";

type MovieGenreProps = {
  name: string;
  matched: boolean;
};

export const MovieGenre = ({ name, matched }: MovieGenreProps) => (
  <span
    className={cn(
      "border-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
      matched ? CHIP_MATCHED : CHIP_UNMATCHED,
    )}
  >
    {name}
  </span>
);
