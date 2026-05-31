import { NextResponse } from "next/server";
import { getCastleTarget } from "@/lib/server/tmdbCastle";
import { makeTargetToken } from "@/lib/server/token";

/**
 * POST /api/games/castle/start
 * Picks a hidden movie and returns its billed cast (in reveal order) plus a
 * signed token. The title is never sent — the player names the film from the
 * faces alone.
 */
export async function POST() {
  try {
    const { id, cast } = await getCastleTarget();
    return NextResponse.json({ token: makeTargetToken(id), cast });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
