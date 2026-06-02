import type { MovieFacts, MovieLite } from "@/models/movie";
import {
  DISCOVER_PAGE_RANGE,
  MIN_TARGET_REVENUE,
  MIN_YEAR,
  type RawMovie,
  rawDiscover,
  toLite,
} from "@/lib/server/tmdbClient";
import { getMovieFacts } from "@/lib/server/tmdbFacts";

export const discoverPopular = async (
  page: number,
  requirePoster = false,
  genre?: number,
): Promise<MovieLite[]> => {
  const data = await rawDiscover(page, genre);
  const results = requirePoster
    ? data.results.filter((m) => m.poster_path)
    : data.results;
  return results.map(toLite);
};

export const randomPopularMovie = async (
  requirePoster = false,
  genre?: number,
): Promise<MovieLite | null> => {
  const first = await rawDiscover(1, genre);
  const totalPages = Math.min(first.total_pages || 1, DISCOVER_PAGE_RANGE);
  const page = 1 + Math.floor(Math.random() * totalPages);
  const data = page === 1 ? first : await rawDiscover(page, genre);

  const pick = (movies: RawMovie[]): MovieLite | null => {
    const pool = requirePoster ? movies.filter((m) => m.poster_path) : movies;
    if (pool.length === 0) return null;
    return toLite(pool[Math.floor(Math.random() * pool.length)]);
  };

  return pick(data.results) ?? pick(first.results);
};

/**
 * Draw random popular films until `select` accepts one (returns non-null), or
 * give up after `maxAttempts`. Each game supplies its own acceptance criteria.
 */
export const pickCandidate = async <T>(
  select: (movieId: number) => Promise<T | null>,
  maxAttempts: number,
  opts: { requirePoster?: boolean; genre?: number } = {},
): Promise<T | null> => {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = await randomPopularMovie(opts.requirePoster, opts.genre);
    if (!candidate) continue;
    const selected = await select(candidate.id);
    if (selected !== null) return selected;
  }
  return null;
};

export const pickTargetMovie = async (
  maxAttempts = 8,
  genre?: number,
): Promise<MovieFacts> => {
  let fallback: MovieFacts | null = null;
  const target = await pickCandidate<MovieFacts>(
    async (movieId) => {
      const facts = await getMovieFacts(movieId);
      fallback ??= facts;
      const recent = facts.year !== null && facts.year >= MIN_YEAR;
      return recent && facts.revenue >= MIN_TARGET_REVENUE ? facts : null;
    },
    maxAttempts,
    { requirePoster: true, genre },
  );
  if (target) return target;
  if (fallback) return fallback;

  const last = await randomPopularMovie(true, genre);
  if (!last) throw new Error("Could not find a film to guess — try again");
  return getMovieFacts(last.id);
};
