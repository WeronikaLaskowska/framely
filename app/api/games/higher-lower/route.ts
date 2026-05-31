import { NextResponse } from "next/server";
import { getHiloDeck } from "@/lib/tmdb";

/**
 * GET /api/games/higher-lower
 * Returns a shuffled deck of well-known films, each carrying its box office and
 * rating so the client can run either Higher or Lower mode. No hidden answer —
 * the stats are the game — so no token is needed.
 */
export async function GET() {
  try {
    const deck = await getHiloDeck();
    if (deck.length < 2) {
      throw new Error("Not enough films to build a deck — try again.");
    }
    return NextResponse.json({ deck });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load deck";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
