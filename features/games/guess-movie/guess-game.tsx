"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Lightbulb, Lock, Flag, GraduationCap } from "lucide-react";
import type { GuessResult, Hint, HintType, MovieFacts, MovieLite } from "@/lib/types";
import { MovieSearch } from "@/features/games/movie-search";
import { GuessGrid } from "@/features/games/guess-movie/guess-grid";
import { ResultBanner } from "@/features/games/result-banner";
import { TutorialModal } from "@/features/games/guess-movie/tutorial-modal";
import { HintModal, HintChip } from "@/features/games/guess-movie/hint-modal";

const MAX_GUESSES = 8;
const HINT_UNLOCK_AT = 5;

type Status = "loading" | "playing" | "won" | "lost" | "error";

export function GuessGame() {
  const [token, setToken] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [target, setTarget] = useState<MovieFacts | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hints, setHints] = useState<Hint[]>([]);
  const [hintLoading, setHintLoading] = useState<HintType | null>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);

  const start = useCallback(async () => {
    setStatus("loading");
    setGuesses([]);
    setTarget(null);
    setError(null);
    setHints([]);
    setHintOpen(false);
    try {
      const res = await fetch("/api/games/guess/start", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start game");
      setToken(data.token);
      setStatus("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start game");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    start();
  }, [start]);

  async function submitGuess(movie: MovieLite) {
    if (!token || submitting || status !== "playing") return;
    if (guesses.some((g) => g.guess.id === movie.id)) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/games/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, movieId: movie.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Guess failed");

      const result = data.result as GuessResult;
      const next = [result, ...guesses];
      setGuesses(next);

      if (result.correct) {
        setTarget(data.target as MovieFacts);
        setStatus("won");
      } else if (next.length >= MAX_GUESSES) {
        await reveal();
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
      const res = await fetch("/api/games/guess", {
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

  async function revealHint(type: HintType) {
    if (!token || hintLoading) return;
    if (hints.some((h) => h.type === type)) return;
    setHintLoading(type);
    try {
      const res = await fetch("/api/games/guess/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, type }),
      });
      const data = await res.json();
      if (res.ok && data.hint) setHints((prev) => [...prev, data.hint as Hint]);
    } catch {
      /* ignore */
    } finally {
      setHintLoading(null);
    }
  }

  const remaining = MAX_GUESSES - guesses.length;
  const ended = status === "won" || status === "lost";
  const hintsUnlocked = guesses.length >= HINT_UNLOCK_AT;
  const currentGuess = Math.min(guesses.length + 1, MAX_GUESSES);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
      <div className="flex items-center justify-between">
        <Link
          href="/games"
          className="inline-flex items-center gap-2 text-sm text-fr-fg-muted transition-colors hover:text-fr-fg"
        >
          <ArrowLeft size={15} /> Games
        </Link>
        {status === "playing" && (
          <span className="fr-counter">
            {remaining} {remaining === 1 ? "guess" : "guesses"} left
          </span>
        )}
      </div>

      <header className="mt-6">
        <h1 className="fr-display mt-4 text-[clamp(2.25rem,6vw,3.75rem)]">
          Guess the <span className="fr-ember-text">movie</span>
        </h1>
     
      </header>

      {status === "loading" && (
        <div className="mt-10 flex items-center gap-3 text-fr-fg-muted">
          <Loader2 className="animate-spin" size={18} /> Drawing a secret film…
        </div>
      )}

      {status === "error" && (
        <div className="fr-card mt-10 p-6">
          <p className="text-fr-close">{error}</p>
          <button onClick={start} className="fr-btn fr-btn--ghost mt-4 px-5 py-2.5 text-sm">
            Try again
          </button>
        </div>
      )}

      {(status === "playing" || ended) && (
        <>
          {!ended && (
            <div className="mt-7 flex flex-col gap-3">
              <MovieSearch
                onSelect={submitGuess}
                disabled={submitting}
                excludeIds={guesses.map((g) => g.guess.id)}
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="fr-counter">
                  Guess {currentGuess} / {MAX_GUESSES}
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTutorialOpen(true)}
                    className="fr-btn fr-btn--ghost px-3.5 py-2 text-xs"
                  >
                    <GraduationCap size={15} /> Tutorial
                  </button>

                  <button
                    type="button"
                    onClick={() => setHintOpen(true)}
                    disabled={!hintsUnlocked}
                    title={
                      hintsUnlocked
                        ? "Reveal a hint"
                        : `Unlocks after ${HINT_UNLOCK_AT} guesses`
                    }
                    className="fr-btn fr-btn--ghost px-3.5 py-2 text-xs"
                  >
                    {hintsUnlocked ? <Lightbulb size={15} /> : <Lock size={15} />}
                    Hint
                    {!hintsUnlocked && (
                      <span className="text-fr-fg-subtle">
                        · {HINT_UNLOCK_AT - guesses.length} to go
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={reveal}
                    className="fr-btn fr-btn--ghost px-3.5 py-2 text-xs"
                  >
                    <Flag size={15} className="text-fr-close" />
                    <span className="text-fr-close">Give up</span>
                  </button>
                </div>
              </div>

              {error && <span className="text-sm text-fr-close">{error}</span>}

              {hints.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hints.map((h) => (
                    <HintChip key={h.type} hint={h} />
                  ))}
                </div>
              )}
            </div>
          )}

          {ended && target && (
            <div className="mt-7">
              <ResultBanner
                won={status === "won"}
                target={target}
                detail={
                  status === "won"
                    ? `Solved in ${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"}`
                    : undefined
                }
                onPlayAgain={start}
              />
            </div>
          )}

          <div className="mt-8">
            <GuessGrid guesses={guesses} />
          </div>

          {guesses.length === 0 && !ended && (
            <p className="mt-10 text-center text-sm text-fr-fg-subtle">
              Guess your first movie!
            </p>
          )}
        </>
      )}

      <TutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
      <HintModal
        open={hintOpen}
        onClose={() => setHintOpen(false)}
        revealed={hints}
        loadingType={hintLoading}
        onReveal={revealHint}
      />
    </main>
  );
}
