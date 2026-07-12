import Link from 'next/link';
import type { ReactNode } from 'react';
import { SparkIcon, CheckIcon } from '@/components/workspace/icons';

const highlights = [
  'Turn hours of video & audio into a 5-minute read',
  'Save every summary to your own searchable library',
  'Find anything you learned, the moment you need it',
];

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#05070d] p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 20% 15%, rgba(37,99,235,0.35), transparent 60%), radial-gradient(50% 45% at 85% 80%, rgba(79,70,229,0.25), transparent 55%)',
          }}
        />
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span
            className="grid h-10 w-10 place-items-center rounded-xl text-white"
            style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
          >
            <SparkIcon width={20} height={20} />
          </span>
          <span className="text-xl font-semibold tracking-tight">Second Brain AI</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold leading-tight">Your knowledge, distilled.</h2>
          <p className="mt-4 text-lg text-white/80">
            Import anything. Read the signal, skip the filler, and keep it forever.
          </p>
          <ul className="mt-8 space-y-4">
            {highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-blue-500/20 text-blue-200">
                  <CheckIcon width={13} height={13} />
                </span>
                <span className="text-white/90">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-sm text-white/60">
          Trusted way to capture and revisit what matters.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-black px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-2 lg:hidden"
          >
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-white"
              style={{ backgroundImage: 'linear-gradient(135deg,#2563eb,#4f46e5)' }}
            >
              <SparkIcon width={18} height={18} />
            </span>
            <span className="text-lg font-semibold tracking-tight text-zinc-100">
              Second Brain AI
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-50">{title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
