/** Paid hints the player can unlock in the guess game. */

export type HintType = "cast" | "decade" | "studio";

export type Hint = {
  type: HintType;
  /** Short caption, e.g. "Cast member". */
  label: string;
  /** The revealed value, e.g. "Eddie Murphy" or "2000s". */
  value: string;
  /** Optional TMDB image path (cast headshot or studio logo) for display. */
  imagePath?: string | null;
};
