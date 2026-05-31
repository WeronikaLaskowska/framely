/** A single audience review served as a clue — title already redacted. */
export type ReviewClue = {
  id: string;
  author: string;
  rating: number | null;
  content: string;
};
