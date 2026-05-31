import { NextResponse } from "next/server";
import { pickTargetMovieId } from "@/lib/tmdb";
import { makeTargetToken } from "@/lib/token";

/**
 * POST /api/games/guess/start
 * Picks a hidden target movie (recent + real box-office hit) and returns a
 * signed token only. No facts about the movie leak to the client.
 */
export async function POST() {
  try {
    const targetId = await pickTargetMovieId();
    return NextResponse.json({ token: makeTargetToken(targetId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
