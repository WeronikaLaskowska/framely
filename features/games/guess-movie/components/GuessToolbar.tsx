import { Flag, GraduationCap, Lightbulb, Lock } from "lucide-react";
import { Button } from "@/common/ui/Button";
import { Counter } from "@/common/typography/Counter";

type GuessToolbarProps = {
  currentGuess: number;
  maxGuesses: number;
  hintsUnlocked: boolean;
  hintUnlockAt: number;
  /** Guesses still required before hints unlock. */
  guessesToUnlock: number;
  onTutorial: () => void;
  onHint: () => void;
  onGiveUp: () => void;
};

/** The guess counter and tutorial / hint / give-up actions row. */
export const GuessToolbar = ({
  currentGuess,
  maxGuesses,
  hintsUnlocked,
  hintUnlockAt,
  guessesToUnlock,
  onTutorial,
  onHint,
  onGiveUp,
}: GuessToolbarProps) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <Counter>
      Guess {currentGuess} / {maxGuesses}
    </Counter>

    <div className="flex flex-wrap items-center gap-2">
      <Button variant="ghost" type="button" onClick={onTutorial} className="px-3.5 py-2 text-xs">
        <GraduationCap size={15} /> Tutorial
      </Button>

      <Button
        variant="ghost"
        type="button"
        onClick={onHint}
        disabled={!hintsUnlocked}
        title={hintsUnlocked ? "Reveal a hint" : `Unlocks after ${hintUnlockAt} guesses`}
        className="px-3.5 py-2 text-xs"
      >
        {hintsUnlocked ? <Lightbulb size={15} /> : <Lock size={15} />}
        Hint
        {!hintsUnlocked && <span className="text-fr-fg-subtle">· {guessesToUnlock} to go</span>}
      </Button>

      <Button variant="ghost" type="button" onClick={onGiveUp} className="px-3.5 py-2 text-xs">
        <Flag size={15} className="text-fr-close" />
        <span className="text-fr-close">Give up</span>
      </Button>
    </div>
  </div>
);
