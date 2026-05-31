/** Award helpers used by the game hooks at the moment of a win. Each returns
 *  the points granted so the screen can flash a "+N pts" to the player. */
import { addScore } from "@/features/score/scoreStore";
import { streakPoints, winPoints } from "@/features/score/levels";

/** Record a solved guess-style game; returns the points awarded. */
export const awardWin = (attemptsLeft: number, maxGuesses: number): number => {
  const points = winPoints(attemptsLeft, maxGuesses);
  addScore(points);
  return points;
};

/** Record a finished Higher or Lower run; returns the points awarded (0 if no streak). */
export const awardStreak = (streak: number): number => {
  const points = streakPoints(streak);
  addScore(points);
  return points;
};
