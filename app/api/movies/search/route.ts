import { NextResponse } from "next/server";
import { withErrorHandling } from "@/lib/server/http";
import { searchMovies } from "@/lib/server/tmdbSearch";

export const GET = withErrorHandling("Search failed", async (req: Request) => {
  const params = new URL(req.url).searchParams;
  const q = params.get("q") ?? "";
  const genreParam = Number(params.get("genre"));
  const genre = Number.isFinite(genreParam) && genreParam > 0 ? genreParam : undefined;

  const results = await searchMovies(q, genre);
  return NextResponse.json({ results });
});
