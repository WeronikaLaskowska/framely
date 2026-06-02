import { RotateCcw, PartyPopper, Flag } from "lucide-react";
import type { MovieFacts } from "@/models/movie";
import { tmdbImage, formatMoney, formatRating } from "@/lib/format";
import { Card } from "@/common/ui/Card";
import { Button } from "@/common/ui/Button";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { Counter } from "@/common/typography/Counter";

type ResultBannerProps = {
  won: boolean;
  target: MovieFacts;
  detail?: string;
  points?: number | null;
  onPlayAgain: () => void;
};

export const ResultBanner = ({ won, target, detail, points, onPlayAgain }: ResultBannerProps) => {
  const poster = tmdbImage(target.posterPath, "w342");
  return (
    <Card className="fr-pop relative overflow-hidden p-6 md:p-8">
      <div className="flex flex-col gap-6 md:flex-row">
        {poster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={target.title}
            className="mx-auto aspect-2/3 w-40 shrink-0 self-start rounded-xl border border-fr-border-strong object-cover shadow-2xl md:mx-0"
          />
        )}
        <div className="flex flex-col">
          <span
            className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
              won ? "bg-fr-correct/15 text-fr-correct" : "bg-fr-close/15 text-fr-close"
            }`}
          >
            {won ? <PartyPopper size={14} /> : <Flag size={14} />}
            {won ? "Solved" : "Revealed"}
          </span>

          {won && points != null && points > 0 && (
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 bg-fr-flame/15 px-3 py-1 text-sm font-semibold text-fr-flame">
              +{points} pts
            </span>
          )}

          <DisplayHeading as="h2" className="mt-3 text-3xl md:text-4xl">
            {target.title}
          </DisplayHeading>
          <p className="mt-1 text-fr-fg-muted">
            {target.year ?? "—"} · {target.genres.map((g) => g.name).join(", ")}
          </p>
          {detail && <Counter className="mt-1">{detail}</Counter>}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-fr-fg-muted">
            <span>Box office: {formatMoney(target.revenue)}</span>
            <span>Rating: {formatRating(target.rating)}</span>
            {target.studio && <span>Studio: {target.studio.name}</span>}
          </div>
          {target.cast.length > 0 && (
            <p className="mt-1 text-sm text-fr-fg-subtle">
              Starring {target.cast.slice(0, 3).map((c) => c.name).join(", ")}
            </p>
          )}

          <Button variant="ember" onClick={onPlayAgain} className="mt-6 w-fit px-6 py-3">
            <RotateCcw size={16} /> Play again
          </Button>
        </div>
      </div>
    </Card>
  );
};
