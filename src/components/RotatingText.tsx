'use client';

import { useEffect, useState, type CSSProperties } from 'react';

/**
 * Vertical rotating-text slideshow (mirrors the Synix hero's transl\ateY
 * content rotation). Cycles through `phrases`, sliding each one up into
 * view. Height is clipped so only the active phrase is visible.
 */
export default function RotatingText({
  phrases,
  className = '',
  style,
}: {
  phrases: string[];
  className?: string;
  style?: CSSProperties;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2600);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        height: '1.3em',
        overflow: 'hidden',
        verticalAlign: 'bottom',
        lineHeight: '1.3',
        ...style,
      }}
    >
      <span
        style={{
          display: 'block',
          transform: `translateY(calc(-1 * ${index} * 1.3em))`,
          transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {phrases.map((p) => (
          <span
            key={p}
            style={{ display: 'block', height: '1.3em', lineHeight: '1.3' }}
          >
            {p}
          </span>
        ))}
      </span>
    </span>
  );
}
