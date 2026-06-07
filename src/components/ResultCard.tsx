'use client';

import { AnalysisResult } from '@/data/mockResults';
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

  const toggleSection = (index: number) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const copyText = () => {
    const text = [
      result.shareCard.title,
      result.shareCard.subtitle,
      '',
      `"${result.shareCard.quote}"`,
      '',
      ...result.shareCard.bullets.map((b) => `• ${b}`),
      '',
      result.shareCard.footer,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (showShareCard) {
    return (
      <div className="space-y-3">
        <button
          onClick={() => setShowShareCard(false)}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
        >
          ← 返回详情
        </button>
        <ShareCard result={result} themeColor={themeColor} />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Mode badge */}
      <ApiStatusBadge mode={result.mode} fallbackReason={result.debug?.fallbackReason} />

      {/* Title & judgement */}
      <div>
        <h3 className="text-lg font-bold text-white mb-1">{result.resultTitle}</h3>
        <p
          className="text-sm font-medium"
          style={{ color: themeColor }}
        >
          {result.confidenceLabel}
        </p>
      </div>

      {/* One line judgement */}
      <div
        className="p-3 rounded-xl border backdrop-blur-sm"
        style={{
          borderColor: `${themeColor}40`,
          backgroundColor: `${themeColor}10`,
        }}
      >
        <p className="text-sm text-white/90 leading-relaxed italic">
          &ldquo;{result.oneLineJudgement}&rdquo;
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {result.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full border"
            style={{
              borderColor: `${themeColor}40`,
              color: `${themeColor}cc`,
              backgroundColor: `${themeColor}15`,
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {result.sections.map((section, i) => (
          <div
            key={i}
            className="rounded-xl border border-zinc-800/80 overflow-hidden"
          >
            <button
              onClick={() => toggleSection(i)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-medium text-white/90">{section.title}</span>
              <span
                className={cn(
                  'text-zinc-500 transition-transform duration-200',
                  expandedSections.has(i) ? 'rotate-180' : ''
                )}
              >
                ▾
              </span>
            </button>
            {expandedSections.has(i) && (
              <div className="px-3 pb-3 space-y-1.5">
                {section.items.map((item, j) => (
                  <div key={j} className="flex gap-2 text-xs text-zinc-300 leading-relaxed">
                    <span style={{ color: themeColor }} className="mt-0.5 shrink-0">•</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={copyText}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-xs font-medium transition-all',
            'border',
            copied
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-white/5 border-zinc-700/50 text-white/80 hover:bg-white/10'
          )}
        >
          {copied ? '✓ 已复制' : '复制卡片文案'}
        </button>
        <button
          onClick={() => setShowShareCard(true)}
          className="flex-1 py-2.5 rounded-xl text-xs font-medium text-white border transition-all hover:opacity-90"
          style={{
            backgroundColor: `${themeColor}20`,
            borderColor: `${themeColor}40`,
          }}
        >
          查看分享卡
        </button>
      </div>
    </div>
  );
}
