import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/server/http";
import { pickTargetMovie } from "@/lib/server/tmdbDiscover";
import { makeTargetToken } from "@/lib/server/token";

export const POST = withErrorHandling("Could not start game", async () => {
  const target = await pickTargetMovie();
  return NextResponse.json({
    token: makeTargetToken(target.id),
    posterPath: target.posterPath,
  });
});
