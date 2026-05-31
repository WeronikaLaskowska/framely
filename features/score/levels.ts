/** Player ranks and the maths for turning a win into points.
 *
 *  Ranks climb from a cinema "Extra" (just arrived) all the way to "Legend".
 *  Points reward solving with guesses to spare, so a clean win is worth far
 *  more than a last-gasp one. */

export type PlayerLevel = {
  /** Rank name shown to the player. */
  name: string;
  /** Total points required to reach this rank. */
  min: number;
};

/** Ordered low → high. The first entry is the starting rank. */
export const LEVELS: PlayerLevel[] = [
  { name: "Extra", min: 0 },
  { name: "Usher", min: 150 },
  { name: "Regular", min: 400 },
  { name: "Film Buff", min: 800 },
  { name: "Critic", min: 1400 },
  { name: "Director", min: 2400 },
  { name: "Auteur", min: 3800 },
  { name: "Legend", min: 5500 },
];

export type Rank = {
  level: PlayerLevel;
  index: number;
  /** The next rank up, or null at the top. */
  next: PlayerLevel | null;
  /** Points still needed to reach `next`, or null at the top. */
  pointsToNext: number | null;
  /** Progress through the current rank, 0–1 (1 when maxed out). */
  progress: number;
};

/** Resolve a total point count into the player's current rank and progress. */
export const rankFor = (total: number): Rank => {
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (total >= LEVELS[i].min) index = i;
  }
  const level = LEVELS[index];
  const next = LEVELS[index + 1] ?? null;
  if (!next) {
    return { level, index, next: null, pointsToNext: null, progress: 1 };
  }
  const span = next.min - level.min;
  const into = total - level.min;
  return {
    level,
    index,
    next,
    pointsToNext: Math.max(0, next.min - total),
    progress: span > 0 ? Math.min(1, into / span) : 0,
  };
};

const WIN_BASE = 60;
const WIN_BONUS = 60;

/**
 * Points for solving a guess-style game: a flat base plus a bonus that scales
 * with how many guesses you had left (a first-try win earns the full bonus).
 */
export const winPoints = (attemptsLeft: number, maxGuesses: number): number => {
  if (maxGuesses <= 0) return WIN_BASE;
  const left = Math.max(0, Math.min(attemptsLeft, maxGuesses));
  return Math.round(WIN_BASE + WIN_BONUS * (left / maxGuesses));
};

/** Points for a Higher or Lower run — scales with the streak you reached. */
export const streakPoints = (streak: number): number =>
  streak > 0 ? streak * 20 : 0;
