import { NextResponse } from "next/server";
import { jsonError, withErrorHandling } from "@/lib/server/http";
import { parseGuessBody, resolveCompareGuess } from "@/lib/server/resolveGuess";

export const POST = withErrorHandling("Guess failed", async (req: Request) => {
  const outcome = await resolveCompareGuess(parseGuessBody(await req.json()));
  if (!outcome.ok) return jsonError(outcome.error, outcome.status);
  if (outcome.reveal) return NextResponse.json({ target: outcome.target });
  return NextResponse.json({ result: outcome.result, target: outcome.target });
});
