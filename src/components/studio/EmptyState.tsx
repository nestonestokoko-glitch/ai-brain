'use client';

const FEATURES = [
  { icon: '', title: 'Summarize videos', desc: 'Short & detailed summaries, takeaways, timestamps.' },
  { icon: '', title: 'Create podcasts', desc: 'Episode notes, summaries, and discussion points.' },
  { icon: '', title: 'Chat with videos', desc: 'Ask questions and get grounded answers.' },
  { icon: '', title: 'Build an AI Brain', desc: 'Combine many videos into one knowledge base.' },
];

/** Beautiful landing state shown before any video is added. */
export function EmptyState() {
  return (
    <div className="mt-10 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-3xl">
          Turn any YouTube video into an interactive knowledge system
        </h2>
        <p className="mt-3 text-zinc-600 dark:text-zinc-300">
          Paste a link above to get started. No account needed.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-zinc-200 bg-white p-5 text-left dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="text-2xl">{f.icon}</div>
            <h3 className="mt-3 font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
