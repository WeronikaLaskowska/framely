/** The four extending corner brackets used inside cards and frames. */
export function CornerFrame() {
  return (
    <div className="fr-corners" aria-hidden>
      <span className="fr-corner fr-corner--tl" />
      <span className="fr-corner fr-corner--tr" />
      <span className="fr-corner fr-corner--bl" />
      <span className="fr-corner fr-corner--br" />
    </div>
  );
}
