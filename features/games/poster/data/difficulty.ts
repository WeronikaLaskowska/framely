import type { Difficulty } from "@/models/poster";

export type DiffConfig = {
  label: string;
  blurb: string;
  attempts: number;
  cols: number;
  rows: number;
  /** Tiles already clear when the round opens. */
  initialReveal: number;
  /** Extra tiles cleared on each wrong guess. */
  perGuess: number;
};

export const DIFFICULTY: Record<Difficulty, DiffConfig> = {
  easy: { label: "Easy", blurb: "Big fragments, 6 guesses", attempts: 6, cols: 4, rows: 5, initialReveal: 4, perGuess: 3 },
  medium: { label: "Medium", blurb: "Smaller tiles, 5 guesses", attempts: 5, cols: 5, rows: 6, initialReveal: 3, perGuess: 3 },
  hard: { label: "Hard", blurb: "Tiny slivers, 4 guesses", attempts: 4, cols: 6, rows: 8, initialReveal: 1, perGuess: 2 },
};

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

/** Fisher–Yates shuffle of tile indices, so reveals appear in random order. */
export const shuffledIndices = (total: number): number[] => {
  const arr = Array.from({ length: total }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};
