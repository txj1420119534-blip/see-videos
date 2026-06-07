'use client';

import { AnalysisResult } from '@/data/mockResults';
import { useState } from 'react';

interface ShareCardProps {
  result: AnalysisResult;
  themeColor: string;
}

export default function ShareCard({ result, themeColor }: ShareCardProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className="space-y-3">
      {/* Visual share card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}05)`,
          border: `1px solid ${themeColor}30`,
        }}
      >
        {/* Card header decoration */}
        <div
          className="h-1.5 w-full"
          style={{ background: `linear-gradient(90deg, ${themeColor}, ${themeColor}40)` }}
        />

        <div className="p-5 space-y-4">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">灵瑞伴看</span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ color: themeColor, backgroundColor: `${themeColor}20` }}>
              {result.lingruiName}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-base font-bold text-white leading-snug">
            {result.shareCard.title}
          </h4>

          {/* Subtitle */}
          <p className="text-xs font-medium" style={{ color: themeColor }}>
            {result.shareCard.subtitle}
          </p>

          {/* Quote */}
          <div
            className="pl-3 py-2 border-l-2"
            style={{ borderColor: themeColor }}
          >
            <p className="text-sm text-white/80 italic leading-relaxed">
              &ldquo;{result.shareCard.quote}&rdquo;
            </p>
          </div>

          {/* Bullets */}
          <div className="space-y-2">
            {result.shareCard.bullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
                >
                  {i + 1}
                </span>
                <span className="text-xs text-zinc-300 leading-relaxed">{bullet}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800/50">
            <p className="text-[10px] text-zinc-600 text-center">
              {result.shareCard.footer}
            </p>
          </div>
        </div>
      </div>

      {/* Tip */}
      <p className="text-[10px] text-zinc-600 text-center">
        长按卡片截图分享给朋友
      </p>

      {/* Copy button */}
      <button
        onClick={copyText}
        className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all border ${
          copied
            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            : 'bg-white/5 border-zinc-700/50 text-white/80 hover:bg-white/10'
        }`}
      >
        {copied ? '✓ 已复制文案' : '复制卡片文案'}
      </button>
    </div>
  );
}
