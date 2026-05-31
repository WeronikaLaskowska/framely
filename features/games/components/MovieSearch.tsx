"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import type { MovieLite } from "@/models/movie";
import { useDebouncedValue } from "@/lib/hooks/useDebouncedValue";
import { useListboxNavigation } from "@/lib/hooks/useListboxNavigation";
import { useMovieSearchQuery } from "@/queries/movie.queries";
import { MovieSearchCard } from "@/features/games/components/MovieSearchCard";

type MovieSearchProps = {
  onSelect: (movie: MovieLite) => void;
  disabled?: boolean;
  /** Movie ids already guessed — shown dimmed and not selectable. */
  excludeIds?: number[];
  placeholder?: string;
  /** Restrict autocomplete to a single TMDB genre id (Spotle by genre). */
  genre?: number;
};

/**
 * Debounced title autocomplete backed by useMovieSearchQuery. Picking a result
 * fires onSelect and clears the field. Keyboard: ↑/↓ to move, Enter to choose.
 */
export const MovieSearch = ({
  onSelect,
  disabled,
  excludeIds = [],
  placeholder = "Guess a movie…",
  genre,
}: MovieSearchProps) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [lastDebounced, setLastDebounced] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const debounced = useDebouncedValue(query, 160);
  const { data: results = [], isFetching, isError } = useMovieSearchQuery(debounced, genre);

  const choose = (movie: MovieLite) => {
    if (excludeIds.includes(movie.id)) return;
    onSelect(movie);
    setQuery("");
    setOpen(false);
  };

  const { active, setActive, onKeyDown } = useListboxNavigation({
    items: results,
    isOpen: open,
    onChoose: choose,
    onClose: () => setOpen(false),
  });

  // Adjust state during render (React's recommended alternative to an effect)
  // whenever the debounced term settles: reset the highlight and open the list.
  if (debounced !== lastDebounced) {
    setLastDebounced(debounced);
    setActive(0);
    if (debounced.trim().length >= 2) setOpen(true);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-3 border-2 border-fr-border-strong bg-fr-surface/80 px-4 py-3 backdrop-blur transition-colors focus-within:border-fr-flame/60">
        <span className="text-fr-fg-subtle">
          {isFetching ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </span>
        <input
          value={query}
          disabled={disabled}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => results.length && setOpen(true)}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="w-full bg-transparent text-fr-fg placeholder:text-fr-fg-subtle focus:outline-none disabled:opacity-50"
        />
      </div>

      {open && (results.length > 0 || isFetching || isError) && (
        <MovieSearchCard
          id={listId}
          results={results}
          isFetching={isFetching}
          isError={isError}
          activeIndex={active}
          excludeIds={excludeIds}
          onHover={setActive}
          onSelect={choose}
        />
      )}
    </div>
  );
};
