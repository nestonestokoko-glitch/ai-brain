import Link from 'next/link';
import SignInGate from '@/components/SignInGate';
import ScrollReveal from '@/components/ScrollReveal';
import {
  SparkIcon,
  YouTubeIcon,
  WebsiteIcon,
  PdfIcon,
  BrainIcon,
  SearchIcon,
  BookIcon,
  PodcastIcon,
  SummarizeIcon,
} from '@/components/workspace/icons';

const features = [
  {
    icon: YouTubeIcon,
    title: 'YouTube Summarization',
    body: 'Paste a link and get a clean, structured summary of any video — transcripts pulled automatically.',
  },
  {
    icon: PodcastIcon,
    title: 'Podcast Transcription',
    body: 'Turn long audio into searchable text and tight summaries you can actually finish.',
  },
  {
    icon: WebsiteIcon,
    title: 'Article Extraction',
    body: 'Strip the clutter from articles and web pages, then distill the key ideas in seconds.',
  },
  {
    icon: BrainIcon,
    title: 'Personal Library',
    body: 'Every summary is saved to your own knowledge base, organized and ready to revisit.',
  },
  {
    icon: SearchIcon,
    title: 'Search & Revisit',
    body: 'Find anything you saved by keyword or topic. Your past reading is always one search away.',
  },
  {
    icon: BookIcon,
    title: 'Multiple Formats',
    body: 'Quick takeaways, five key points, detailed notes, or beginner-friendly explainers — your call.',
  },
];

const steps = [
  {
    icon: YouTubeIcon,
    title: 'Import Content',
    body: 'Drop in a YouTube link, podcast, or article URL. One click and it’s captured.',
  },
  {
    icon: BrainIcon,
    title: 'AI Processes It',
    body: 'We transcribe, extract, and distill the signal from hours of content.',
  },
  {
    icon: BookIcon,
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
      <header className="fixed left-1/2 top-5 z-50 -translate-x-1/2">
        <div
          className="flex items-center gap-6 rounded-full border border-white/10 px-7 py-3 backdrop-blur-xl"
          style={{
            background: 'rgba(5,7,13,0.72)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          }}
        >
          <Link href="/" className="flex items-center whitespace-nowrap">
            <span className="text-xl font-semibold tracking-tight text-white">
              Second Brain AI
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-base font-medium text-zinc-300 md:flex">
            <a href="#how" className="transition hover:text-white">
              How it works
            </a>
            <a href="#features" className="transition hover:text-white">
              Features
            </a>
            <Link href="/studio" className="transition hover:text-white">
              Studio
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/library"
              className="rounded-lg px-4 py-2 text-base font-medium text-zinc-200 transition hover:bg-white/5"
            >
              Library
            </Link>
            <SignInGate />
          </div>
        </div>
      </header>

      {/* Hero — marketing copy over a brand-aligned focus glow + vignette. */}
      <section className="relative overflow-hidden ws-app-bg px-6 pt-[180px] pb-20 text-center">
        {/* Vignette: subtle radial depth so the copy sits on a focused field
            (adapts the spec's white→orange vignette to this project's dark
            blue brand). */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, rgba(59,130,246,0.10) 0%, rgba(5,7,13,0) 60%)',
          }}
        />
        {/* Focus glow behind the headline (adapted from brand blue). Mirrors
            the spec's .framer-u247s3::before — blurred radial glow, centered
            behind the headline, non-interactive. */}
        <div
          className="pointer-events-none absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '600px',
            height: '600px',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.18) 0%, rgba(99,102,241,0.06) 45%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)',
            zIndex: 0,
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-tight text-white leading-[1.2] uppercase sm:text-6xl lg:text-7xl">
            Your <span className="text-green-400">AI Brain</span> for
            <br />
            summarizing videos
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
            Turn YouTube videos, articles, and PDFs into one searchable knowledge
            workspace. Summarize, podcast, chat, and build — without the busywork.
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href="/studio"
              className="group relative flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-blue-300 px-7 py-3 text-sm font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:border-blue-200 active:scale-100"
              style={{
                backgroundImage: 'linear-gradient(135deg, #3b82f6, #60a5fa, #2563eb)',
                boxShadow:
                  '0 8px 24px -6px rgba(59,130,246,0.45), inset 0 1px 0 0 rgba(255,255,255,0.3)',
              }}
            >
              <span
                className="relative flex items-center transition-transform duration-300 group-hover:translate-x-1"
                style={{
                  textShadow:
                    'rgba(0,0,0,0.25) 0px 2px 8px, rgb(30,58,138) 0px 1px 0px',
                }}
              >
                <span className="mr-2 transition-transform duration-300 group-hover:rotate-12">
                  <SparkIcon width={16} height={16} />
                </span>
                Let's Start
              </span>
            </Link>
          </div>
        </div>

        {/* Product preview — mirrors the Synix dashboard image. */}
        <div className="relative mx-auto mt-16 max-w-5xl ws-animate-rise">
          <div className="ws-card overflow-hidden p-0">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-white/10" />
              <span className="h-3 w-3 rounded-full bg-white/10" />
              <span className="h-3 w-3 rounded-full bg-white/10" />
              <span className="ml-3 text-xs text-zinc-500">AI Brain — Workspace</span>
            </div>
            <div className="grid gap-4 p-5 sm:grid-cols-[200px_1fr]">
              <div className="hidden space-y-2 sm:block">
                {[
                  'Summarize Video',
                  'Create Podcast',
                  'Chat with Videos',
                  'Build an AI System',
                ].map((t, i) => (
                  <div
                    key={t}
                    className={
                      'rounded-lg border px-3 py-2 text-xs text-zinc-300 ' +
                      (i === 0
                        ? 'border-blue-500/30 bg-blue-500/10'
                        : 'border-white/10 bg-white/[0.03]')
                    }
                  >
                    {t}
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="h-2.5 w-1/3 rounded bg-blue-400/40" />
                  <div className="mt-3 h-2 w-full rounded bg-white/10" />
                  <div className="mt-2 h-2 w-5/6 rounded bg-white/10" />
                  <div className="mt-2 h-2 w-2/3 rounded bg-white/10" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 flex-1 rounded-lg border border-white/10 bg-white/[0.03]" />
                  <div
                    className="h-9 w-24 rounded-lg"
                    style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-white/10 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-zinc-400">
            Three simple steps from a raw link to a saved summary.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="ws-card relative p-8 ws-reveal"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="absolute -top-4 left-8 grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <step.icon width={26} height={26} />
                </div>
                <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-zinc-400">{step.body}</p>
              </div>
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
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.title} className="ws-card p-6 ws-reveal transition hover:border-blue-500/40" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                  <f.icon width={22} height={22} />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{f.body}</p>
              </div>
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
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((b, i) => (
              <div key={b.title} className="ws-card p-8 ws-reveal text-center" style={{ animationDelay: `${i * 90}ms` }}>
                <h3 className="text-xl font-semibold text-white">{b.title}</h3>
                <p className="mt-3 text-zinc-400">{b.body}</p>
              </div>
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
            <Link
              href="/studio"
              className="w-full rounded-xl px-8 py-4 text-center text-base font-semibold text-white shadow-[0_10px_40px_-10px_rgba(37,99,235,0.7)] transition hover:scale-[1.02] sm:w-auto"
              style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
            >
              Summarize a Video
            </Link>
            <Link
              href="/library"
              className="w-full rounded-xl border border-white/15 px-8 py-4 text-center text-base font-semibold text-zinc-200 transition hover:bg-white/5 sm:w-auto"
            >
              Browse Library
            </Link>
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
