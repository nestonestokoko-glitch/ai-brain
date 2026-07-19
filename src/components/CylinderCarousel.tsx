'use client';

import React from "react";
import { cn } from "@/lib/utils";

export interface CarouselImage {
  src: string;
  alt?: string;
}

export interface CylinderCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
  containerClassName?: string;
  cardClassName?: string;
  animationDuration?: number; // in seconds (full cycle)
  cardWidth?: number; // in pixels
  gap?: number; // px of space between adjacent cards
}

export const CylinderCarousel = React.forwardRef<HTMLDivElement, CylinderCarouselProps>(
  (
    {
      images,
      className,
      containerClassName,
      cardClassName,
      animationDuration = 32,
      cardWidth = 250,
      gap = 8,
      ...props
    },
    ref
  ) => {
    const N = images.length;

    // Stepped keyframe: each card pauses in the center (hold) and then the
    // cylinder rotates one step so the next card arrives from the right while
    // the current one exits to the left. Spans exactly one full turn, so it
    // loops seamlessly.
    const holdFraction = 0.35; // portion of each step spent paused in center
    const keyframeName = `cylinder-spin-${N}`;
    const stops: string[] = ["0% { transform: rotateY(0turn); }"];
    for (let k = 0; k < N; k++) {
      const holdEnd = ((k + holdFraction) / N) * 100;
      const moveEnd = ((k + 1) / N) * 100;
      stops.push(
        `${holdEnd.toFixed(2)}% { transform: rotateY(${(k / N).toFixed(4)}turn); }`
      );
      stops.push(
        `${moveEnd.toFixed(2)}% { transform: rotateY(${((k + 1) / N).toFixed(4)}turn); }`
      );
    }
    const keyframes = `@keyframes ${keyframeName} {\n${stops.join("\n")}\n}`;

    // --n: number of cards, --w: card width, --ba: angle between cards
    const customStyle = {
      "--n": N,
      "--w": `${cardWidth}px`,
      "--ba": `calc(1turn / var(--n))`,
      "--gap": `${gap}px`,
      "--anim-dur": `${animationDuration}s`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-full min-h-[500px] grid place-items-center overflow-hidden",
          className
        )}
        style={{
          perspective: "35em",
          maskImage: "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent, #000 20% 80%, transparent)",
        }}
        {...props}
      >
        <div
          className={cn(
            "grid place-items-center [transform-style:preserve-3d] motion-reduce:!animate-[cylinder-spin-" +
              N +
              "_120s_linear_infinite]",
            containerClassName
          )}
          style={{
            ...customStyle,
            animation: `${keyframeName} var(--anim-dur) linear infinite`,
          }}
        >
          {/* Keyframes are generated per card count so the step size is exact. */}
          <style>{keyframes}</style>

          {images.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt || `Carousel image ${i}`}
              className={cn(
                "[grid-area:1/1] object-cover rounded-2xl [backface-visibility:hidden]",
                cardClassName
              )}
              style={{
                width: "var(--w)",
                aspectRatio: "7/10",
                "--i": i,
                transform:
                  "rotateY(calc(var(--i) * var(--ba))) translateZ(calc(-1 * (0.5 * var(--w) + 0.5 * var(--gap)) / tan(0.5 * var(--ba))))",
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>
    );
  }
);

CylinderCarousel.displayName = "CylinderCarousel";
