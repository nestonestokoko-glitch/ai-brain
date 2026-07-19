'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import heroBg from '@/assets/hero-bg.png';
import { AuthLink } from '@/components/auth/AuthLink';
import { CylinderCarousel } from '@/components/CylinderCarousel';

// Poppins is scoped to this hero only (via the --font-poppins variable on the
// root below) so it never overrides the app-wide Geist font elsewhere.
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

function ArrowRight({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

// Images for the hero cylinder carousel.
const chatgptImages = [
  { src: '/chatgpt1.png', alt: 'ChatGPT 1' },
  { src: '/chatgpt2.png', alt: 'ChatGPT 2' },
  { src: '/chatgpt3.png', alt: 'ChatGPT 3' },
  { src: '/chatgpt4.png', alt: 'ChatGPT 4' },
  { src: '/chatgpt5.png', alt: 'ChatGPT 5' },
  { src: '/chatgpt6.png', alt: 'ChatGPT 6' },
];

// A fuller cylinder for wide screens — the set is repeated so more cards
// spread around the ring.
const desktopCarouselImages = [...chatgptImages, ...chatgptImages];

export default function Hero() {
  // Use a fuller cylinder (more cards) on desktop; keep the 5-card ring on mobile.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  const carouselImages = isDesktop ? desktopCarouselImages : chatgptImages;

  return (
    <section
      className={
        'ws-app-bg relative flex min-h-screen flex-col items-center justify-start px-6 pb-20 pt-32 sm:pt-40 ' +
        poppins.variable
      }
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      {/* Background image pinned to the TOP of the hero. A bottom mask fades
          the image out so the lower (yellow) part is cut away and the dark
          section backdrop shows through. Sits above the gradient fallback. */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroBg.src}
          alt=""
          className="h-full w-full object-cover object-top"
          style={{
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, #000 42%, transparent 78%)',
            maskImage:
              'linear-gradient(to bottom, #000 0%, #000 42%, transparent 78%)',
          }}
        />
        {/* Light overlay at the top for text contrast; deepens to solid dark
            where the image fades, blending into the section background. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(5,7,13,0.55) 0%, rgba(5,7,13,0.35) 42%, rgba(5,7,13,0.92) 100%)',
          }}
        />
      </div>

      {/* Entrance fade for the hero content. */}
      <div className="ws-animate-rise relative z-10 flex w-full flex-col items-center">
        {/* Announcement pill */}
        <aside className="mb-8 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 backdrop-blur-sm">
          <span className="whitespace-nowrap text-center text-xs text-zinc-400">
            New — turn your notes into AI systems
          </span>
          <Link
            href="/studio"
            className="hidden sm:flex items-center gap-1 whitespace-nowrap text-xs text-zinc-400 transition-all hover:text-white active:scale-95"
            aria-label="Read more about the new feature"
          >
            Read more
            <ArrowRight size={12} />
          </Link>
        </aside>

        {/* Gradient headline — mobile: 288px box, 3 lines */}
        <h1
          className="mb-6 block w-[288px] px-2 text-center text-3xl font-medium leading-tight md:hidden"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.05em',
          }}
        >
          Your AI Brain for
          <br />
          summarizing
          <br />
          videos
        </h1>

        {/* Gradient headline — desktop: restored original full-width, 2 lines */}
        <h1
          className="mb-6 hidden max-w-[1024px] px-6 text-center text-3xl font-medium leading-tight md:block md:text-4xl lg:text-7xl lg:leading-[1.2]"
          style={{
            background: 'linear-gradient(to bottom, #ffffff, #ffffff, rgba(255,255,255,0.6))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.05em',
          }}
        >
          Your AI Brain for
          <br />
          summarizing videos
        </h1>

        {/* Subtitle — mobile: short version */}
        <p className="mb-10 block max-w-2xl px-6 text-center text-sm text-zinc-400 md:hidden">
          Summarize, podcast, chat, and build — without the busywork.
        </p>

        {/* Subtitle — desktop: full version */}
        <p className="mb-10 hidden max-w-2xl px-6 text-center text-sm text-zinc-400 md:block md:text-base">
          Turn YouTube videos, articles, and PDFs into one searchable knowledge
          workspace. Summarize, podcast, chat, and build — without the busywork.
        </p>

        {/* Primary CTA */}
        <div className="relative z-10 mb-16">
          <AuthLink
            href="/studio"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-white via-white/95 to-white/60 px-8 text-base font-semibold text-black transition-all hover:scale-105 active:scale-95"
            aria-label="Get started with AI Brain"
          >
            Get started
            <ArrowRight size={16} />
          </AuthLink>
        </div>
      </div>

      {/* Product preview — full-width static card row with a brand glow behind it. */}
      <div className="relative w-full pb-20">
        {/* Glow behind the image (adapted from the template's glows.png, done in
            CSS so there's no external dependency). */}
        <div
          className="pointer-events-none absolute left-1/2 top-[-23%] z-0 w-[90%] -translate-x-1/2"
          aria-hidden="true"
          style={{
            height: '400px',
            background:
              'radial-gradient(circle, rgba(59,130,246,0.28) 0%, rgba(99,102,241,0.10) 45%, rgba(255,255,255,0) 70%)',
            filter: 'blur(60px)',
          }}
        />

        <div className="relative z-10">
          <CylinderCarousel
            images={carouselImages}
            className="mx-auto"
            cardClassName="shadow-2xl"
            gap={isDesktop ? 22 : 8}
          />
        </div>
      </div>
    </section>
  );
}
