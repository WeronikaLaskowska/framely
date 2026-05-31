/** Shared button skins, reused by both <Button> and <ButtonLink>. */
export type ButtonVariant = "ember" | "ghost";

export const buttonVariantClass: Record<ButtonVariant, string> = {
  ember: "fr-btn fr-btn--ember",
  ghost: "fr-btn fr-btn--ghost",
};
