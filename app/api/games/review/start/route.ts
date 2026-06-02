import { NextResponse } from "next/server";
import { getReviewTarget } from "@/lib/server/tmdbReviews";
import { makeTargetToken } from "@/lib/server/token";

export async function POST() {
  try {
    const { id, clues } = await getReviewTarget();
    return NextResponse.json({ token: makeTargetToken(id), clues });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
