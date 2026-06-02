/** Server-only: picking a secret movie and turning its audience reviews into
 *  guessable, title-redacted clues for the review game.
 *
 *  TMDB's reviews endpoint (`/movie/{id}/reviews`) only supports `language` and
 *  `page` — there is no "likes"/popularity sort. So we approximate good clues:
 *  prefer reviews that carry an author rating and have a substantial length,
 *  drawn from the already-popular target pool so the answer stays guessable.
 */
import type { ReviewClue } from "@/models/review";
import { MIN_TARGET_REVENUE, tmdbFetch } from "@/lib/server/tmdbClient";
import { randomPopularMovie } from "@/lib/server/tmdbDiscover";
import { getMovieFacts } from "@/lib/server/tmdbFacts";

type RawReview = {
  id: string;
  author: string;
  author_details?: { username?: string; rating?: number | null };
  content: string;
};
type RawReviews = { results: RawReview[] };

const REVIEW_MIN_LEN = 90;
const REVIEW_MAX_LEN = 700;
const MAX_CLUES = 3;
const IDEAL_LEN = 350;

const isRedactable = (title: string): boolean =>
  title.includes(" ") || title.replace(/\s/g, "").length >= 5;

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const redactTitle = (content: string, title: string): string => {
  const variants = new Set([title]);
  const noArticle = title.replace(/^(the|a|an)\s+/i, "");
  if (noArticle) variants.add(noArticle);

  let out = content;
  for (const variant of variants) {
    out = out.replace(new RegExp(`\\b${escapeRegExp(variant)}\\b`, "gi"), "█████");
  }
  return out;
};

const clean = (raw: string): string => {
  const text = raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (text.length <= REVIEW_MAX_LEN) return text;
  const cut = text.slice(0, REVIEW_MAX_LEN);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
};

const buildClues = (reviews: RawReview[], title: string): ReviewClue[] =>
  reviews
    .map((r) => ({
      id: r.id,
      author: r.author || r.author_details?.username || "Anonymous",
      rating: r.author_details?.rating ?? null,
      content: clean(redactTitle(r.content, title)),
    }))
    .filter((c) => c.content.length >= REVIEW_MIN_LEN)
    // Rated reviews first, then the ones closest to a comfortable reading length.
    .sort((a, b) => {
      const rated = Number(a.rating == null) - Number(b.rating == null);
      if (rated !== 0) return rated;
      return Math.abs(a.content.length - IDEAL_LEN) - Math.abs(b.content.length - IDEAL_LEN);
    })
    .slice(0, MAX_CLUES);

const getReviews = (movieId: number): Promise<RawReviews> =>
  tmdbFetch<RawReviews>(`/movie/${movieId}/reviews`);

export const getReviewTarget = async (
  maxAttempts = 16,
): Promise<{ id: number; clues: ReviewClue[] }> => {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = await randomPopularMovie();
    const facts = await getMovieFacts(candidate.id);
    if (!isRedactable(facts.title) || facts.revenue < MIN_TARGET_REVENUE) continue;

    const { results } = await getReviews(facts.id);
    const clues = buildClues(results, facts.title);
    if (clues.length > 0) return { id: facts.id, clues };
  }
  throw new Error("Could not find a film with usable reviews — try again");
};
