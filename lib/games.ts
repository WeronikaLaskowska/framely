/** Static metadata for the games — shared by the landing preview and the
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
  {
    slug: "spotle-genre",
    href: "/games/spotle-genre",
    index: "003",
    title: "By Genre",
    tagline: "Spotle, one genre",
    description:
      "The same six-clue hunt, but you pick the genre first. The secret film — and every guess — stays locked to it, so it's all action, horror, sci-fi or whatever you choose.",
    accent: "ember",
  },
  {
    slug: "higher-lower",
    href: "/games/higher-lower",
    index: "004",
    title: "Higher or Lower",
    tagline: "Beat the stat",
    description:
      "Two films, one question: did the next one gross more - or score higher — than the last? Tap higher or lower, keep the chain alive and chase your longest streak.",
    accent: "cool",
  },
  {
    slug: "review",
    href: "/games/review",
    index: "005",
    title: "Reviews",
    tagline: "Read the verdict",
    description:
      "Real audience reviews, with the title blacked out. Read the verdict and name the film — each wrong guess uncovers another review to help you close in.",
    accent: "ember",
  },
];
