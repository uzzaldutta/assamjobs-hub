"use client";

import React, { useEffect, useRef, useState } from "react";

interface AutoScrollTrackProps {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
}

export default function AutoScrollTrack({ children, direction = "left", speed = 0.5 }: AutoScrollTrackProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);

  const handleInteraction = () => {
    setIsPaused(true);
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2000);
  };

  // Setup initial scroll position for right-scrolling so we don't hit 0 immediately
  useEffect(() => {
    if (direction === "right" && scrollRef.current && !initializedRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth / 2;
      initializedRef.current = true;
    }
  }, [direction]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isPaused) return;

    let animationFrameId: number;
    let exactScroll = el.scrollLeft;

    const scrollStep = () => {
      if (el) {
        if (direction === "left") {
          exactScroll += speed;
          el.scrollLeft = exactScroll;
          if (el.scrollLeft >= el.scrollWidth / 2) {
            exactScroll -= el.scrollWidth / 2;
            el.scrollLeft = exactScroll;
          }
        } else {
          exactScroll -= speed;
          el.scrollLeft = exactScroll;
          if (el.scrollLeft <= 0) {
            exactScroll += el.scrollWidth / 2;
            el.scrollLeft = exactScroll;
          }
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, direction, speed]);

  return (
    <div
      ref={scrollRef}
      onMouseEnter={handleInteraction}
      onTouchStart={handleInteraction}
      onTouchMove={handleInteraction}
      onWheel={handleInteraction}
      className="flex overflow-x-auto hide-scrollbar pb-4 touch-pan-x"
      style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch" }}
    >
      <div className="flex gap-4 pr-4 min-w-max">
        {children}
      </div>
      <div className="flex gap-4 pr-4 min-w-max" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
