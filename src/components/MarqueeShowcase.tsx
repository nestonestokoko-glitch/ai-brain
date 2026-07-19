'use client';

import { Fragment } from 'react';
import { cn } from '@/lib/utils';

type Review = {
  name: string;
  text: string;
};

// AI Brain testimonials shown inside the marquee cards.
const reviews: Review[] = [
  {
    name: 'Priya Sharma',
    text: 'AI Brain turned my messy YouTube watchlist into a clean, searchable knowledge base. I find old insights in seconds now.',
  },
  {
    name: 'Marcus Lee',
    text: 'The summaries are shockingly accurate — like having a research assistant that never sleeps.',
  },
  {
    name: 'Elena Rossi',
    text: 'I paste a PDF and get a structured brief. Onboarding docs that took days now take minutes.',
  },
  {
    name: 'Dev Patel',
    text: 'Chatting with my saved videos is the killer feature. Ask a question, get the exact moment answered.',
  },
  {
    name: 'Sofia Nguyen',
    text: 'Clean, fast, and genuinely beautiful. It replaced three separate note apps for me.',
  },
  {
    name: 'James Carter',
    text: 'The podcast-to-notes flow is magic. I review episodes on my commute without rewinding.',
  },
  {
    name: 'Aisha Khan',
    text: 'Finally a tool that respects my time. Summaries are tight and actually useful, not fluff.',
  },
  {
    name: 'Tom Becker',
    text: 'I built a second brain in a weekend. The AI organizing is smarter than I expected.',
  },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#F59E0B"
          aria-hidden="true"
        >
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="mr-6 flex min-h-[203.85px] w-[260px] shrink-0 flex-col justify-between rounded-xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.12)] md:w-[340px]">
      <p className="text-[15px] leading-relaxed text-zinc-600">{review.text}</p>
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F95C01] text-sm font-semibold text-white">
          {initials(review.name)}
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900">{review.name}</p>
          <Stars />
        </div>
      </div>
    </div>
  );
}

type CompareRow = {
  feature: string;
  competitors: boolean;
  brain: boolean;
};

const comparisonRows: CompareRow[] = [
  { feature: 'Unlimited video summaries', competitors: false, brain: true },
  { feature: 'Multi-source (YouTube, PDF, articles)', competitors: false, brain: true },
  { feature: 'Chat with your saved library', competitors: true, brain: true },
  { feature: 'AI podcast generation', competitors: false, brain: true },
  { feature: 'Accurate, fast transcripts', competitors: true, brain: true },
  { feature: 'Private, own your data', competitors: false, brain: true },
];

function Mark({ on }: { on: boolean }) {
  return on ? (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D1FE17"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#71717a"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function MarqueeShowcase() {
  // Duplicate each row so the -50% translation loops seamlessly. The trailing
  // margin on every card makes one set exactly half the row width.
  const topRow = [...reviews, ...reviews];
  const bottomRow = [...reviews, ...reviews];

  return (
    <section className="border-y border-white/10 bg-black py-20">
      {/* Marquee lives inside the static orange background card. */}
      <div className="mx-auto max-w-[1440px] px-8">
        <div className="relative h-[807.7px] w-full overflow-hidden rounded-[26.4px] bg-[#D1FE17]">
          <div className="flex h-full flex-col justify-center gap-8 p-8">
            {/* Announcement pill — shrinks to its text width (self-center in
                the flex column) with a blue background. */}
            <div className="group self-center rounded-full bg-blue-600 px-4 py-2 text-center">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-[#D1FE17]" />
                New — AI Brain just got smarter
              </span>
            </div>

            {/* Heading lives inside the orange card, in black. */}
            <div className="text-center">
              <p className="text-base font-semibold uppercase tracking-widest text-black/70">
                Testimonials
              </p>
              <h2 className="mt-2 text-4xl font-bold tracking-tight text-black md:text-6xl">
                Loved by everyone using AI Brain
              </h2>
            </div>

            {/* Top row: slides left → right */}
            <div className="marquee-row review-row-1">
              {topRow.map((r, i) => (
                <ReviewCard key={`t-${i}`} review={r} />
              ))}
            </div>
            {/* Bottom row: slides right → left */}
            <div className="marquee-row review-row-2">
              {bottomRow.map((r, i) => (
                <ReviewCard key={`b-${i}`} review={r} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison grid */}
      <div className="mx-auto mt-16 max-w-[768px] px-6">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-bold tracking-tight text-white">Why AI Brain?</h3>
          <p className="mt-3 text-base text-zinc-400">
            See why creators pick AI Brain over every other AI tool. AI Brain gives
            you everything you need to make viral videos, all in one place.
          </p>
        </div>
        <div className="grid grid-cols-[1.7fr_1fr_1fr] overflow-hidden rounded-2xl border border-white/10">
          <div className="bg-white/[0.06] p-4 font-bold text-white">Feature</div>
          <div className="bg-white/[0.06] p-4 text-center text-sm font-semibold text-zinc-300">
            Competitors
          </div>
          <div className="bg-[#D1FE17]/10 p-4 text-center text-sm font-bold text-[#D1FE17]">
            AI BRAIN
          </div>

          {comparisonRows.map((row, i) => (
            <Fragment key={i}>
              <div
                className={cn(
                  'border-t border-white/10 p-3 text-sm text-zinc-200',
                  i % 2 === 1 && 'bg-white/[0.02]'
                )}
              >
                {row.feature}
              </div>
              <div
                className={cn(
                  'border-t border-white/10 flex items-center justify-center',
                  i % 2 === 1 && 'bg-white/[0.02]'
                )}
              >
                <Mark on={row.competitors} />
              </div>
              <div
                className={cn(
                  'border-t border-white/10 flex items-center justify-center bg-[#D1FE17]/5',
                  i % 2 === 1 && 'bg-[#D1FE17]/[0.03]'
                )}
              >
                <Mark on={row.brain} />
              </div>
            </Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-row {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        @keyframes marquee-l {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-r {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .review-row-1 { animation: marquee-r 65s linear infinite; }
        .review-row-2 { animation: marquee-l 75s linear infinite; }
      `}</style>
    </section>
  );
}
