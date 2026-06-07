'use client';

import { AnalysisResult } from '@/data/mockResults';
import { getLingruiPersona } from '@/lib/ai/personas';
import { useState } from 'react';

interface ShareCardProps {
  result: AnalysisResult;
  themeColor: string;
}

export default function ShareCard({ result, themeColor }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const persona = getLingruiPersona(result.roleId);

  const copyText = () => {
    const text = [
      persona.shareTitle,
      '',
      `“${result.shareQuote}”`,
      '',
      ...result.nextActions.map((action) => `• ${action}`),
      '',
      `灵瑞伴看 · ${result.roleName}`,
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-3">
      <div
        className="overflow-hidden rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${themeColor}15, ${themeColor}05)`,
          border: `1px solid ${themeColor}30`,
        }}
      >
        <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${themeColor}, ${themeColor}40)` }} />

        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">灵瑞伴看</span>
            <span className="rounded-full px-2 py-0.5 text-xs" style={{ color: themeColor, backgroundColor: `${themeColor}20` }}>
              {result.roleName}
            </span>
          </div>

          <h4 className="text-base font-bold leading-snug text-white">{persona.shareTitle}</h4>

          <div className="border-l-2 py-2 pl-3" style={{ borderColor: themeColor }}>
            <p className="text-sm italic leading-relaxed text-white/80">&ldquo;{result.shareQuote}&rdquo;</p>
          </div>

          <div className="space-y-2">
            {result.nextActions.map((action, i) => (
              <div key={action} className="flex items-start gap-2">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                  style={{ backgroundColor: `${themeColor}30`, color: themeColor }}
                >
                  {i + 1}
                </span>
                <span className="text-xs leading-relaxed text-zinc-300">{action}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800/50 pt-3">
            <p className="text-center text-[10px] text-zinc-600">灵瑞伴看 · {result.roleName}</p>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] text-zinc-600">长按卡片截图分享给朋友</p>

      <button
        onClick={copyText}
        className={`w-full rounded-xl border py-2.5 text-xs font-medium transition-all ${
          copied
            ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
            : 'border-zinc-700/50 bg-white/5 text-white/80 hover:bg-white/10'
        }`}
      >
        {copied ? '已复制文案' : '复制卡片文案'}
      </button>
    </div>
  );
}
