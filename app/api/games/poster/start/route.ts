import { NextResponse } from "next/server";
import { pickTargetMovieId } from "@/lib/server/tmdbDiscover";
import { getMovieFacts } from "@/lib/server/tmdbFacts";
import { makeTargetToken } from "@/lib/server/token";

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
