type TypingDotsProps = {
  label?: string;
  className?: string;
};

/**
 * Animated three-dot "typing" indicator used while the studio waits on a
 * model response. Purely presentational.
 */
export function TypingDots({ label, className }: TypingDotsProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label ?? 'Loading'}
      className={'flex items-center gap-2 text-sm text-zinc-400 ' + (className ?? '')}
    >
      <span className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
            style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.9s' }}
          />
        ))}
      </span>
      {label && <span>{label}</span>}
    </div>
  );
}
