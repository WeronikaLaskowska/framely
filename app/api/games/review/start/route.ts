import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/server/http";
import { getReviewTarget } from "@/lib/server/tmdbReviews";
import { makeTargetToken } from "@/lib/server/token";

export const POST = withErrorHandling("Could not start game", async () => {
  const { id, clues } = await getReviewTarget();
  return NextResponse.json({ token: makeTargetToken(id), clues });
});
