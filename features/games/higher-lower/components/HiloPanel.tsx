import type { ReactNode } from "react";
import type { HiloCard } from "@/models/hilo";
import { Card } from "@/common/ui/Card";
import { Poster } from "@/common/ui/Poster";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { Counter } from "@/common/typography/Counter";

type HiloPanelProps = {
  card: HiloCard;
  caption: string;
  /** Revealed stat text, or null while hidden. */
  valueText: string | null;
  /** true = correct, false = wrong, null = not yet judged. */
  outcome?: boolean | null;
  children?: ReactNode;
};

const outcomeBorder = (outcome?: boolean | null) =>
  outcome === true ? "border-fr-correct" : outcome === false ? "border-fr-close" : "border-fr-border-strong";

const outcomeText = (outcome?: boolean | null) =>
  outcome === true ? "text-fr-correct" : outcome === false ? "text-fr-close" : "text-fr-fg";

/** One film card in the Higher or Lower comparison. */
export const HiloPanel = ({ card, caption, valueText, outcome, children }: HiloPanelProps) => {
  return (
    <Card className={`flex flex-col overflow-hidden border-2 p-0 transition-colors ${outcomeBorder(outcome)}`}>
      <div className="relative aspect-2/3 w-full bg-black/40">
        <Poster path={card.posterPath} alt={card.title} size="w342" iconSize={40} />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-fr-fg-subtle">
          {caption}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <DisplayHeading as="h3" className="text-base leading-tight md:text-lg">
          {card.title}
        </DisplayHeading>
        <Counter className="mt-1">{card.year ?? "—"}</Counter>

        <div className="mt-3 min-h-7">
          {valueText !== null ? (
            <p className={`fr-display text-xl md:text-2xl ${outcomeText(outcome)}`}>{valueText}</p>
          ) : (
            <p className="fr-display text-xl text-fr-fg-subtle md:text-2xl">???</p>
          )}
        </div>

        {children}
      </div>
    </Card>
  );
};
