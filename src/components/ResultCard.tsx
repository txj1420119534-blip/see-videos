'use client';

import { AnalysisResult } from '@/data/mockResults';
import { getLingruiPersona } from '@/lib/ai/personas';
import { cn } from '@/lib/cn';
import ApiStatusBadge from './ApiStatusBadge';
import ShareCard from './ShareCard';
import { useState } from 'react';

interface ResultCardProps {
  result: AnalysisResult;
  themeColor: string;
}

export default function ResultCard({ result, themeColor }: ResultCardProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [showShareCard, setShowShareCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const persona = getLingruiPersona(result.roleId);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const copyText = () => {
    const text = [result.openingLine, result.coreInsight, '', ...result.nextActions.map((item) => `• ${item}`), '', result.shareQuote].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (showShareCard) {
    return (
      <div className="space-y-3">
        <button onClick={() => setShowShareCard(false)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white">
          ← 返回详情
        </button>
        <ShareCard result={result} themeColor={themeColor} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      <ApiStatusBadge mode={result.mode} fallbackReason={result.debug?.fallbackReason} />

      <div>
        <h3 className="mb-1 text-lg font-bold text-white">{persona.shareTitle}</h3>
        <p className="text-sm font-medium" style={{ color: themeColor }}>
          {result.openingLine}
        </p>
      </div>

      <div className="rounded-xl border p-3 backdrop-blur-sm" style={{ borderColor: `${themeColor}40`, backgroundColor: `${themeColor}10` }}>
        <p className="text-sm leading-relaxed text-white/90">&ldquo;{result.coreInsight}&rdquo;</p>
      </div>

      <div className="space-y-2">
        {result.sections.map((section, i) => (
          <div key={section.title} className="overflow-hidden rounded-xl border border-zinc-800/80">
            <button onClick={() => toggleSection(i)} className="flex w-full items-center justify-between px-3 py-2.5 text-left transition-colors hover:bg-white/5">
              <span className="text-sm font-medium text-white/90">{section.title}</span>
              <span className={cn('text-zinc-500 transition-transform duration-200', expandedSections.has(i) ? 'rotate-180' : '')}>▾</span>
            </button>
            {expandedSections.has(i) && (
              <div className="space-y-1.5 px-3 pb-3">
                {section.items.map((item) => (
                  <div key={item} className="flex gap-2 text-xs leading-relaxed text-zinc-300">
                    <span style={{ color: themeColor }} className="mt-0.5 shrink-0">
                      •
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={copyText}
          className={cn(
            'flex-1 rounded-xl border py-2.5 text-xs font-medium transition-all',
            copied ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400' : 'border-zinc-700/50 bg-white/5 text-white/80 hover:bg-white/10'
          )}
        >
          {copied ? '已复制' : '复制灵瑞短句'}
        </button>
        <button
          onClick={() => setShowShareCard(true)}
          className="flex-1 rounded-xl border py-2.5 text-xs font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: `${themeColor}20`, borderColor: `${themeColor}40` }}
        >
          查看分享卡
        </button>
      </div>
    </div>
  );
}
