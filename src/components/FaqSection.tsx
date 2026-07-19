'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'What is AI Brain?',
    a: 'AI Brain is your personal knowledge workspace. It turns YouTube videos, podcasts, articles, and PDFs into clean, structured summaries you can search and revisit anytime.',
  },
  {
    q: 'What kinds of content can I summarize?',
    a: 'You can import YouTube links, podcast audio, web articles, and PDF documents. We transcribe, extract, and distill the key ideas from all of them.',
  },
  {
    q: 'How accurate are the summaries?',
    a: 'Summaries are generated from the full transcript or text, so they stay faithful to the source. Pick from quick takeaways, five key points, detailed notes, or beginner-friendly explainers.',
  },
  {
    q: 'Can I search everything I save?',
    a: 'Yes. Every summary is saved to your personal library and is searchable by keyword or topic, so your past reading is always one search away.',
  },
  {
    q: 'Is my data private?',
    a: 'Your library is yours. Saved content stays in your account and is never used to train shared models without your permission.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. AI Brain runs in your browser — paste a link and get a summary in minutes.',
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-black pb-12 pt-12">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
          Everything you need to know about your AI Brain.
        </p>

        {/* FAQ items as buttons in a vertical column (gap-3). */}
        <div className="mt-10 flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-base font-medium text-white">{item.q}</span>
                  {/* Plus/Minus toggle: two absolute spans; the vertical one
                      rotates 90deg (plus) → 0deg (minus) when open. */}
                  <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white shadow-sm">
                    <span
                      className="absolute left-1/2 top-1/2 h-0.5 w-3.5 rounded-full bg-zinc-900"
                      style={{ transform: 'translate(-50%, -50%) rotate(0deg)' }}
                    />
                    <span
                      className="absolute left-1/2 top-1/2 h-0.5 w-3.5 rounded-full bg-zinc-900 transition-transform duration-300"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${
                          isOpen ? 0 : 90
                        }deg)`,
                      }}
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
