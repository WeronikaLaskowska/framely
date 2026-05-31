/**
 * Fixed perforated film-strip rails framing the viewport on wide screens.
 * Purely decorative — static sprocket-hole edges, no motion.
 */
export const FilmRails = () => (
  <div aria-hidden>
    <div className="fr-rail fr-rail--left" />
    <div className="fr-rail fr-rail--right" />
  </div>
);
