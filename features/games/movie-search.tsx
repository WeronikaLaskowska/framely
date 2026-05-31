"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search, Loader2, Film } from "lucide-react";
import type { MovieLite } from "@/lib/types";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";

type MovieSearchProps = {
  onSelect: (movie: MovieLite) => void;
  disabled?: boolean;
  /** Movie ids already guessed — shown dimmed and not selectable. */
  excludeIds?: number[];
  placeholder?: string;
};

/**
 * Debounced title autocomplete backed by /api/movies/search. Picking a result
 * fires onSelect and clears the field. Keyboard: ↑/↓ to move, Enter to choose.
 */
export function MovieSearch({
  onSelect,
  disabled,
  excludeIds = [],
  placeholder = "Guess a movie…",
}: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MovieLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/movies/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((data: { results?: MovieLite[] }) => {
          setResults(data.results ?? []);
          setActive(0);
          setOpen(true);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 160);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function choose(movie: MovieLite) {
    if (excludeIds.includes(movie.id)) return;
    onSelect(movie);
    setQuery("");
    setResults([]);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[active];
      if (pick) choose(pick);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex items-center gap-3 border-2 border-fr-border-strong bg-fr-surface/80 px-4 py-3 backdrop-blur transition-colors focus-within:border-fr-flame/60">
        <span className="text-fr-fg-subtle">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
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

      {open && (results.length > 0 || loading) && (
        <ul
          id={listId}
          role="listbox"
          className="fr-card fr-pop absolute z-40 mt-2 max-h-80 w-full overflow-auto p-1.5"
        >
          {results.length === 0 && loading && (
            <li className="flex items-center gap-2 px-3 py-3 text-sm text-fr-fg-subtle">
              <Loader2 size={15} className="animate-spin" /> Searching…
            </li>
          )}
          {results.map((m, i) => {
            const used = excludeIds.includes(m.id);
            const poster = tmdbImage(m.posterPath, "w92");
            return (
              <li key={m.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  disabled={used}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(m)}
                  className={cn(
                    "flex w-full items-center gap-3 px-2 py-2 text-left text-sm transition-colors duration-100",
                    !used && "cursor-pointer",
                    i === active && !used && "bg-fr-surface-2",
                    used && "cursor-not-allowed opacity-40",
                  )}
                >
                  <span className="relative h-12 w-8 shrink-0 overflow-hidden border border-fr-border-strong bg-fr-surface-2">
                    {poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={poster}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-fr-fg-subtle">
                        <Film size={14} />
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 truncate text-fr-fg">{m.title}</span>
                  {m.year && (
                    <span className="fr-counter ml-auto shrink-0">{m.year}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
