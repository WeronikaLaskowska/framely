/** Static metadata for the two games — shared by the landing preview and the
 *  /games selection screen so the copy stays in one place. */

export type GameMeta = {
  slug: string;
  href: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  accent: "ember" | "cool";
};

export const GAMES: GameMeta[] = [
  {
    slug: "guess-movie",
    href: "/games/guess-movie",
    index: "001",
    title: "Spotle",
    tagline: "Guess the movie",
    description:
      "Name films one at a time. Each guess lights up green, amber or grey across genre, year, box office, rating, studio and cast — closing in on the secret movie.",
    accent: "ember",
  },
  {
    slug: "poster",
    href: "/games/poster",
    index: "002",
    title: "Poster",
    tagline: "Read the artwork",
    description:
      "A poster hidden behind frosted tiles. Each wrong guess clears another fragment. Pick easy, medium or hard and race to name it before it's fully revealed.",
    accent: "cool",
  },
];
