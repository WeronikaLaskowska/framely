import type { MovieLite } from "@/models/movie";
import { type RawDiscover, tmdbFetch, toLite } from "@/lib/server/tmdbClient";

export const searchMovies = async (
  query: string,
  genre?: number,
): Promise<MovieLite[]> => {
  if (!query.trim()) return [];
  const [p1, p2, p3] = await Promise.all([
    tmdbFetch<RawDiscover>("/search/movie", { query, include_adult: "false", page: 1 }, 0),
    tmdbFetch<RawDiscover>("/search/movie", { query, include_adult: "false", page: 2 }, 0),
    tmdbFetch<RawDiscover>("/search/movie", { query, include_adult: "false", page: 3 }, 0),
  ]);
  let all = [...p1.results, ...p2.results, ...p3.results];
  if (genre) all = all.filter((m) => m.genre_ids?.includes(genre));
  return all
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .map(toLite)
    .filter((m) => m.year !== null && m.year >= 1980)
    .slice(0, 8);
};
