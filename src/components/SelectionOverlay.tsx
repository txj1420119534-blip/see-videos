'use client';

import { useState, useRef, useCallback } from 'react';

interface Selection {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectionOverlayProps {
  onSelectionChange: (selection: Selection | null) => void;
  className?: string;
}

export default function SelectionOverlay({ onSelectionChange, className }: SelectionOverlayProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getRelativePos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(0, Math.min(clientX - rect.left, rect.width)),
      y: Math.max(0, Math.min(clientY - rect.top, rect.height)),
    };
  }, []);

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const pos = getRelativePos(e);
      setStart(pos);
      setIsDrawing(true);
      setSelection(null);
      onSelectionChange(null);
    },
    [getRelativePos, onSelectionChange]
  );

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawing || !start) return;
      e.preventDefault();
      const pos = getRelativePos(e);
      const newSelection: Selection = {
        x: Math.min(start.x, pos.x),
        y: Math.min(start.y, pos.y),
        width: Math.abs(pos.x - start.x),
        height: Math.abs(pos.y - start.y),
      };
      setSelection(newSelection);
    },
    [isDrawing, start, getRelativePos]
  );

  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    if (selection && selection.width > 10 && selection.height > 10) {
      onSelectionChange(selection);
    } else {
      setSelection(null);
      onSelectionChange(null);
    }
  }, [selection, onSelectionChange]);

  return (
    <div
      ref={containerRef}
      className={`relative cursor-crosshair select-none touch-none ${className || ''}`}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      {/* Selection rectangle */}
      {selection && selection.width > 0 && selection.height > 0 && (
        <div
          className="absolute border-2 border-dashed border-white/80 bg-white/10 rounded-sm pointer-events-none z-10"
          style={{
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
          }}
        >
          <div className="absolute -top-6 left-0 text-[10px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded whitespace-nowrap">
            已圈选 {Math.round(selection.width)}×{Math.round(selection.height)}
          </div>
        </div>
      )}

      {/* Hint text when not drawing */}
      {!selection && !isDrawing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white/40 text-xs bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
            拖拽圈选画面区域
          </div>
        </div>
      )}
    </div>
  );
}
