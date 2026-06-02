export const DebugAnswer = ({ title }: { title: string | null }) => {
  if (process.env.NODE_ENV === "production" || !title) return null;
  return (
    <div className="border-2 border-dashed border-fr-close/50 bg-fr-close/10 px-3 py-2 font-mono text-xs text-fr-close">
      DEBUG · answer: {title}
    </div>
  );
};
