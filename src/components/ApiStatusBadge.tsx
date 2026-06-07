'use client';

import { cn } from '@/lib/cn';

interface ApiStatusBadgeProps {
  mode: 'real' | 'mock';
  fallbackReason?: string;
}

export default function ApiStatusBadge({ mode, fallbackReason }: ApiStatusBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
          mode === 'real'
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        )}
      >
        <div
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            mode === 'real' ? 'bg-emerald-400' : 'bg-amber-400'
          )}
        />
        {mode === 'real' ? '真实分析' : '模拟兜底'}
      </div>
      {fallbackReason && (
        <span className="text-[10px] text-zinc-500 max-w-[120px] truncate" title={fallbackReason}>
          {fallbackReason}
        </span>
      )}
    </div>
  );
}
