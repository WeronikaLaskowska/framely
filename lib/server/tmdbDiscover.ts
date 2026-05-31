/** Server-only: picking well-known secret target movies (>= 1980). */
import type { MovieLite } from "@/models/movie";
import {
  DISCOVER_PAGE_RANGE,
  MIN_TARGET_REVENUE,
  type RawMovie,
  rawDiscover,
  toLite,
} from "@/lib/server/tmdbClient";
import { getMovieFacts } from "@/lib/server/tmdbFacts";

/**
 * Discover a pool of well-known movies (>= 1980), ordered by popularity.
 * `requirePoster` keeps entries that have artwork (needed by the poster game).
 */
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

/** Pick one random popular movie, optionally constrained to a genre. */
export const randomPopularMovie = async (
  requirePoster = false,
  genre?: number,
): Promise<MovieLite> => {
  const first = await rawDiscover(1, genre);
  const totalPages = Math.min(first.total_pages || 1, DISCOVER_PAGE_RANGE);
  const page = 1 + Math.floor(Math.random() * totalPages);
  const data = page === 1 ? first : await rawDiscover(page, genre);

  const pick = (movies: RawMovie[]): MovieLite | null => {
    const pool = requirePoster ? movies.filter((m) => m.poster_path) : movies;
    if (pool.length === 0) return null;
    return toLite(pool[Math.floor(Math.random() * pool.length)]);
  };

  return pick(data.results) ?? pick(first.results) ?? toLite(first.results[0]);
};

/**
 * Pick a secret target id that is both recent enough (>= 1980) and a real
 * box-office title (>= MIN_TARGET_REVENUE) so the answer is never obscure.
 * TMDB's discover endpoint can't filter on revenue, so we sample popular
 * candidates and verify their facts, retrying a few times before falling back.
 */
export const pickTargetMovieId = async (
  maxAttempts = 8,
  genre?: number,
): Promise<number> => {
  let fallback: number | null = null;
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = await randomPopularMovie(true, genre);
    if (!candidate) continue;
    fallback ??= candidate.id;
    const facts = await getMovieFacts(candidate.id);
    const recent = (facts.year ?? 0) >= 1980;
    if (recent && facts.revenue >= MIN_TARGET_REVENUE) return facts.id;
  }
  if (fallback !== null) return fallback;
  return (await randomPopularMovie(true, genre)).id;
};
