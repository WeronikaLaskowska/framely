import { NextResponse } from "next/server";
import { getHiloDeck } from "@/lib/server/tmdbHilo";

export async function GET() {
  try {
    const deck = await getHiloDeck();
    if (deck.length < 2) {
      throw new Error("Not enough films to build a deck — try again.");
    }
    return NextResponse.json({ deck });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not load deck";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
