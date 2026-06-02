import type { HiloCard } from "@/models/hilo";
import {
  DISCOVER_PAGE_RANGE,
  MIN_TARGET_REVENUE,
  type RawDetails,
  type RawMovie,
  rawDiscover,
  tmdbFetch,
  yearOf,
} from "@/lib/server/tmdbClient";

const shuffle = <T>(arr: T[]): T[] => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getMovieScore = async (id: number): Promise<HiloCard> => {
  const d = await tmdbFetch<RawDetails>(`/movie/${id}`);
  return {
    id: d.id,
    title: d.title,
    year: yearOf(d.release_date),
    posterPath: d.poster_path,
    revenue: d.revenue ?? 0,
    rating: d.vote_average ?? 0,
  };
};

export const getHiloDeck = async (size = 30): Promise<HiloCard[]> => {
  const first = await rawDiscover(1);
  const totalPages = Math.min(first.total_pages || 1, DISCOVER_PAGE_RANGE);

  const pages = new Set<number>([1]);
  while (pages.size < Math.min(6, totalPages)) {
    pages.add(1 + Math.floor(Math.random() * totalPages));
  }
  const datas = await Promise.all(
    [...pages].map((p) => (p === 1 ? Promise.resolve(first) : rawDiscover(p))),
  );

  const byId = new Map<number, RawMovie>();
  for (const d of datas) {
    for (const m of d.results) if (m.poster_path) byId.set(m.id, m);
  }

  // Over-sample ids since some films report no box office, then trim.
  const ids = shuffle([...byId.keys()]).slice(0, size * 2);
  const cards = await Promise.all(ids.map((id) => getMovieScore(id)));
  const usable = cards.filter((c) => c.revenue >= MIN_TARGET_REVENUE && c.rating > 0);
  return shuffle(usable).slice(0, size);
};
