/** Fixed ambient stage: projector haze, film grain and a cinema vignette. */
export function Atmosphere() {
  return (
    <>
      <div className="fr-atmosphere" aria-hidden />
      <div className="fr-grain" aria-hidden />
      <div className="fr-vignette" aria-hidden />
    </>
  );
}
