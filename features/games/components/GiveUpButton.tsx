type GiveUpButtonProps = {
  onClick: () => void;
};

export const GiveUpButton = ({ onClick }: GiveUpButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="mx-auto text-xs uppercase tracking-widest text-fr-fg-subtle transition-colors hover:text-fr-close"
  >
    Give up
  </button>
);
