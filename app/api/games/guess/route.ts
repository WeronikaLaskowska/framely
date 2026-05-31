import { NextResponse } from "next/server";
import { getMovieFacts } from "@/lib/tmdb";
import { compareFacts } from "@/lib/compare";
import { readTargetToken } from "@/lib/token";

/**
 * POST /api/games/guess
 * Body: { token: string, movieId?: number, reveal?: boolean }
 *
 * - With movieId: compares the guess against the hidden target and returns a
 *   GuessResult. The target's facts are only included when the guess is right.
 * - With reveal: returns the target's facts (used by "give up").
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

    const target = await getMovieFacts(targetId);

    if (reveal) {
      return NextResponse.json({ target });
    }

    if (typeof movieId !== "number") {
      return NextResponse.json({ error: "movieId is required" }, { status: 400 });
    }

    const guess = await getMovieFacts(movieId);
    const result = compareFacts(guess, target);

    return NextResponse.json({
      result,
      target: result.correct ? target : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Guess failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
