/** Server-only: picking a secret film for Castle and exposing its billed cast
 *  (with headshots) in reveal order — least-billed first, the headline star
 *  last — so the clues get easier with every wrong guess. */
import type { CastLite } from "@/models/movie";
import {
  MIN_TARGET_REVENUE,
  type RawDetails,
  tmdbFetch,
} from "@/lib/server/tmdbClient";
import { randomPopularMovie } from "@/lib/server/tmdbDiscover";

/** How many cast members are revealed across a round. */
const CAST_COUNT = 6;
/** Need at least this many billed cast WITH a photo to make a fair board. */
const MIN_CAST = 5;

/**
 * Pick a real box-office film (>= MIN_TARGET_REVENUE) with enough photographed
 * cast, and return its id plus the reveal-ordered cast. Sampling can miss
 * (too small, thin cast, missing headshots), so we retry before giving up.
 */
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
