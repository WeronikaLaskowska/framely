"use client";

import { useState } from "react";
import type { Genre } from "@/models/genre";
import { GenrePicker } from "@/features/games/guess-movie/components/GenrePicker";
import { GuessGameScreen } from "@/features/games/guess-movie/screens/GuessGameScreen";

/** Picks a genre, then mounts the guess game locked to that genre. */
export const SpotleGenreScreen = () => {
  const [genre, setGenre] = useState<Genre | null>(null);

  if (genre) {
    return (
      <GuessGameScreen
        genre={genre.id}
        genreName={genre.name}
        backHref="/games/spotle-genre"
      />
    );
  }

  return <GenrePicker onPick={setGenre} />;
};
