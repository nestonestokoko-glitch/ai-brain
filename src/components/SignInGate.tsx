'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Reads the auth cookie client-side to decide whether to show "Sign in"
// or "Open Studio". The cookie is httpOnly, so we can only detect its
// presence, never its contents — which is all we need here.

// Nav CTA — styled like the reference "Book a call" button: brown fill,
// green inset shadow, 40px pill, white label.
const BTN_CLASS =
  'group relative inline-flex h-11 shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-[40px] border-2 border-black/5 px-6 text-[17px] font-semibold text-white transition-all duration-300 ease-out hover:scale-105 active:scale-100';
const BTN_STYLE = {
  backgroundColor: 'rgb(110, 70, 30)',
  boxShadow: 'inset 0 -4px 4px 0 rgb(19, 99, 72)',
};

export default function SignInGate() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // We can't read an httpOnly cookie from JS, so instead we ask the
    // server whether a session exists via a tiny fetch to a known route.
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authenticated)))
      .catch(() => setAuthed(false));
  }, []);

  if (authed === null) {
    return (
      <span className={BTN_CLASS} style={{ ...BTN_STYLE, opacity: 0.6 }}>
        <span className="relative">Open Studio</span>
      </span>
    );
  }

  if (authed) {
    return (
      <Link href="/studio" className={BTN_CLASS} style={BTN_STYLE}>
        <span className="relative">Open Studio</span>
      </Link>
    );
  }

  return (
    <Link href="/login" className={BTN_CLASS} style={BTN_STYLE}>
      <span className="relative">Sign in</span>
    </Link>
  );
}
