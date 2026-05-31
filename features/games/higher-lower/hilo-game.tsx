"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Film,
  Loader2,
  RotateCcw,
  Trophy,
} from "lucide-react";
import type { HiloCard, HiloMetric } from "@/lib/types";
import { formatMoney, formatRating, tmdbImage } from "@/lib/format";

type Status = "select" | "loading" | "playing" | "over" | "error";

type MetricConfig = {
  key: HiloMetric;
  label: string;
  blurb: string;
  /** Pull the comparable number off a card. */
  value: (c: HiloCard) => number;
  /** Render that number for display. */
  format: (n: number) => string;
};

const METRICS: Record<HiloMetric, MetricConfig> = {
  "box-office": {
    key: "box-office",
    label: "Box Office",
    blurb: "Which film grossed more worldwide?",
    value: (c) => c.revenue,
    format: (n) => formatMoney(n),
  },
  rating: {
    key: "rating",
    label: "Rating",
    blurb: "Which film has the higher TMDB score?",
    value: (c) => c.rating,
    format: (n) => `${formatRating(n)} / 10`,
  },
};

const METRIC_ORDER: HiloMetric[] = ["box-office", "rating"];

function bestKey(metric: HiloMetric) {
  return `framely.hilo.best.${metric}`;
}

function readBest(metric: HiloMetric): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(bestKey(metric));
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

export function HiloGame() {
  const [metric, setMetric] = useState<HiloMetric | null>(null);
  const [status, setStatus] = useState<Status>("select");
  const [error, setError] = useState<string | null>(null);

  const [deck, setDeck] = useState<HiloCard[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);

  // Reveal state for the current comparison.
  const [revealed, setRevealed] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);

  const cfg = metric ? METRICS[metric] : null;
  const current = deck[index] ?? null;
  const next = deck[index + 1] ?? null;

  const fetchDeck = useCallback(async (): Promise<HiloCard[]> => {
    const res = await fetch("/api/games/higher-lower");
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Could not load deck");
    return data.deck as HiloCard[];
  }, []);

  async function start(m: HiloMetric) {
    setMetric(m);
    setStatus("loading");
    setError(null);
    setScore(0);
    setRevealed(false);
    setLastCorrect(null);
    setBest(readBest(m));
    try {
      const fresh = await fetchDeck();
      setDeck(fresh);
      setIndex(0);
      setStatus("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load deck");
      setStatus("error");
    }
  }

  function guess(higher: boolean) {
    if (!cfg || !current || !next || revealed || status !== "playing") return;
    const a = cfg.value(current);
    const b = cfg.value(next);
    // Ties always count as correct so identical scores never punish the player.
    const correct = b === a || (higher ? b > a : b < a);
    setLastCorrect(correct);
    setRevealed(true);

    window.setTimeout(() => {
      if (!correct) {
        setBest((prevBest) => {
          const newBest = Math.max(prevBest, score);
          if (metric) window.localStorage.setItem(bestKey(metric), String(newBest));
          return newBest;
        });
        setStatus("over");
        return;
      }
      setScore((s) => s + 1);
      advance();
    }, 1500);
  }

  function advance() {
    setRevealed(false);
    setLastCorrect(null);
    setIndex((prev) => {
      const nextIndex = prev + 1;
      // Top up the deck before we run out of upcoming cards.
      if (nextIndex + 1 >= deck.length) {
        void topUp();
      }
      return nextIndex;
    });
  }

  const topUp = useCallback(async () => {
    try {
      const more = await fetchDeck();
      setDeck((prev) => {
        const seen = new Set(prev.map((c) => c.id));
        return [...prev, ...more.filter((c) => !seen.has(c.id))];
      });
    } catch {
      /* a failed top-up just ends the run naturally when the deck empties */
    }
  }, [fetchDeck]);

  // If the deck somehow empties mid-play (top-up failed), end gracefully.
  useEffect(() => {
    if (status === "playing" && deck.length > 0 && !next) {
      setBest((prevBest) => {
        const newBest = Math.max(prevBest, score);
        if (metric) window.localStorage.setItem(bestKey(metric), String(newBest));
        return newBest;
      });
      setStatus("over");
    }
  }, [status, deck.length, next, score, metric]);

  function backToSelect() {
    setStatus("select");
    setMetric(null);
    setDeck([]);
    setIndex(0);
    setScore(0);
    setRevealed(false);
    setLastCorrect(null);
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 text-sm text-fr-fg-muted transition-colors hover:text-fr-fg"
        >
          <ArrowLeft size={15} /> Games
        </Link>
        {status === "playing" && (
          <div className="flex items-center gap-4">
            <span className="fr-counter">Streak {score}</span>
            <span className="fr-counter inline-flex items-center gap-1.5 text-fr-fg-subtle">
              <Trophy size={13} /> {best}
            </span>
          </div>
        )}
      </div>

      <header className="mt-6">
        <h1 className="fr-display mt-4 text-[clamp(2.25rem,6vw,3.75rem)]">
          Higher or <span className="fr-ember-text">lower</span>
        </h1>
     
      </header>

      {status === "select" && (
        <div className="mt-8">
          <span className="fr-timecode">Pick a stat to compare</span>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            {METRIC_ORDER.map((m) => {
              const c = METRICS[m];
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => start(m)}
                  className="fr-card group cursor-pointer p-6 text-left transition-transform hover:-translate-y-1"
                >
                  <h3 className="fr-display text-2xl">{c.label}</h3>
                  <p className="mt-2 text-sm text-fr-fg-muted">{c.blurb}</p>
                  <p className="fr-counter mt-4">Best streak: {readBest(m)}</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="mt-10 flex items-center gap-3 text-fr-fg-muted">
          <Loader2 className="animate-spin" size={18} /> Shuffling the deck…
        </div>
      )}

      {status === "error" && (
        <div className="fr-card mt-10 p-6">
          <p className="text-fr-close">{error}</p>
          <button
            onClick={backToSelect}
            className="fr-btn fr-btn--ghost mt-4 cursor-pointer px-5 py-2.5 text-sm"
          >
            Back
          </button>
        </div>
      )}

      {status === "playing" && cfg && current && next && (
        <div className="mt-8">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-fr-fg-subtle">
            Comparing {cfg.label}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4 md:gap-6">
            <HiloPanel
              card={current}
              caption="known"
              valueText={cfg.format(cfg.value(current))}
            />
            <HiloPanel
              card={next}
              caption="unknown"
              valueText={revealed ? cfg.format(cfg.value(next)) : null}
              outcome={revealed ? lastCorrect : null}
            >
              {!revealed && (
                <div className="mt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => guess(true)}
                    className="fr-btn fr-btn--ember w-full cursor-pointer px-4 py-3 text-sm"
                  >
                    <ArrowUp size={16} /> Higher
                  </button>
                  <button
                    type="button"
                    onClick={() => guess(false)}
                    className="fr-btn fr-btn--ghost w-full cursor-pointer px-4 py-3 text-sm"
                  >
                    <ArrowDown size={16} /> Lower
                  </button>
                </div>
              )}
            </HiloPanel>
          </div>
        </div>
      )}

      {status === "over" && cfg && (
        <div className="fr-card fr-pop mt-10 p-8 text-center">
          <p className="fr-timecode text-fr-close">Streak ended</p>
          <p className="fr-display mt-3 text-5xl">{score}</p>
          <p className="mt-2 text-sm text-fr-fg-muted">
            {score === best && score > 0
              ? "New best streak!"
              : `Best streak: ${best}`}
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => start(cfg.key)}
              className="fr-btn fr-btn--ember cursor-pointer px-6 py-3"
            >
              <RotateCcw size={16} /> Play again
            </button>
            <button
              type="button"
              onClick={backToSelect}
              className="fr-btn fr-btn--ghost cursor-pointer px-6 py-3"
            >
              Change stat
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function HiloPanel({
  card,
  caption,
  valueText,
  outcome,
  children,
}: {
  card: HiloCard;
  caption: string;
  valueText: string | null;
  outcome?: boolean | null;
  children?: React.ReactNode;
}) {
  const poster = tmdbImage(card.posterPath, "w342");
  const ring =
    outcome === true
      ? "border-fr-correct"
      : outcome === false
        ? "border-fr-close"
        : "border-fr-border-strong";

  return (
    <div
      className={`fr-card flex flex-col overflow-hidden border-2 p-0 transition-colors ${ring}`}
    >
      <div className="relative aspect-2/3 w-full bg-black/40">
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={poster}
            alt={card.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-fr-fg-subtle">
            <Film size={40} />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 bg-black/60 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-fr-fg-subtle">
          {caption}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="fr-display text-base leading-tight md:text-lg">{card.title}</h3>
        <span className="fr-counter mt-1">{card.year ?? "—"}</span>

        <div className="mt-3 min-h-7">
          {valueText !== null ? (
            <p
              className={`fr-display text-xl md:text-2xl ${
                outcome === true
                  ? "text-fr-correct"
                  : outcome === false
                    ? "text-fr-close"
                    : "text-fr-fg"
              }`}
            >
              {valueText}
            </p>
          ) : (
            <p className="fr-display text-xl text-fr-fg-subtle md:text-2xl">???</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
