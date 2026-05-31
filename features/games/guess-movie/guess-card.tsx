import Image from "next/image";
import { ArrowDown, ArrowUp, Film, User } from "lucide-react";
import type { AttributeResult, CastLite, GuessResult, Verdict } from "@/lib/types";
import { tmdbImage } from "@/lib/format";
import { cn } from "@/lib/cn";

const TILE_VERDICT: Record<Verdict, string> = {
  correct: "fr-tile--correct",
  close: "fr-tile--close",
  wrong: "fr-tile--wrong",
};

const CHIP_MATCHED = "border-fr-correct-border bg-fr-correct-bg text-fr-correct";
const CHIP_UNMATCHED = "border-fr-border-strong bg-white/[0.02] text-fr-fg-muted";

/** "Eddie Murphy" → "E. Murphy" to keep avatar captions compact. */
function shortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `${parts[0][0]}. ${parts.slice(1).join(" ")}`;
}

function Tile({
  label,
  result,
  children,
}: {
  label: string;
  result: AttributeResult;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "fr-tile flex min-h-[68px] flex-col items-center justify-center gap-1 px-2 py-2.5 text-center",
        TILE_VERDICT[result.verdict],
      )}
    >
      <span className="fr-timecode text-[8px]">{label}</span>
      <span className="flex items-center gap-1 text-sm font-semibold leading-tight">
        {children}
        {result.direction === "up" && <ArrowUp size={13} className="shrink-0" />}
        {result.direction === "down" && <ArrowDown size={13} className="shrink-0" />}
      </span>
    </div>
  );
}

function Avatar({
  person,
  role,
  matched,
}: {
  person: CastLite | null;
  role: string;
  matched: boolean;
}) {
  const photo = tmdbImage(person?.profilePath ?? null, "w185");
  return (
    <div className="flex w-[60px] shrink-0 flex-col items-center gap-1.5 text-center">
      <span className="fr-timecode w-full truncate text-[8px]">{role}</span>
      <div
        className={cn(
          "relative h-14 w-14 overflow-hidden border-2",
          matched
            ? "border-fr-correct shadow-[0_0_18px_-4px_var(--fr-correct)]"
            : "border-fr-border-strong",
        )}
      >
        {photo ? (
          <Image
            src={photo}
            alt={person?.name ?? role}
            fill
            sizes="56px"
            className={cn("object-cover object-top", matched ? "" : "grayscale")}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-fr-surface-2 text-fr-fg-subtle">
            <User size={18} />
          </div>
        )}
      </div>
      <span
        className={cn(
          "w-full truncate text-[10px] leading-tight",
          matched ? "text-fr-correct" : "text-fr-fg-muted",
        )}
      >
        {person ? shortName(person.name) : "—"}
      </span>
    </div>
  );
}

/** One guessed film, rendered as a Spotle-style dossier in the pixel theme. */
export function GuessCard({ result }: { result: GuessResult }) {
  const movie = result.guess;
  const attr = result.attributes;
  const poster = tmdbImage(movie.posterPath, "w185");
  const studioLogo = tmdbImage(movie.studio?.logoPath ?? null, "w185");
  const matched = new Set(attr.cast.matchedIds ?? []);
  const matchedGenres = new Set(attr.genre.matchedIds ?? []);
  const lead = movie.cast[0] ?? null;
  const supporting = movie.cast.slice(1, 5);

  return (
    <article className="fr-card fr-pop p-4 md:p-5">
      <div className="flex gap-4">
        <div className="relative aspect-2/3 w-[76px] shrink-0 self-start border-2 border-fr-border-strong md:w-24">
          {poster ? (
            <Image src={poster} alt={movie.title} fill sizes="96px" className="object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-fr-surface-2 text-fr-fg-subtle">
              <Film size={22} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="fr-display text-sm leading-snug md:text-base">{movie.title}</h3>
            {movie.year && <span className="fr-counter">{movie.year}</span>}
          </div>

          {movie.genres.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className={cn(
                    "border-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide",
                    matchedGenres.has(genre.id) ? CHIP_MATCHED : CHIP_UNMATCHED,
                  )}
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Tile label="Year" result={attr.year}>
              {attr.year.display}
            </Tile>
            <Tile label="Box office" result={attr.revenue}>
              {attr.revenue.display}
            </Tile>
            <Tile label="Rating" result={attr.rating}>
              {attr.rating.display === "—" ? "—" : `${attr.rating.display}/10`}
            </Tile>
            <Tile label="Studio" result={attr.studio}>
              {studioLogo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={studioLogo}
                  alt={movie.studio?.name ?? "Studio"}
                  className="max-h-6 w-auto max-w-[88px] object-contain filter-[brightness(0)_invert(1)]"
                />
              ) : (
                <span className="line-clamp-2 text-xs font-medium">{attr.studio.display}</span>
              )}
            </Tile>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3 border-t-2 border-fr-border pt-4 md:gap-4">
        <Avatar role="Director" person={movie.director} matched={attr.director.verdict === "correct"} />
        <Avatar
          role="Lead"
          person={lead}
          matched={lead ? matched.has(lead.id) : false}
        />
        {supporting.length > 0 && (
          <span className="mx-1 hidden h-12 w-0.5 self-center bg-fr-border sm:block" aria-hidden />
        )}
        {supporting.map((person) => (
          <Avatar key={person.id} role="Cast" person={person} matched={matched.has(person.id)} />
        ))}
      </div>
    </article>
  );
}
