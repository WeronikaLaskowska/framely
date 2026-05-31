/**
 * Pure comparison logic for the guess-the-movie game. Runs on the server
 * (so the target stays hidden) but has no server-only deps — easy to test.
 *
 * Verdicts: correct → green, close → amber, wrong → muted. Numeric attributes
 * also carry a direction arrow telling the player whether the secret movie's
 * value is higher (up) or lower (down) than their guess.
 */
import type { AttributeResult, GuessResult } from "@/models/guess";
import type { MovieFacts } from "@/models/movie";
import { formatMoney, formatRating } from "@/lib/format";

const YEAR_CLOSE = 5;
const RATING_CLOSE = 0.5;
const REVENUE_CORRECT = 0.1;
const REVENUE_CLOSE = 0.4;

const compareYear = (guess: MovieFacts, target: MovieFacts): AttributeResult => {
  const g = guess.year;
  const t = target.year;
  const display = g === null ? "—" : String(g);
  if (g === null || t === null) return { verdict: "wrong", display };
  const diff = t - g;
  if (diff === 0) return { verdict: "correct", display };
  const direction = diff > 0 ? "up" : "down";
  if (Math.abs(diff) <= YEAR_CLOSE) return { verdict: "close", direction, display };
  return { verdict: "wrong", direction, display };
};

const compareNumeric = (
  gValue: number,
  tValue: number,
  display: string,
  correctTol: number,
  closeTol: number,
): AttributeResult => {
  if (!gValue || !tValue) return { verdict: "wrong", display };
  if (gValue === tValue) return { verdict: "correct", display };
  const ratio = Math.abs(gValue - tValue) / Math.max(gValue, tValue);
  const direction = tValue > gValue ? "up" : "down";
  if (ratio <= correctTol) return { verdict: "correct", direction: null, display };
  if (ratio <= closeTol) return { verdict: "close", direction, display };
  return { verdict: "wrong", direction, display };
};

/**
 * Rating (TMDB vote average, 0–10) compared by absolute distance. Green only
 * when the guess matches the target's displayed value (rounded to one decimal);
 * amber within ±RATING_CLOSE points; otherwise grey with a hint arrow.
 */
const compareRating = (guess: MovieFacts, target: MovieFacts): AttributeResult => {
  const g = guess.rating;
  const t = target.rating;
  const display = formatRating(g);
  if (!g || !t) return { verdict: "wrong", display };
  if (Math.round(g * 10) === Math.round(t * 10)) {
    return { verdict: "correct", display };
  }
  const direction = t > g ? "up" : "down";
  if (Math.abs(t - g) <= RATING_CLOSE) return { verdict: "close", direction, display };
  return { verdict: "wrong", direction, display };
};

/**
 * Genres are scored per-genre with no "close" tier: each shared genre is a
 * green match, the rest grey. Overall verdict is green only when the two genre
 * sets are identical.
 */
const compareGenres = (guess: MovieFacts, target: MovieFacts): AttributeResult => {
  const guessIds = guess.genres.map((x) => x.id);
  const targetIds = new Set(target.genres.map((x) => x.id));
  const matchedIds = guessIds.filter((id) => targetIds.has(id));
  const display = guess.genres.map((x) => x.name).join(", ") || "—";
  const sameSet =
    guessIds.length === targetIds.size &&
    matchedIds.length === guessIds.length &&
    guessIds.length > 0;
  return { verdict: sameSet ? "correct" : "wrong", display, matchedIds };
};

const tokens = (name: string): Set<string> =>
  new Set(
    name
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !["the", "and", "pictures", "studios"].includes(w)),
  );

const compareStudio = (guess: MovieFacts, target: MovieFacts): AttributeResult => {
  const display = guess.studio?.name ?? "—";
  if (!guess.studio || !target.studio) return { verdict: "wrong", display };
  if (guess.studio.id === target.studio.id) return { verdict: "correct", display };
  const gt = tokens(guess.studio.name);
  const tt = tokens(target.studio.name);
  const overlap = [...gt].some((w) => tt.has(w));
  return overlap ? { verdict: "close", display } : { verdict: "wrong", display };
};

const compareCast = (guess: MovieFacts, target: MovieFacts): AttributeResult => {
  const t = new Set(target.cast.map((c) => c.id));
  const shared = guess.cast.filter((c) => t.has(c.id));
  const matchedIds = shared.map((c) => c.id);
  const display = guess.cast.slice(0, 2).map((c) => c.name).join(", ") || "—";
  if (shared.length >= 2) {
    return { verdict: "correct", display, sub: `${shared.length} shared`, matchedIds };
  }
  if (shared.length === 1) {
    return { verdict: "close", display, sub: `${shared[0].name}`, matchedIds };
  }
  return { verdict: "wrong", display, matchedIds };
};

const compareDirector = (guess: MovieFacts, target: MovieFacts): AttributeResult => {
  const display = guess.director?.name ?? "—";
  if (!guess.director || !target.director) return { verdict: "wrong", display };
  if (guess.director.id === target.director.id) return { verdict: "correct", display };
  return { verdict: "wrong", display };
};

export const compareFacts = (guess: MovieFacts, target: MovieFacts): GuessResult => ({
  guess,
  correct: guess.id === target.id,
  attributes: {
    genre: compareGenres(guess, target),
    year: compareYear(guess, target),
    revenue: compareNumeric(
      guess.revenue,
      target.revenue,
      formatMoney(guess.revenue),
      REVENUE_CORRECT,
      REVENUE_CLOSE,
    ),
    rating: compareRating(guess, target),
    studio: compareStudio(guess, target),
    cast: compareCast(guess, target),
    director: compareDirector(guess, target),
  },
});
