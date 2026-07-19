
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { getServerUser } from "@/lib/supabase/server";

// Sets the auth screen theme before first paint (no flash). Defaults to the
// OS preference, then any explicit choice saved in localStorage.
const themeScript = `(function(){try{var t=localStorage.getItem('auth-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-auth-theme',t);}catch(e){document.documentElement.setAttribute('data-auth-theme','dark');}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI BRAIN — Turn hours of content into minutes of reading",
  description:
    "Import YouTube videos, podcasts, and articles. Get clean, AI-generated summaries instantly and keep them in your own searchable library.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getServerUser();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className="min-h-full flex flex-col bg-black text-zinc-100"
        style={{ backgroundImage: "radial-gradient(ellipse at top, #112240 0%, #000000 70%)" }}
        // Browser extensions (e.g. gesture/mouse helpers) inject attributes on
        // <body> before hydration, which React can't reconcile. This only
        // suppresses that known, harmless attribute diff — not our own markup.
        suppressHydrationWarning
      >
        <AuthProvider initialUser={initialUser}>{children}</AuthProvider>
      </body>
    </html>
  );
}
