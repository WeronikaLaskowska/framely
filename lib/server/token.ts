/**
 * Opaque, tamper-proof token that carries the hidden target movie id.
 *
 * The games run without a database: the secret movie id is handed to the
 * client as a signed token. The client echoes it back with each guess; the
 * server verifies the signature before trusting the id, so a player can't
 * forge a new valid token (they can read the id but the plain id alone is
 * useless against the guess endpoint).
 *
 * Server-only: imported exclusively by route handlers.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

const secret = (): string =>
  // Reuse the TMDB key as an HMAC secret — it already lives only on the server.
  process.env.TMDB_API_KEY ?? "framely-dev-secret";

const sign = (payload: string): string =>
  createHmac("sha256", secret()).update(payload).digest("base64url");

export const makeTargetToken = (id: number): string => {
  const payload = String(id);
  const body = Buffer.from(payload).toString("base64url");
  return `${body}.${sign(payload)}`;
};

export const readTargetToken = (token: string): number | null => {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(body, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const id = Number(payload);
  return Number.isInteger(id) ? id : null;
};
