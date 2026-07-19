'use client';

import type { CSSProperties, MouseEvent, ReactNode } from 'react';

type CardSpotlightProps = {
  children: ReactNode;
  className?: string;
  radius?: number;
  color?: string;
  href?: string;
};

export function CardSpotlight({
  children,
  className = '',
  radius = 350,
  color = 'rgba(59,130,246,0.15)',
  href,
}: CardSpotlightProps) {
  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--sx', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--sy', `${e.clientY - rect.top}px`);
  };

  const spotlight: CSSProperties = {
    background: `radial-gradient(${radius}px circle at var(--sx, 50%) var(--sy, 50%), ${color}, transparent 80%)`,
  };

  const cls = `group/spotlight relative overflow-hidden rounded-xl border border-white/10 bg-black ${className}`;

  const inner = (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover/spotlight:opacity-100"
        style={spotlight}
      />
      <div className="relative z-10">{children}</div>
    </>
  );

  if (href) {
    return (
      <a href={href} onMouseMove={handleMove} className={cls}>
        {inner}
      </a>
    );
  }

  return (
    <div onMouseMove={handleMove} className={cls}>
      {inner}
    </div>
  );
}
