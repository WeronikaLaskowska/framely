"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GENRES, type Genre } from "@/lib/genres";
import { GuessGame } from "@/features/games/guess-movie/guess-game";

/** Genre selection gate that then mounts the guess game locked to that genre. */
export function SpotleGenre() {
  const [genre, setGenre] = useState<Genre | null>(null);

  if (genre) {
    return (
      <GuessGame
        genre={genre.id}
        genreName={genre.name}
        backHref="/games/spotle-genre"
      />
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
      <Link
        href="/games"
        className="inline-flex items-center gap-2 text-sm text-fr-fg-muted transition-colors hover:text-fr-fg"
      >
        <ArrowLeft size={15} /> Games
      </Link>

      <header className="mt-6">
        <span className="fr-tape">Spotle · by genre</span>
        <h1 className="fr-display mt-4 text-[clamp(2rem,6vw,3.25rem)]">
          Pick a <span className="fr-ember-text">genre</span>
        </h1>
        <p className="mt-3 max-w-xl text-sm text-fr-fg-muted">
          The secret film — and every guess you can make — is locked to the
          genre you choose.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {GENRES.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGenre(g)}
            className="fr-btn fr-btn--ghost cursor-pointer px-4 py-4 text-xs"
          >
            {g.name}
          </button>
        ))}
      </div>
    </main>
  );
}
