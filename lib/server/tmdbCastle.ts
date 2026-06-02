import type { CastLite } from "@/models/movie";
import {
  MIN_TARGET_REVENUE,
  type RawDetails,
  tmdbFetch,
} from "@/lib/server/tmdbClient";
import { randomPopularMovie } from "@/lib/server/tmdbDiscover";

const CAST_COUNT = 6;
const MIN_CAST = 5;

export const getCastleTarget = async (
  maxAttempts = 18,
): Promise<{ id: number; cast: CastLite[] }> => {
  for (let i = 0; i < maxAttempts; i++) {
    const candidate = await randomPopularMovie();
    const details = await tmdbFetch<RawDetails>(`/movie/${candidate.id}`, {
      append_to_response: "credits",
    });
    if ((details.revenue ?? 0) < MIN_TARGET_REVENUE) continue;

    const billed = (details.credits?.cast ?? [])
      .filter((c) => c.profile_path)
      .sort((a, b) => a.order - b.order)
      .slice(0, CAST_COUNT)
      .map<CastLite>((c) => ({ id: c.id, name: c.name, profilePath: c.profile_path }));
    if (billed.length < MIN_CAST) continue;

    // Reveal the least-billed names first; the headline star comes last.
    return { id: details.id, cast: billed.reverse() };
  }
  throw new Error("Could not find a film with a usable cast — try again");
};
