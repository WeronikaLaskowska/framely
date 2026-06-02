import { NextResponse } from "next/server";
import { jsonError, withErrorHandling } from "@/lib/server/http";
import { getMovieFacts } from "@/lib/server/tmdbFacts";
import { readTargetToken } from "@/lib/server/token";
import type { Hint, HintType } from "@/models/hint";

const HINT_TYPES: HintType[] = ["cast", "decade", "studio"];

export const POST = withErrorHandling("Hint failed", async (req: Request) => {
  const body = (await req.json()) as { token?: unknown; type?: unknown };
  const token = typeof body.token === "string" ? body.token : undefined;
  const type = HINT_TYPES.find((t) => t === body.type);

  const targetId = token ? readTargetToken(token) : null;
  if (targetId === null) return jsonError("Invalid game token", 400);
  if (!type) return jsonError("Unknown hint type", 400);

  const target = await getMovieFacts(targetId);

  let hint: Hint;
  if (type === "cast") {
    const person = target.cast[0] ?? null;
    hint = {
      type,
      label: "Cast member",
      value: person?.name ?? "Unknown",
      imagePath: person?.profilePath ?? null,
    };
  } else if (type === "decade") {
    const y = target.year;
    hint = {
      type,
      label: "Released",
      value: y ? `${Math.floor(y / 10) * 10}s` : "Unknown",
    };
  } else {
    hint = {
      type,
      label: "Studio",
      value: target.studio?.name ?? "Unknown",
      imagePath: target.studio?.logoPath ?? null,
    };
  }

  return NextResponse.json({ hint });
});
