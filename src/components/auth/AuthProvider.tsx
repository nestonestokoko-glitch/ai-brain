'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { getBrowserSupabase } from '@/lib/supabase/client';

type AuthContextValue = {
  user: User | null;
  /** True only while a sign-out is in flight. */
  signingOut: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  // Seeded from the server so there is no flash between the login and
  // the app on first paint.
  const [user, setUser] = useState<User | null>(initialUser);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = getBrowserSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const signOut = useCallback(async () => {
    setSigningOut(true);
    try {
      const supabase = getBrowserSupabase();
      await supabase.auth.signOut();
    } finally {
      // Full reload clears any client-only state and lets the proxy
      // redirect to /login.
      window.location.assign('/');
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, signingOut, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return ctx;
}
