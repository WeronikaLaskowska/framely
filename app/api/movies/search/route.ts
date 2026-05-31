import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

/** GET /api/movies/search?q=blade — autocomplete for guesses (>= 1980). */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  try {
    const results = await searchMovies(q);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
