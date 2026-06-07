'use client';

import { Scenario } from '@/data/scenarios';
import { cn } from '@/lib/cn';

interface LingruiBubbleProps {
  scenario: Scenario;
  onSummon: () => void;
}

export default function LingruiBubble({ scenario, onSummon }: LingruiBubbleProps) {
  return (
    <button
      onClick={onSummon}
      className={cn(
        'absolute bottom-[178px] left-3.5 right-[84px] z-30 flex max-w-[270px] items-center gap-2',
        'rounded-full border border-white/15 bg-[#121218]/60 py-1.5 pl-1.5 pr-2.5 text-left text-white',
        'shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-md',
        'transition active:scale-[0.96] active:bg-[#121218]/75'
      )}
      style={{ boxShadow: `0 8px 24px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.1), 0 0 18px ${scenario.themeColor}35` }}
    >
      <img
        src={scenario.lingruiImage}
        alt={scenario.lingruiName}
        className="h-[30px] w-[30px] shrink-0 rounded-full border border-white/70 object-cover"
        style={{ boxShadow: `0 0 0 2px ${scenario.themeColor}66` }}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12.5px] font-extrabold leading-tight tracking-[0.3px] [text-shadow:0_1px_3px_rgba(0,0,0,.45)]">
          {scenario.cta}
        </span>
        <span className="mt-0.5 block truncate text-[10px] font-medium text-white/68">
          {scenario.hookLine}
        </span>
      </span>
      <span className="text-[15px] text-white/80">›</span>
    </button>
  );
}
