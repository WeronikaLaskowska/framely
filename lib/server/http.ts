/**
 * Shared helpers for route handlers: JSON error responses and a wrapper that
 * turns thrown errors into a 500 with the error's message (domain errors like
 * "try again" are intended to reach the client), falling back to a generic
 * message for non-Error throws.
 */
import { NextResponse } from "next/server";

export const jsonError = (message: string, status = 500): NextResponse =>
  NextResponse.json({ error: message }, { status });

export const withErrorHandling =
  <A extends unknown[]>(
    fallbackMessage: string,
    handler: (...args: A) => Promise<NextResponse>,
  ) =>
  async (...args: A): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      return jsonError(err instanceof Error ? err.message : fallbackMessage);
    }
  };
