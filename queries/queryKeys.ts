export const queryKeys = {
  movies: {
    search: (query: string, genre?: number) =>
      ["movies", "search", query, genre ?? null] as const,
  },
  hiloGame: {
    deck: () => ["hilo-game", "deck"] as const,
  },
};
