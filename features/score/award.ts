import { addScore } from "@/features/score/scoreStore";
import { streakPoints, winPoints } from "@/features/score/levels";

export const awardWin = (attemptsLeft: number, maxGuesses: number): number => {
  const points = winPoints(attemptsLeft, maxGuesses);
  addScore(points);
  return points;
};

export const awardStreak = (streak: number): number => {
  const points = streakPoints(streak);
  addScore(points);
  return points;
};
