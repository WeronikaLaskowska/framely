import { NextResponse } from "next/server";
import { getCastleTarget } from "@/lib/server/tmdbCastle";
import { makeTargetToken } from "@/lib/server/token";

export async function POST() {
  try {
    const { id, cast } = await getCastleTarget();
    return NextResponse.json({ token: makeTargetToken(id), cast });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start game";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
