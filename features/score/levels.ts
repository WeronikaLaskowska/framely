export type PlayerLevel = {
  name: string;
  min: number;
};

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
  next: PlayerLevel | null;
  pointsToNext: number | null;
  progress: number;
};

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

export const winPoints = (attemptsLeft: number, maxGuesses: number): number => {
  if (maxGuesses <= 0) return WIN_BASE;
  const left = Math.max(0, Math.min(attemptsLeft, maxGuesses));
  return Math.round(WIN_BASE + WIN_BONUS * (left / maxGuesses));
};

export const streakPoints = (streak: number): number =>
  streak > 0 ? streak * 20 : 0;
