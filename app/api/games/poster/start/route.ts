import { NextResponse } from "next/server";
import { randomPopularMovie } from "@/lib/server/tmdbDiscover";
import { makeTargetToken } from "@/lib/server/token";

/**
 * POST /api/games/poster/start
 * Picks a hidden movie that has a poster and returns its poster path plus a
 * signed token. The title is never sent — the player must read the artwork.
 */
export async function POST() {
  try {
    const target = await randomPopularMovie(true);
    return NextResponse.json({
      token: makeTargetToken(target.id),
      posterPath: target.posterPath,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
