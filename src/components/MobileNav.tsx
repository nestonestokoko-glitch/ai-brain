'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AuthLink } from '@/components/auth/AuthLink';
import { useAuth } from '@/components/auth/AuthProvider';

// Hamburger menu shown on mobile (md:hidden). The icon animates into an "X"
// when open, and the menu expands to a full-screen black overlay listing every
// page. The overlay is portaled to <body> so it sits above page content but
// below the fixed header, keeping the hamburger tappable to close.
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, signOut, signingOut } = useAuth();

  useEffect(() => setMounted(true), []);

  // Lock body scroll while the full-screen menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const linkBase =
    'block rounded-xl px-4 py-4 text-lg font-medium text-zinc-200 transition hover:bg-white/5 hover:text-white';

  const close = () => setOpen(false);

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-zinc-200 transition hover:bg-white/10"
      >
        {/* Three-bar icon that morphs into an X via transforms. */}
        <span className="relative block h-4 w-5">
          <span
            className={
              'absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-transform duration-300 ease-out ' +
              (open ? 'translate-y-[7px] rotate-45' : '')
            }
          />
          <span
            className={
              'absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded bg-current transition-opacity duration-200 ' +
              (open ? 'opacity-0' : '')
            }
          />
          <span
            className={
              'absolute bottom-0 left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300 ease-out ' +
              (open ? '-translate-y-[7px] -rotate-45' : '')
            }
          />
        </span>
      </button>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-40 flex flex-col bg-black px-6 pb-10 pt-24 ws-animate-fade"
            onClick={close}
          >
            <nav className="flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
              <a href="#how" onClick={close} className={linkBase}>
                How it works
              </a>
              <a href="#features" onClick={close} className={linkBase}>
                Features
              </a>
              <AuthLink href="/studio" onClick={close} className={linkBase}>
                Studio
              </AuthLink>
              <AuthLink href="/library" onClick={close} className={linkBase}>
                Library
              </AuthLink>
            </nav>

            <div
              className="mt-auto border-t border-white/10 pt-4"
              onClick={(e) => e.stopPropagation()}
            >
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    close();
                    signOut();
                  }}
                  disabled={signingOut}
                  className="block w-full rounded-xl px-4 py-4 text-left text-lg font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>
              ) : (
                <AuthLink
                  href="/login"
                  onClick={close}
                  className="block rounded-xl px-4 py-4 text-lg font-medium text-zinc-200 transition hover:bg-white/5 hover:text-white"
                >
                  Sign in
                </AuthLink>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
