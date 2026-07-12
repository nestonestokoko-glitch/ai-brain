
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Second Brain AI — Turn hours of content into minutes of reading",
  description:
    "Import YouTube videos, podcasts, and articles. Get clean, AI-generated summaries instantly and keep them in your own searchable library.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col bg-black text-zinc-100"
        style={{ backgroundImage: "radial-gradient(ellipse at top, #112240 0%, #000000 70%)" }}
      >
        {children}
      </body>
    </html>
  );
}
