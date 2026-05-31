import type { Genre } from "@/models/genre";
import { GENRES } from "@/lib/genres";
import { BackLink } from "@/common/ui/BackLink";
import { Badge } from "@/common/ui/Badge";
import { Button } from "@/common/ui/Button";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { EmberText } from "@/common/typography/EmberText";

/** Genre selection gate shown before the genre-locked Spotle round begins. */
export const GenrePicker = ({ onPick }: { onPick: (genre: Genre) => void }) => (
  <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
    <BackLink href="/games" label="Games" />

    <header className="mt-6">
      <Badge>Spotle · by genre</Badge>
      <DisplayHeading className="mt-4 text-[clamp(2rem,6vw,3.25rem)]">
        Pick a <EmberText>genre</EmberText>
      </DisplayHeading>
      <p className="mt-3 max-w-xl text-sm text-fr-fg-muted">
        The secret film — and every guess you can make — is locked to the
        genre you choose.
      </p>
    </header>

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
