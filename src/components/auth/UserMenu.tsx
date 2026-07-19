'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';

type Profile = {
  name: string;
  email: string;
  avatar?: string;
};

function getProfile(user: NonNullable<ReturnType<typeof useAuth>['user']>): Profile {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const avatar =
    typeof meta.avatar_url === 'string'
      ? meta.avatar_url
      : typeof meta.picture === 'string'
        ? meta.picture
        : undefined;
  const name =
    (typeof meta.full_name === 'string' && meta.full_name) ||
    (typeof meta.name === 'string' && meta.name) ||
    (user.email ?? 'Member');
  return {
    name,
    email: user.email ?? '',
    avatar,
  };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

function Avatar({
  profile,
  className,
  textClassName,
}: {
  profile: Profile;
  className?: string;
  textClassName?: string;
}) {
  if (profile.avatar) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={profile.avatar}
        alt=""
        className={cn('rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      className={cn(
        'grid place-items-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 font-semibold text-white',
        className,
        textClassName
      )}
    >
      {getInitials(profile.name)}
    </span>
  );
}

function MenuButton({
  children,
  className,
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'block w-full rounded-lg px-3 py-2 text-left text-sm transition',
        className
      )}
    >
      {children}
    </button>
  );
}

export function UserMenu() {
  const { user, signOut, signingOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointer);
    return () => document.removeEventListener('pointerdown', onPointer);
  }, []);

  if (!user) {
    return (
      <Link href="/login" className="ws-btn-ghost px-4 py-2">
        Sign in
      </Link>
    );
  }

  const profile = getProfile(user);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-2.5 transition hover:bg-white/[0.08]"
      >
        <Avatar profile={profile} className="h-7 w-7 text-xs" />
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-zinc-200 sm:block">
          {profile.name}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#05070d] p-1 shadow-2xl ws-animate-fade">
          <div className="flex items-center gap-3 px-3 py-3">
            <Avatar profile={profile} className="h-9 w-9 text-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {profile.name}
              </p>
              <p className="truncate text-xs text-zinc-400">{profile.email}</p>
            </div>
          </div>

          <div className="my-1 h-px bg-white/10" />

          <MenuButton className="text-zinc-300 hover:bg-white/5 hover:text-white">
            Account Settings
          </MenuButton>
          <MenuButton
            onClick={signOut}
            disabled={signingOut}
            className="text-red-400 hover:bg-red-500/10 disabled:opacity-50"
          >
            {signingOut ? 'Signing out…' : 'Sign Out'}
          </MenuButton>
        </div>
      )}
    </div>
  );
}
