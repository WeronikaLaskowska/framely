import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/server/http";
import { getCastleTarget } from "@/lib/server/tmdbCastle";
import { makeTargetToken } from "@/lib/server/token";

export const POST = withErrorHandling("Could not start game", async () => {
  const { id, cast } = await getCastleTarget();
  return NextResponse.json({ token: makeTargetToken(id), cast });
});
