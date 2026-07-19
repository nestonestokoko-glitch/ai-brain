import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import MobileNav from '@/components/MobileNav';
import Hero from '@/components/Hero';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { SparkIcon } from '@/components/workspace/icons';
import { AuthLink } from '@/components/auth/AuthLink';
import { UserMenu } from '@/components/auth/UserMenu';
import Image from 'next/image';

const features = [
  {
    title: 'YouTube Summarization',
    body: 'Paste a link and get a clean, structured summary of any video — transcripts pulled automatically.',
  },
  {
    title: 'Podcast Transcription',
    body: 'Turn long audio into searchable text and tight summaries you can actually finish.',
  },
  {
    title: 'Article Extraction',
    body: 'Strip the clutter from articles and web pages, then distill the key ideas in seconds.',
  },
  {
    title: 'Personal Library',
    body: 'Every summary is saved to your own knowledge base, organized and ready to revisit.',
  },
  {
    title: 'Search & Revisit',
    body: 'Find anything you saved by keyword or topic. Your past reading is always one search away.',
  },
  {
    title: 'Multiple Formats',
    body: 'Quick takeaways, five key points, detailed notes, or beginner-friendly explainers — your call.',
  },
];

const steps = [
  {
    title: 'Import Content',
    body: 'Drop in a YouTube link, podcast, or article URL. One click and it’s captured.',
  },
  {
    title: 'AI Processes It',
    body: 'We transcribe, extract, and distill the signal from hours of content.',
  },
  {
    title: 'Read & Save',
    body: 'Get a clean summary you can read in minutes and keep forever in your library.',
  },
];

const benefits = [
  {
    title: 'Save time',
    body: 'Turn a three-hour podcast into a five-minute read. Skip what doesn’t matter.',
  },
  {
    title: 'Learn faster',
    body: 'Absorb the ideas, not the filler. Retain more by reading instead of binge-watching.',
  },
  {
    title: 'Build a knowledge base',
    body: 'Stop drowning in open tabs. Keep everything in one searchable place.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-zinc-100">
      <ScrollReveal />
      {/* Floating capsule nav — fixed, centered, enlarged; adapted from the
          spec's sticky capsule (dark translucent instead of off-white). */}
      <header className="fixed left-1/2 top-3 z-50 w-[calc(100vw-1rem)] -translate-x-1/2 sm:top-5 sm:w-auto">
        <div
          className="flex items-center justify-between gap-3 rounded-full border border-white/10 px-4 py-2 backdrop-blur-xl sm:gap-6 sm:px-7 sm:py-3"
          style={{
            background: 'rgba(5,7,13,0.72)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          }}
        >
          <Link href="/" className="flex items-center whitespace-nowrap">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="mr-2" priority />
          </Link>
          <nav className="hidden items-center gap-7 text-base font-medium text-zinc-300 md:flex">
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <AuthLink href="/studio" className="transition hover:text-white">
              Studio
            </AuthLink>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <AuthLink
              href="/library"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/5 sm:block sm:px-4 sm:text-base"
            >
              Library
            </AuthLink>
            <AuthLink
              href="/studio"
              className="group relative inline-flex h-10 shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-[40px] border-2 border-black/5 px-4 text-sm font-semibold text-white transition-all duration-300 ease-out hover:scale-105 active:scale-100 sm:h-11 sm:px-6 sm:text-[17px]"
              style={{
                backgroundColor: 'rgb(110, 70, 30)',
                boxShadow: 'inset 0 -4px 4px 0 rgb(19, 99, 72)',
              }}
            >
              <span className="relative">OpenAI Studio</span>
            </AuthLink>
            <UserMenu />
            <MobileNav />
          </div>
        </div>
      </header>

      <Hero />

      {/* How it works */}
      <section id="how" className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
            Three simple steps from a raw link to a saved summary.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => (
              <CardSpotlight key={s.title} className="p-6">
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything you need to read less, learn more
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <CardSpotlight key={f.title} className="p-6" href="/studio">
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.body}</p>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      {/* Example summary preview */}
      <section className="border-y border-white/10 bg-white/[0.02] py-20">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-blue-300">
            Example summary
          </p>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white">
            This is what you get
          </h2>
          <div className="ws-card mt-10 overflow-hidden ws-reveal">
            <div className="flex items-center gap-3 border-b border-white/10 px-6 py-4">
              <span className="rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">
                YouTube
              </span>
              <span className="truncate text-sm font-medium text-zinc-200">
                The Science of Better Learning — Full Talk
              </span>
            </div>
            <div className="space-y-6 px-6 py-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Five key points
                </h4>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
                  <li>Spaced repetition beats cramming for long-term recall.</li>
                  <li>Teaching a concept forces you to find the gaps in your own understanding.</li>
                  <li>Active recall is more effective than re-reading by a wide margin.</li>
                  <li>Interleaving topics improves discrimination between similar ideas.</li>
                  <li>Sleep consolidates memory — rest is part of the study plan.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.06] p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-300">
                  AI summary
                </h4>
                <p className="mt-2 text-sm text-zinc-300">
                  The talk reframes learning as a process of retrieval, not consumption.
                  The speaker argues most study time is wasted on passive re-reading, and
                  shows how small habits — quizzes, teaching, and rest — compound into
                  dramatically better retention.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Why people use Second Brain AI
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <CardSpotlight key={b.title} className="p-6">
                <h3 className="text-lg font-semibold text-white">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{b.body}</p>
              </CardSpotlight>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-white/10 py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 100%, rgba(37,99,235,0.18), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Start Summarizing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-400">
            Turn the next video or article you were “going to watch later” into something
            you’ll actually finish.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AuthLink
              href="/studio"
              className="w-full rounded-xl px-8 py-4 text-center text-base font-semibold text-white shadow-[0_10px_40px_-10px_rgba(37,99,235,0.7)] transition hover:scale-[1.02] sm:w-auto"
              style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
            >
              Summarize a Video
            </AuthLink>
            <AuthLink
              href="/library"
              className="w-full rounded-xl border border-white/15 px-8 py-4 text-center text-base font-semibold text-zinc-200 transition hover:bg-white/5 sm:w-auto"
            >
              Browse Library
            </AuthLink>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg text-white"
              style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
            >
              <SparkIcon width={15} height={15} />
            </span>
            <span className="text-sm font-medium text-zinc-300">Second Brain AI</span>
          </div>
          <p className="text-sm text-zinc-500">
            Built with Next.js, Supabase, and AI.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <a href="#" className="transition hover:text-white">
              Privacy
            </a>
            <a href="#" className="transition hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
