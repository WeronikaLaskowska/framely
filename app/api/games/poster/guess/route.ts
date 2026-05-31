import { NextResponse } from "next/server";
import { getMovieFacts } from "@/lib/server/tmdbFacts";
import { readTargetToken } from "@/lib/server/token";

/**
 * POST /api/games/poster/guess
 * Body: { token: string, movieId?: number, reveal?: boolean }
 * Returns { correct, target? }. The target's facts come back when the guess
 * is right or when the player reveals (gives up / runs out of attempts).
 */
export async function POST(req: Request) {
  try {
    const { token, movieId, reveal } = (await req.json()) as {
      token?: string;
      movieId?: number;
      reveal?: boolean;
    };

    const targetId = token ? readTargetToken(token) : null;
    if (targetId === null) {
      return NextResponse.json({ error: "Invalid game token" }, { status: 400 });
    }

    if (reveal) {
      const target = await getMovieFacts(targetId);
      return NextResponse.json({ correct: false, target });
    }

    if (typeof movieId !== "number") {
      return NextResponse.json({ error: "movieId is required" }, { status: 400 });
    }

    const correct = movieId === targetId;
    const target = correct ? await getMovieFacts(targetId) : null;
    return NextResponse.json({ correct, target });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Guess failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
