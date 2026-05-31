import type { MovieLite } from "@/models/movie";
import { cn } from "@/lib/cn";
import { Counter } from "@/common/typography/Counter";
import { Poster } from "@/common/ui/Poster";

type MovieSearchOptionProps = {
  movie: MovieLite;
  active: boolean;
  /** Already guessed — dimmed and not selectable. */
  used: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export const MovieSearchOption = ({
  movie,
  active,
  used,
  onSelect,
  onHover,
}: MovieSearchOptionProps) => {
  return (
    <li role="option" aria-selected={active}>
      <button
        type="button"
        disabled={used}
        onMouseEnter={onHover}
        onClick={onSelect}
        className={cn(
          "flex w-full items-center gap-3 px-2 py-2 text-left text-sm transition-colors duration-100",
          !used && "cursor-pointer",
          active && !used && "bg-fr-surface-2",
          used && "cursor-not-allowed opacity-40",
        )}
      >
        <span className="relative h-12 w-8 shrink-0 overflow-hidden border border-fr-border-strong bg-fr-surface-2">
          <Poster path={movie.posterPath} alt="" size="w92" iconSize={14} />
        </span>
        <span className="min-w-0 truncate text-fr-fg">{movie.title}</span>
        {movie.year && <Counter className="ml-auto shrink-0">{movie.year}</Counter>}
      </button>
    </li>
  );
};
