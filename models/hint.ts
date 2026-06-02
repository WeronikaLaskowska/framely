export type HintType = "cast" | "decade" | "studio";

export type Hint = {
  type: HintType;
  label: string;
  value: string;
  imagePath?: string | null;
};
