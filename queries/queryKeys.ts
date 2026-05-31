/**
 * Central registry of TanStack Query keys. Every query references a key from
 * here — keys are never hardcoded inline at the call site.
 */
export const queryKeys = {
  movies: {
    search: (query: string, genre?: number) =>
      ["movies", "search", query, genre ?? null] as const,
  },
  hiloGame: {
    deck: () => ["hilo-game", "deck"] as const,
  },
};
