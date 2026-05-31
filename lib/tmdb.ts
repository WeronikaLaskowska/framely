/**
 * Server-only TheMovieDB client.
 *
 * Uses the v3 API key (query-param auth). Never import this from a client
 * component — the key must stay on the server. Constraint for every pick:
 * only movies released in 1980 or later.
 *
 * Server-only: this module reads process.env.TMDB_API_KEY and must never be
 * imported from a client component. It is used exclusively by route handlers.
 */
import type {
  CastLite,
  GenreLite,
  HiloCard,
  MovieFacts,
  MovieLite,
} from "@/lib/types";

const BASE = "https://api.themoviedb.org/3";
const MIN_DATE = "1980-01-01";

/**
 * Familiarity floor for the movie pool. `vote_count` is the best proxy for how
 * widely seen a film is — raising it trims obscure titles. The genre pools are
 * naturally smaller, so they use a lower floor to keep enough variety.
 */
const MIN_VOTE_COUNT = 2500;
const GENRE_MIN_VOTE_COUNT = 1000;

function apiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) {
    throw new Error(
      "TMDB_API_KEY is not set. Copy .env.local.example to .env.local and add your TMDB v3 key.",
    );
  }
  return key;
}

async function tmdb<T>(
  path: string,
  params: Record<string, string | number> = {},
  revalidate = 60 * 60 * 24,
): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", apiKey());
  url.searchParams.set("language", "en-US");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`TMDB ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/* ---------------------------------------------------------------- *
 * Raw TMDB response shapes (only the fields we read)
 * ---------------------------------------------------------------- */
type RawMovie = {
  id: number;
  title: string;
  release_date?: string;
  poster_path: string | null;
  backdrop_path?: string | null;
  popularity?: number;
  genre_ids?: number[];
};
type RawDiscover = { page: number; total_pages: number; results: RawMovie[] };
type RawGenres = { genres: GenreLite[] };
type RawPerson = { id: number; name: string; profile_path: string | null };
type RawDetails = RawMovie & {
  genres: GenreLite[];
  revenue: number;
  vote_average: number;
  overview: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: (RawPerson & { order: number })[];
    crew: (RawPerson & { job: string })[];
  };
};

function yearOf(date?: string): number | null {
  if (!date) return null;
  const y = Number(date.slice(0, 4));
  return Number.isFinite(y) ? y : null;
}

function toLite(m: RawMovie): MovieLite {
  return {
    id: m.id,
    title: m.title,
    year: yearOf(m.release_date),
    posterPath: m.poster_path,
  };
}

/* ---------------------------------------------------------------- *
 * Public API
 * ---------------------------------------------------------------- */

/** Genre id → name lookup, cached for a day. */
export async function getGenreMap(): Promise<Map<number, string>> {
  const data = await tmdb<RawGenres>("/genre/movie/list");
  return new Map(data.genres.map((g) => [g.id, g.name]));
}

/** Raw discover query for well-known movies (>= 1980), optionally by genre. */
async function rawDiscover(page: number, genre?: number): Promise<RawDiscover> {
  const params: Record<string, string | number> = {
    sort_by: "popularity.desc",
    "primary_release_date.gte": MIN_DATE,
    "vote_count.gte": genre ? GENRE_MIN_VOTE_COUNT : MIN_VOTE_COUNT,
    include_adult: "false",
    page,
  };
  if (genre) params.with_genres = genre;
  return tmdb<RawDiscover>("/discover/movie", params);
}

/**
 * Discover a pool of well-known movies (>= 1980), ordered by popularity.
 * `requirePoster` keeps entries that have artwork (needed by the poster game).
 */
export async function discoverPopular(
  page: number,
  requirePoster = false,
  genre?: number,
): Promise<MovieLite[]> {
  const data = await rawDiscover(page, genre);
  let results = data.results;
  if (requirePoster) results = results.filter((m) => m.poster_path);
  return results.map(toLite);
}

/** How many top-popularity discover pages we sample from (~20 titles/page). */
export const DISCOVER_PAGE_RANGE = 40;

/** Pick one random popular movie id, optionally constrained to a genre. */
export async function randomPopularMovie(
  requirePoster = false,
  genre?: number,
): Promise<MovieLite> {
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
}

/** Minimum worldwide box office for a movie to be eligible as a secret target. */
export const MIN_TARGET_REVENUE = 50_000_000;

/**
 * Pick a secret target id that is both recent enough (>= 1980) and a real
 * box-office title (>= MIN_TARGET_REVENUE) so the answer is never obscure.
 * TMDB's discover endpoint can't filter on revenue, so we sample popular
 * candidates and verify their facts, retrying a few times before falling back.
 */
export async function pickTargetMovieId(
  maxAttempts = 8,
  genre?: number,
): Promise<number> {
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
}

/**
 * Search movies by title (>= 1980) for guess autocomplete. When `genre` is set
 * (Spotle by genre), only titles tagged with that genre are returned.
 */
export async function searchMovies(query: string, genre?: number): Promise<MovieLite[]> {
  if (!query.trim()) return [];
  // Short queries return a flood of literal matches that bury famous films, so
  // we pull the first few pages and re-rank by popularity before trimming.
  const [p1, p2, p3] = await Promise.all([
    tmdb<RawDiscover>("/search/movie", { query, include_adult: "false", page: 1 }, 0),
    tmdb<RawDiscover>("/search/movie", { query, include_adult: "false", page: 2 }, 0),
    tmdb<RawDiscover>("/search/movie", { query, include_adult: "false", page: 3 }, 0),
  ]);
  let all = [...p1.results, ...p2.results, ...p3.results];
  if (genre) all = all.filter((m) => m.genre_ids?.includes(genre));
  return all
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .map(toLite)
    .filter((m) => m.year !== null && m.year >= 1980)
    .slice(0, 8);
}

/** Full normalized facts for a movie (genres, revenue, rating, studio, cast). */
export async function getMovieFacts(id: number): Promise<MovieFacts> {
  const d = await tmdb<RawDetails>(`/movie/${id}`, {
    append_to_response: "credits",
  });
  const cast: CastLite[] = (d.credits?.cast ?? [])
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((c) => ({ id: c.id, name: c.name, profilePath: c.profile_path }));
  const directorRaw = (d.credits?.crew ?? []).find((c) => c.job === "Director");
  const director: CastLite | null = directorRaw
    ? { id: directorRaw.id, name: directorRaw.name, profilePath: directorRaw.profile_path }
    : null;
  const company = d.production_companies?.[0];
  const studio = company
    ? { id: company.id, name: company.name, logoPath: company.logo_path ?? null }
    : null;
  return {
    id: d.id,
    title: d.title,
    year: yearOf(d.release_date),
    posterPath: d.poster_path,
    backdropPath: d.backdrop_path ?? null,
    genres: d.genres ?? [],
    revenue: d.revenue ?? 0,
    rating: d.vote_average ?? 0,
    studio,
    cast,
    director,
    overview: d.overview ?? "",
  };
}

/* ---------------------------------------------------------------- *
 * Higher or Lower deck
 * ---------------------------------------------------------------- */

/** In-place Fisher–Yates shuffle. */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Light detail fetch with just the two comparable stats (no credits). */
async function getMovieScore(id: number): Promise<HiloCard> {
  const d = await tmdb<RawDetails>(`/movie/${id}`);
  return {
    id: d.id,
    title: d.title,
    year: yearOf(d.release_date),
    posterPath: d.poster_path,
    revenue: d.revenue ?? 0,
    rating: d.vote_average ?? 0,
  };
}

/**
 * Build a shuffled deck of well-known films for Higher or Lower. Each card
 * carries both stats (box office + rating) so the client can play either mode.
 * Only films with a poster and a real box office (>= MIN_TARGET_REVENUE) make
 * the cut, so the comparisons stay between recognisable titles.
 */
export async function getHiloDeck(size = 30): Promise<HiloCard[]> {
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
  const usable = cards.filter(
    (c) => c.revenue >= MIN_TARGET_REVENUE && c.rating > 0,
  );
  return shuffle(usable).slice(0, size);
}
