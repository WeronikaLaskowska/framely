import type { GuessResult } from "@/lib/types";
import { GuessCard } from "@/features/games/guess-movie/guess-card";

/** The list of guessed films, newest first, each as a rich dossier card. */
export function GuessGrid({ guesses }: { guesses: GuessResult[] }) {
  if (guesses.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {guesses.map((g, i) => (
        <GuessCard key={`${g.guess.id}-${i}`} result={g} />
      ))}
    </div>
  );
}
