'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthLink } from '@/components/auth/AuthLink';
import { UserMenu } from '@/components/auth/UserMenu';

// Hamburger menu shown on mobile (md:hidden). Reveals the nav links that are
// hidden in the capsule on small screens.
export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label="Menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-200 transition hover:bg-white/10"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#05070d] p-1 shadow-2xl ws-animate-fade">
          <div className="px-2 py-1.5">
            <UserMenu />
          </div>
          <a
            href="#how"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            How it works
          </a>
          <a
            href="#features"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Features
          </a>
          <AuthLink
            href="/studio"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Studio
          </AuthLink>
          <AuthLink
            href="/library"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
          >
            Library
          </AuthLink>
        </div>
      )}
    </div>
  );
}
