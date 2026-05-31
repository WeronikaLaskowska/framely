import { NextResponse } from "next/server";
import { resolveTokenGuess } from "@/lib/server/resolveGuess";

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

    const result = await resolveTokenGuess(token, movieId, reveal);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json({ correct: result.correct, target: result.target });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Guess failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
