'use client';

import { Card } from './Card';

const PROMPTS = [
  'Explain the hardest concept simply',
  'Give me all the actionable advice',
  'What would a skeptic say about this?',
  'Turn this into a study plan',
];

/** Lightweight related suggestions / starter prompts shown under the sections. */
export function RelatedSuggestions({ onPrompt }: { onPrompt?: (p: string) => void }) {
  return (
    <Card>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
        Try asking
      </h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt?.(p)}
            className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-600 transition hover:border-blue-400 hover:text-blue-600 dark:border-zinc-800 dark:bg-zinc-800/50 dark:text-zinc-300"
          >
            {p}
          </button>
        ))}
      </div>
    </Card>
  );
}
