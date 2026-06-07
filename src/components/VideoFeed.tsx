'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { scenarios, Scenario } from '@/data/scenarios';
import { saveState } from '@/lib/storage';
import VideoCard from './VideoCard';
import LingruiBubble from './LingruiBubble';
import AnalyzeDrawer from './AnalyzeDrawer';

export default function VideoFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentScenario: Scenario = scenarios[currentIndex];

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      if (index < 0 || index >= scenarios.length) return;
      setIsTransitioning(true);
      setCurrentIndex(index);
      setTimeout(() => setIsTransitioning(false), 300);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % scenarios.length);
  }, [currentIndex, goTo]);

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + scenarios.length) % scenarios.length);
  }, [currentIndex, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (drawerOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'j') goNext();
      if (e.key === 'ArrowUp' || e.key === 'k') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, drawerOpen]);

  // Mouse wheel navigation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout | null = null;
    const handleWheel = (e: WheelEvent) => {
      if (drawerOpen) return;
      e.preventDefault();
      if (wheelTimeout) return;

      if (e.deltaY > 30) goNext();
      else if (e.deltaY < -30) goPrev();

      wheelTimeout = setTimeout(() => {
        wheelTimeout = null;
      }, 500);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [goNext, goPrev, drawerOpen]);

  // Touch navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (drawerOpen) return;
      touchEndY.current = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY.current;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goNext();
        else goPrev();
      }
    },
    [goNext, goPrev, drawerOpen]
  );

  const handleSummon = useCallback(() => {
    saveState({ lastSummonedLingrui: currentScenario.id });
    setDrawerOpen(true);
  }, [currentScenario]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Video card */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translateY(${drawerOpen ? '0' : '0'})`,
        }}
      >
        <VideoCard key={currentScenario.id} scenario={currentScenario} />
      </div>

      {/* Lingrui bubble */}
      <LingruiBubble scenario={currentScenario} onSummon={handleSummon} />

      <div className="pointer-events-none absolute bottom-[52px] left-0 right-0 z-20 animate-bob text-center text-xs tracking-[1px] text-white/65 [text-shadow:0_1px_4px_rgba(0,0,0,.55)]">
        上滑切换
      </div>

      {/* Analyze drawer */}
      <AnalyzeDrawer
        scenario={currentScenario}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
