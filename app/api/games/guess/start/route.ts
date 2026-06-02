import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/server/http";
import { pickTargetMovie } from "@/lib/server/tmdbDiscover";
import { makeTargetToken } from "@/lib/server/token";

export const POST = withErrorHandling("Could not start game", async (req: Request) => {
  let genre: number | undefined;
  try {
    const body = (await req.json()) as { genre?: unknown };
    if (typeof body?.genre === "number") genre = body.genre;
  } catch {
    /* no/empty body — classic mode */
  }
  const target = await pickTargetMovie(8, genre);
  return NextResponse.json({ token: makeTargetToken(target.id) });
});
