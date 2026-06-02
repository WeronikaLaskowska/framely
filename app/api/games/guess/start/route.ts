import { NextResponse } from "next/server";
import { pickTargetMovieId } from "@/lib/server/tmdbDiscover";
import { makeTargetToken } from "@/lib/server/token";

export async function POST(req: Request) {
  try {
    let genre: number | undefined;
    try {
      const body = (await req.json()) as { genre?: unknown };
      if (typeof body?.genre === "number") genre = body.genre;
    } catch {
      /* no/empty body — classic mode */
    }
    const targetId = await pickTargetMovieId(8, genre);
    return NextResponse.json({ token: makeTargetToken(targetId) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
