import { useCallback, useEffect, useState } from "react";
import type { HiloCard, HiloMetric } from "@/models/hilo";
import { useHiloDeckQuery } from "@/queries/hiloGame.queries";
import { awardStreak } from "@/features/score/award";
import { METRICS } from "@/features/games/higher-lower/data/metrics";
import { readBest, writeBest } from "@/features/games/higher-lower/data/bestStreak";

export type HiloStatus = "select" | "loading" | "playing" | "over" | "error";

const REVEAL_MS = 1500;

export const useHiloGame = () => {
  const [metric, setMetric] = useState<HiloMetric | null>(null);
  const [status, setStatus] = useState<HiloStatus>("select");
  const [deck, setDeck] = useState<HiloCard[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [awardedPoints, setAwardedPoints] = useState<number | null>(null);

  const { refetch } = useHiloDeckQuery(false);

  const cfg = metric ? METRICS[metric] : null;
  const current = deck[index] ?? null;
  const next = deck[index + 1] ?? null;

  const loadDeck = useCallback(async (): Promise<HiloCard[]> => {
    const { data, error } = await refetch();
    if (error || !data) throw error ?? new Error("Could not load deck");
    return data;
  }, [refetch]);

  const commitBest = useCallback(
    (m: HiloMetric, runScore: number) => {
      setBest((prev) => {
        const nextBest = Math.max(prev, runScore);
        writeBest(m, nextBest);
        return nextBest;
      });
    },
    [],
  );

  const start = useCallback(
    async (m: HiloMetric) => {
      setMetric(m);
      setStatus("loading");
      setScore(0);
      setRevealed(false);
      setLastCorrect(null);
      setAwardedPoints(null);
      setBest(readBest(m));
      try {
        const fresh = await loadDeck();
        setDeck(fresh);
        setIndex(0);
        setStatus("playing");
      } catch {
        setStatus("error");
      }
    },
    [loadDeck],
  );

  const topUp = useCallback(async () => {
    try {
      const more = await loadDeck();
      setDeck((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...more.filter((c) => !seen.has(c.id))];
      });
    } catch {
      /* a failed top-up just ends the run naturally when the deck empties */
    }
  }, [loadDeck]);

  // Terminal transition: bank the best streak, award streak points and end the
  // run. Shared by a wrong call and the deck running dry.
  const endRun = useCallback(
    (runScore: number) => {
      if (metric) commitBest(metric, runScore);
      setAwardedPoints(awardStreak(runScore));
      setStatus("over");
    },
    [metric, commitBest],
  );

  const advance = useCallback(() => {
    setRevealed(false);
    setLastCorrect(null);
    setIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex + 1 >= deck.length) void topUp();
      return nextIndex;
    });
  }, [deck.length, topUp]);

  const guess = useCallback(
    (higher: boolean) => {
      if (!cfg || !current || !next || revealed || status !== "playing") return;
      const a = cfg.value(current);
      const b = cfg.value(next);
      // Ties always count as correct so identical scores never punish the player.
      const correct = b === a || (higher ? b > a : b < a);
      setLastCorrect(correct);
      setRevealed(true);

      window.setTimeout(() => {
        if (!correct) {
          endRun(score);
          return;
        }
        setScore((s) => s + 1);
        advance();
      }, REVEAL_MS);
    },
    [cfg, current, next, revealed, status, score, endRun, advance],
  );

  // End gracefully if the deck empties mid-play (a top-up failed). This commits
  // the best streak to localStorage (an external side effect), so it belongs in
  // an effect rather than render-phase state adjustment.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- terminal transition paired with a persisted side effect */
    if (status === "playing" && deck.length > 0 && !next) {
      endRun(score);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [status, deck.length, next, score, endRun]);

  const backToSelect = useCallback(() => {
    setStatus("select");
    setMetric(null);
    setDeck([]);
    setIndex(0);
    setScore(0);
    setRevealed(false);
    setLastCorrect(null);
    setAwardedPoints(null);
  }, []);

  return {
    status,
    score,
    best,
    cfg,
    current,
    next,
    revealed,
    lastCorrect,
    awardedPoints,
    start,
    guess,
    replay: () => cfg && start(cfg.key),
    backToSelect,
  };
};
