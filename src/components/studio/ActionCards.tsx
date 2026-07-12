'use client';

import { Card } from './Card';

export type StudioAction = 'summary' | 'podcast' | 'chat' | 'brain';

const ACTIONS: {
  id: StudioAction;
  icon: string;
  title: string;
  desc: string;
}[] = [
  {
    id: 'summary',
    icon: '',
    title: 'Summarize Video',
    desc: 'Short & detailed summary, key takeaways, timestamps, and action items.',
  },
  {
    id: 'podcast',
    icon: '',
    title: 'Podcast Mode',
    desc: 'Turn the video into episode notes, summary, and discussion highlights.',
  },
  {
    id: 'chat',
    icon: '',
    title: 'Chat With Video',
    desc: 'Ask anything about the video and get grounded, specific answers.',
  },
  {
    id: 'brain',
    icon: '',
    title: 'Create AI Brain',
    desc: 'Combine multiple videos into one knowledge base you can question.',
  },
];

/** Four feature cards. Clicking one opens the matching section. */
export function ActionCards({
  onSelect,
  active,
}: {
  onSelect: (action: StudioAction) => void;
  active: StudioAction | null;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ACTIONS.map((a) => {
        const isActive = active === a.id;
        return (
          <button
            key={a.id}
            onClick={() => onSelect(a.id)}
            className={
              'rounded-2xl border p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ' +
              (isActive
                ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30'
                : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900')
            }
          >
            <div className="text-2xl">{a.icon}</div>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">
              {a.title}
            </h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{a.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
