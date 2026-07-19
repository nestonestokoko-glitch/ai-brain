import Link from 'next/link';
import ScrollReveal from '@/components/ScrollReveal';
import MobileNav from '@/components/MobileNav';
import Hero from '@/components/Hero';
import { MarqueeShowcase } from '@/components/MarqueeShowcase';
import { FaqSection } from '@/components/FaqSection';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { AuthLink } from '@/components/auth/AuthLink';
import { UserMenu } from '@/components/auth/UserMenu';
import { StudioButton } from '@/components/auth/StudioButton';
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

type StepCardProps = { index: number; title: string; body: string };

function StepCard({ index, title, body }: StepCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl p-[1px] bg-slate-800 transition-colors duration-300">
      {/* Interactive glow layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(180px at 50% 50%, rgba(59,130,246,0.45), transparent 80%)',
        }}
      />
      {/* Inner content */}
      <div className="relative flex h-full flex-col rounded-[11px] bg-black p-5 md:p-6">
        <div className="relative z-10 mb-6 w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-950">
          <Image
            src={`/card${index + 1}.png`}
            alt={title}
            width={600}
            height={400}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-auto w-full object-contain"
          />
        </div>
        <div className="relative z-10 flex flex-1 flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">
            Step 0{index + 1}
          </span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm leading-relaxed text-zinc-400">{body}</p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen font-sans text-zinc-100">
      <ScrollReveal />
      {/* Floating capsule nav — fixed, centered, enlarged; adapted from the
          spec's sticky capsule (dark translucent instead of off-white). */}
      <header className="fixed left-1/2 top-3 z-50 w-[calc(100vw-1rem)] -translate-x-1/2 sm:top-5 sm:w-auto">
        <div
          className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-2 backdrop-blur-xl sm:gap-6 sm:px-7 sm:py-3"
          style={{
            background: 'rgba(5,7,13,0.72)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
          }}
        >
          <Link href="/" className="flex items-center whitespace-nowrap">
            <Image src="/lodo2.0.png" alt="Logo" width={48} height={48} className="mr-2" priority />
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
          <UserMenu showSignin={false} />
          <div className="flex flex-1 items-center gap-2 sm:ml-auto sm:flex-none sm:gap-3">
            <AuthLink
              href="/library"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-zinc-200 transition hover:bg-white/5 sm:block sm:px-4 sm:text-base"
            >
              Library
            </AuthLink>
            <StudioButton />
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
            {steps.map((s, i) => (
              <StepCard key={s.title} index={i} title={s.title} body={s.body} />
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

      {/* Example summary — seamless two-row marquee */}
      <MarqueeShowcase />

      {/* FAQ — replaces the old "Why people use Second Brain AI" benefits section */}
      <FaqSection />

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-white/10 bg-black py-24">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 60% at 50% 100%, rgba(37,99,235,0.18), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="bg-gradient-to-r from-[#F95C01] via-white to-[#D1FE17] bg-clip-text font-serif text-5xl font-normal leading-tight tracking-tight text-transparent md:text-7xl">
            Start Summarizing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-zinc-300 sm:text-lg">
            Turn the next video or article you were “going to watch later” into something
            you’ll actually finish.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <AuthLink
              href="/studio"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-white via-white/95 to-white/60 px-8 text-base font-semibold text-black transition-all hover:scale-105 active:scale-95 sm:w-auto"
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
