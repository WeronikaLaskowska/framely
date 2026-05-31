import { NextResponse } from "next/server";
import { pickTargetMovieId } from "@/lib/server/tmdbDiscover";
import { getMovieFacts } from "@/lib/server/tmdbFacts";
import { makeTargetToken } from "@/lib/server/token";

/**
 * POST /api/games/poster/start
 * Picks a hidden box-office movie (>= 50M, like the other games) that has a
 * poster and returns its poster path plus a signed token. The title is never
 * sent — the player must read the artwork.
 */
export async function POST() {
  try {
    const id = await pickTargetMovieId();
    const facts = await getMovieFacts(id);
    return NextResponse.json({
      token: makeTargetToken(id),
      posterPath: facts.posterPath,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
