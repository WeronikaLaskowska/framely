import { Loader2 } from "lucide-react";
import type { MovieLite } from "@/models/movie";
import { Card } from "@/common/ui/Card";
import { MovieSearchOption } from "@/features/games/components/MovieSearchOption";

type MovieSearchCardProps = {
  id: string;
  results: MovieLite[];
  isFetching: boolean;
  isError: boolean;
  activeIndex: number;
  excludeIds: number[];
  onHover: (index: number) => void;
  onSelect: (movie: MovieLite) => void;
};

export const MovieSearchCard = ({
  id,
  results,
  isFetching,
  isError,
  activeIndex,
  excludeIds,
  onHover,
  onSelect,
}: MovieSearchCardProps) => (
  <Card
    as="ul"
    id={id}
    role="listbox"
    className="fr-pop absolute z-40 mt-2 max-h-80 w-full overflow-auto p-1.5"
  >
    {results.length === 0 && isFetching && (
      <li className="flex items-center gap-2 px-3 py-3 text-sm text-fr-fg-subtle">
        <Loader2 size={15} className="animate-spin" /> Searching…
      </li>
    )}
    {results.length === 0 && !isFetching && isError && (
      <li className="px-3 py-3 text-sm text-fr-close">
        Couldn&apos;t load suggestions. Keep typing to retry.
      </li>
    )}
    {results.map((movie, i) => (
      <MovieSearchOption
        key={movie.id}
        movie={movie}
        active={i === activeIndex}
        used={excludeIds.includes(movie.id)}
        onHover={() => onHover(i)}
        onSelect={() => onSelect(movie)}
      />
    ))}
  </Card>
);
