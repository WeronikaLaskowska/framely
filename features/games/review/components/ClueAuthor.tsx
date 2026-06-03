type ClueAuthorProps = {
  author: string;
};

export const ClueAuthor = ({ author }: ClueAuthorProps) => (
  <p className="mt-3 text-right text-xs text-fr-fg-subtle">— {author}</p>
);
