import { NextResponse } from "next/server";
import { getMovieFacts } from "@/lib/tmdb";
import { readTargetToken } from "@/lib/token";
import type { Hint, HintType } from "@/lib/types";

const HINT_TYPES: HintType[] = ["cast", "decade", "studio"];

/**
 * POST /api/games/guess/hint
 * Body: { token: string, type: HintType }
 *
 * Returns a single revealed fact about the hidden target — never the whole
 * movie — so a player can buy a nudge without the answer leaking wholesale.
 */
export async function POST(req: Request) {
  try {
    const { token, type } = (await req.json()) as { token?: string; type?: HintType };

    const targetId = token ? readTargetToken(token) : null;
    if (targetId === null) {
      return NextResponse.json({ error: "Invalid game token" }, { status: 400 });
    }
    if (!type || !HINT_TYPES.includes(type)) {
      return NextResponse.json({ error: "Unknown hint type" }, { status: 400 });
    }

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
  } catch (err) {
    const message = err instanceof Error ? err.message : "Hint failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
