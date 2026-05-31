import type { GuessResult } from "@/models/guess";
import { tmdbImage } from "@/lib/format";
import { Card } from "@/common/ui/Card";
import { Poster } from "@/common/ui/Poster";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { Counter } from "@/common/typography/Counter";
import { GuessAttributeTile } from "@/features/games/guess-movie/components/GuessAttributeTile";
import { GuessPersonAvatar } from "@/features/games/guess-movie/components/GuessPersonAvatar";
import { MovieGenre } from "@/features/games/guess-movie/components/MovieGenre";

/** One guessed film, rendered as a Spotle-style dossier in the pixel theme. */
export const GuessCard = ({ result }: { result: GuessResult }) => {
  const movie = result.guess;
  const attr = result.attributes;
  const studioLogo = tmdbImage(movie.studio?.logoPath ?? null, "w185");
  const matchedCast = new Set(attr.cast.matchedIds ?? []);
  const matchedGenres = new Set(attr.genre.matchedIds ?? []);
  const lead = movie.cast[0] ?? null;
  const supporting = movie.cast.slice(1, 5);

  return (
    <Card as="article" className="fr-pop p-4 md:p-5">
      <div className="flex gap-4">
        <div className="relative aspect-2/3 w-[76px] shrink-0 self-start border-2 border-fr-border-strong bg-fr-surface-2 md:w-24">
          <Poster path={movie.posterPath} alt={movie.title} size="w185" iconSize={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <DisplayHeading as="h3" className="text-sm leading-snug md:text-base">
              {movie.title}
            </DisplayHeading>
            {movie.year && <Counter>{movie.year}</Counter>}
          </div>

          {movie.genres.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {movie.genres.map((genre) => (
                <MovieGenre
                  key={genre.id}
                  name={genre.name}
                  matched={matchedGenres.has(genre.id)}
                />
              ))}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <GuessAttributeTile label="Year" result={attr.year}>
              {attr.year.display}
            </GuessAttributeTile>
            <GuessAttributeTile label="Box office" result={attr.revenue}>
              {attr.revenue.display}
            </GuessAttributeTile>
            <GuessAttributeTile label="Rating" result={attr.rating}>
              {attr.rating.display === "—" ? "—" : `${attr.rating.display}/10`}
            </GuessAttributeTile>
            <GuessAttributeTile label="Studio" result={attr.studio}>
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
            </GuessAttributeTile>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-3 border-t-2 border-fr-border pt-4 md:gap-4">
        <GuessPersonAvatar
          role="Director"
          person={movie.director}
          matched={attr.director.verdict === "correct"}
        />
        <GuessPersonAvatar role="Lead" person={lead} matched={lead ? matchedCast.has(lead.id) : false} />
        {supporting.length > 0 && (
          <span className="mx-1 hidden h-12 w-0.5 self-center bg-fr-border sm:block" aria-hidden />
        )}
        {supporting.map((person) => (
          <GuessPersonAvatar
            key={person.id}
            role="Cast"
            person={person}
            matched={matchedCast.has(person.id)}
          />
        ))}
      </div>
    </Card>
  );
};
