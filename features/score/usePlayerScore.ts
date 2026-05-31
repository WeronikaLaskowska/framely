"use client";

import { useSyncExternalStore } from "react";
import { rankFor } from "@/features/score/levels";
import {
  getScoreServerSnapshot,
  getScoreSnapshot,
  resetScore,
  subscribeScore,
} from "@/features/score/scoreStore";

/** Reactive view of the player's saved score, rank and progress to the next rank. */
export const usePlayerScore = () => {
  const { total, wins } = useSyncExternalStore(
    subscribeScore,
    getScoreSnapshot,
    getScoreServerSnapshot,
  );
  return { total, wins, rank: rankFor(total), resetScore };
};
