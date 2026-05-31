import type { Genre } from "@/models/genre";
import { GENRES } from "@/lib/genres";
import { BackLink } from "@/common/ui/BackLink";
import { Button } from "@/common/ui/Button";
import { EmberText } from "@/common/typography/EmberText";
import { GameHeader } from "@/features/games/components/GameHeader";

export const GenrePicker = ({ onPick }: { onPick: (genre: Genre) => void }) => (
  <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:py-10">
    <BackLink href="/games" label="Games" />

    <GameHeader
      badge="Spotle · by genre"
      title={
        <>
          Pick a <EmberText>genre</EmberText>
        </>
      }
      blurb="The secret film — and every guess you can make — is locked to the genre you choose."
    />

    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {GENRES.map((g) => (
        <Button
          key={g.id}
          variant="ghost"
          type="button"
          onClick={() => onPick(g)}
          className="cursor-pointer px-4 py-4 text-xs"
        >
          {g.name}
        </Button>
      ))}
    </div>
  </main>
);
