/**
 * Fixed perforated film-strip rails framing the viewport on wide screens.
 * Purely decorative — static sprocket-hole edges, no motion.
 */
export function FilmRails() {
  return (
    <div className="fr-rails" aria-hidden>
      <div className="fr-rail fr-rail--left" />
      <div className="fr-rail fr-rail--right" />
    </div>
  );
}
