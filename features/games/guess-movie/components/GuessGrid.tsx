import type { GuessResult } from "@/models/guess";
import { GuessCard } from "@/features/games/guess-movie/components/GuessCard";

export const GuessGrid = ({ guesses }: { guesses: GuessResult[] }) => {
  if (guesses.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {guesses.map((g, i) => (
        <GuessCard key={`${g.guess.id}-${i}`} result={g} />
      ))}
    </div>
  );
};
