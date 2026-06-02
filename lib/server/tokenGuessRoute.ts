import { NextResponse } from "next/server";
import { jsonError, withErrorHandling } from "@/lib/server/http";
import { parseGuessBody, resolveTokenGuess } from "@/lib/server/resolveGuess";


export const tokenGuessRoute = withErrorHandling("Guess failed", async (req: Request) => {
  const result = await resolveTokenGuess(parseGuessBody(await req.json()));
  if (!result.ok) return jsonError(result.error, result.status);
  return NextResponse.json({ correct: result.correct, target: result.target });
});
