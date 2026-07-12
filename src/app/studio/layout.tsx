import type { ReactNode } from 'react';

// Self-contained light surface so the workspace reads as a premium,
// Claude-inspired product regardless of the app's default dark theme.
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ws-surface min-h-screen flex flex-col font-sans antialiased">
      {children}
    </div>
  );
}
