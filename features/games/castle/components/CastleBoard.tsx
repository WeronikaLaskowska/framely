import { User } from "lucide-react";
import type { CastLite } from "@/models/movie";
import { Poster } from "@/common/ui/Poster";

type CastleBoardProps = {
  cast: CastLite[];
  revealedCount: number;
};

/** Grid of billed faces; the first `revealedCount` show a headshot + name, the
 *  rest stay as anonymous silhouettes until a wrong guess uncovers them. */
export const CastleBoard = ({ cast, revealedCount }: CastleBoardProps) => (
  <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
    {cast.map((member, i) => {
      const revealed = i < revealedCount;
      return (
        <div key={member.id} className="flex flex-col gap-2">
          <div className="relative aspect-2/3 overflow-hidden border-2 border-fr-border-strong bg-fr-surface">
            {revealed ? (
              <Poster path={member.profilePath} alt={member.name} size="w185" />
            ) : (
              <span className="grid h-full w-full place-items-center text-fr-border-strong">
                <User size={40} />
              </span>
            )}
          </div>
          <p className="truncate text-center text-xs text-fr-fg-muted">
            {revealed ? member.name : "???"}
          </p>
        </div>
      );
    })}
  </div>
);
