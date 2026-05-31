import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";

/** GET /api/movies/search?q=blade&genre=28 — autocomplete for guesses (>= 1980). */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const q = params.get("q") ?? "";
  const genreParam = Number(params.get("genre"));
  const genre = Number.isFinite(genreParam) && genreParam > 0 ? genreParam : undefined;
  try {
    const results = await searchMovies(q, genre);
    return NextResponse.json({ results });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
