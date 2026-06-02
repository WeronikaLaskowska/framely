import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/server/http";
import { getHiloDeck } from "@/lib/server/tmdbHilo";

export const GET = withErrorHandling("Could not load deck", async () => {
  const deck = await getHiloDeck();
  if (deck.length < 2) {
    throw new Error("Not enough films to build a deck — try again.");
  }
  return NextResponse.json({ deck });
});
