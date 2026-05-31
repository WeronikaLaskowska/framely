"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import type { Difficulty, MovieFacts, MovieLite } from "@/lib/types";
import { tmdbImage } from "@/lib/format";
import { MovieSearch } from "@/features/games/movie-search";
import { ResultBanner } from "@/features/games/result-banner";
import { PosterBoard } from "@/features/games/poster/poster-board";
import {
  DIFFICULTY,
  DIFFICULTY_ORDER,
  shuffledIndices,
} from "@/features/games/poster/difficulty";

type Status = "select" | "loading" | "playing" | "won" | "lost" | "error";

export function PosterGame() {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [status, setStatus] = useState<Status>("select");
  const [token, setToken] = useState<string | null>(null);
  const [posterUrl, setPosterUrl] = useState<string | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const [guessedIds, setGuessedIds] = useState<number[]>([]);
  const [target, setTarget] = useState<MovieFacts | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cfg = difficulty ? DIFFICULTY[difficulty] : null;

  async function start(diff: Difficulty) {
    setDifficulty(diff);
    setStatus("loading");
    setError(null);
    setWrong(0);
    setGuessedIds([]);
    setTarget(null);
    try {
      const res = await fetch("/api/games/poster/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start game");
      const url = tmdbImage(data.posterPath, "w500");
      if (!url) throw new Error("This movie has no poster — try again.");
      const conf = DIFFICULTY[diff];
      setToken(data.token);
      setPosterUrl(url);
      setOrder(shuffledIndices(conf.cols * conf.rows));
      setStatus("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start game");
      setStatus("error");
    }
  }

  async function submitGuess(movie: MovieLite) {
    if (!token || !cfg || submitting || status !== "playing") return;
    if (guessedIds.includes(movie.id)) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/games/poster/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, movieId: movie.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Guess failed");

      setGuessedIds((prev) => [movie.id, ...prev]);

      if (data.correct) {
        setTarget(data.target as MovieFacts);
        setStatus("won");
      } else {
        const nextWrong = wrong + 1;
        setWrong(nextWrong);
        if (nextWrong >= cfg.attempts) await reveal();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Guess failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function reveal() {
    if (!token) return;
    try {
      const res = await fetch("/api/games/poster/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, reveal: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setTarget(data.target as MovieFacts);
        setStatus("lost");
      }
    } catch {
      /* ignore */
    }
  }

  function backToSelect() {
    setStatus("select");
    setDifficulty(null);
    setPosterUrl(null);
    setToken(null);
  }

  const ended = status === "won" || status === "lost";
  const attemptsLeft = cfg ? cfg.attempts - wrong : 0;
  const revealedCount = cfg ? cfg.initialReveal + wrong * cfg.perGuess : 0;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 text-sm text-fr-fg-muted transition-colors hover:text-fr-fg"
        >
          <ArrowLeft size={15} /> Games
        </Link>
        {status === "playing" && (
          <span className="fr-counter">
            {attemptsLeft} {attemptsLeft === 1 ? "guess" : "guesses"} left
          </span>
        )}
      </div>

      <header className="mt-6">
        <span className="fr-tape">Reel 02 · Poster</span>
        <h1 className="fr-display mt-4 text-[clamp(2.25rem,6vw,3.75rem)]">
          Name the <span className="fr-ember-text">poster</span>
        </h1>
        <p className="mt-2 max-w-xl text-sm text-fr-fg-muted">
          Each wrong guess clears another fragment of the artwork. Spot it before
          it&apos;s fully exposed.
        </p>
      </header>

      {status === "select" && (
        <div className="mt-8">
          <span className="fr-timecode">Choose a difficulty</span>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {DIFFICULTY_ORDER.map((d) => {
              const c = DIFFICULTY[d];
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => start(d)}
                  className="fr-card group p-6 text-left transition-transform hover:-translate-y-1"
                >
                  <h3 className="fr-display text-2xl">{c.label}</h3>
                  <p className="mt-2 text-sm text-fr-fg-muted">{c.blurb}</p>
                  <p className="fr-counter mt-4">
                    {c.cols}×{c.rows} tiles
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="mt-10 flex items-center gap-3 text-fr-fg-muted">
          <Loader2 className="animate-spin" size={18} /> Loading a poster…
        </div>
      )}

      {status === "error" && (
        <div className="fr-card mt-10 p-6">
          <p className="text-fr-close">{error}</p>
          <button
            onClick={backToSelect}
            className="fr-btn fr-btn--ghost mt-4 px-5 py-2.5 text-sm"
          >
            Back
          </button>
        </div>
      )}

      {(status === "playing" || ended) && cfg && posterUrl && (
        <div className="mt-8 flex flex-col items-center gap-6">
          <PosterBoard
            posterUrl={posterUrl}
            cols={cfg.cols}
            rows={cfg.rows}
            order={order}
            revealedCount={revealedCount}
            fullyRevealed={ended}
          />

          {!ended ? (
            <div className="flex w-full max-w-md flex-col gap-3">
              <MovieSearch
                onSelect={submitGuess}
                disabled={submitting}
                excludeIds={guessedIds}
                placeholder="Name this movie…"
              />
              {error && <span className="text-sm text-fr-close">{error}</span>}
              {guessedIds.length > 0 && (
                <p className="text-center text-xs uppercase tracking-widest text-fr-fg-subtle">
                  {wrong} wrong so far
                </p>
              )}
              <button
                type="button"
                onClick={reveal}
                className="mx-auto text-xs uppercase tracking-widest text-fr-fg-subtle transition-colors hover:text-fr-close"
              >
                Give up
              </button>
            </div>
          ) : (
            target && (
              <div className="w-full">
                <ResultBanner
                  won={status === "won"}
                  target={target}
                  detail={
                    status === "won"
                      ? `Solved with ${wrong} ${wrong === 1 ? "miss" : "misses"}`
                      : undefined
                  }
                  onPlayAgain={() => difficulty && start(difficulty)}
                />
                <button
                  onClick={backToSelect}
                  className="fr-btn fr-btn--ghost mt-3 w-full px-5 py-2.5 text-sm"
                >
                  Change difficulty
                </button>
              </div>
            )
          )}
        </div>
      )}
    </main>
  );
}
