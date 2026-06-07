'use client';

import { useState, useRef, useCallback } from 'react';
import { Scenario } from '@/data/scenarios';
import { AnalysisResult } from '@/data/mockResults';
import { cn } from '@/lib/cn';
import SelectionOverlay from './SelectionOverlay';
import ResultCard from './ResultCard';

interface AnalyzeDrawerProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
}

type DrawerStep = 'input' | 'analyzing' | 'result';

const ANALYZE_STEPS = [
  '截取画面中…',
  '理解视频内容…',
  '召唤灵瑞…',
  '生成回应卡…',
];

export default function AnalyzeDrawer({ scenario, isOpen, onClose }: AnalyzeDrawerProps) {
  const [step, setStep] = useState<DrawerStep>('input');
  const [question, setQuestion] = useState('');
  const [selection, setSelection] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setUserImage(base64);
      setUserImagePreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleAnalyze = useCallback(async () => {
    setStep('analyzing');
    setAnalyzeStep(0);
    setError(null);

    // Animate through steps
    const stepInterval = setInterval(() => {
      setAnalyzeStep((prev) => {
        if (prev >= ANALYZE_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    try {
      // Capture poster as base64 for the API
      let frameImageBase64: string | undefined;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 390;
        canvas.height = 693;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Draw a gradient background as fallback
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, scenario.themeColor + '40');
          gradient.addColorStop(1, scenario.themeColor + '10');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          frameImageBase64 = canvas.toDataURL('image/png').split(',')[1];
        }
      } catch {}

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          videoMeta: {
            title: scenario.videoTitle,
            author: scenario.author,
            description: scenario.description,
            tags: scenario.tags,
            transcript: scenario.ocrHint,
            ocrText: scenario.ocrHint,
          },
          question: question || scenario.defaultQuestion,
          selection: selection || undefined,
          frameImageBase64,
          userImageBase64: userImage?.split(',')[1] || undefined,
        }),
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        throw new Error(`分析失败 (${response.status})`);
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setStep('result');
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : '分析出错了');
      setStep('input');
    }
  }, [scenario, question, selection, userImage]);

  const handleClose = useCallback(() => {
    setStep('input');
    setQuestion('');
    setSelection(null);
    setUserImage(null);
    setUserImagePreview(null);
    setResult(null);
    setAnalyzeStep(0);
    setError(null);
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0',
          'bg-zinc-950/95 backdrop-blur-xl',
          'rounded-t-3xl border-t border-zinc-800/50',
          'max-h-[90%] overflow-hidden flex flex-col',
          'animate-slide-up'
        )}
      >
        {/* Handle */}
        <div className="flex justify-center py-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <img
              src={scenario.lingruiImage}
              alt={scenario.lingruiName}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-sm font-bold text-white">{scenario.lingruiName}</h3>
              <p className="text-[10px] text-zinc-500">{scenario.lingruiTitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {step === 'input' && (
            <div className="space-y-4 animate-fade-in">
              {/* Video info */}
              <div className="text-xs text-zinc-500 line-clamp-1">
                {scenario.videoTitle}
              </div>

              {/* Frame preview with selection */}
              <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                <div
                  className="aspect-[9/16] max-h-[200px] relative"
                  style={{
                    background: `linear-gradient(135deg, ${scenario.themeColor}20, ${scenario.themeColor}05)`,
                  }}
                >
                  <img
                    src={scenario.posterSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <SelectionOverlay
                    onSelectionChange={setSelection}
                    className="absolute inset-0"
                  />
                </div>
              </div>

              {/* Question input */}
              <div>
                <label className="text-xs text-zinc-400 mb-1.5 block">
                  想问{scenario.lingruiName}什么？（可选）
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={scenario.userPromptPlaceholder}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 resize-none focus:outline-none focus:border-zinc-600 transition-colors"
                  rows={2}
                />
              </div>

              {/* User image upload for jiuwei */}
              {scenario.needsUserImage && (
                <div>
                  <label className="text-xs text-zinc-400 mb-1.5 block">
                    上传你的照片（让九尾看看你的风格）
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {userImagePreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-zinc-800">
                      <img
                        src={userImagePreview}
                        alt="你的照片"
                        className="w-full max-h-[150px] object-cover"
                      />
                      <button
                        onClick={() => {
                          setUserImage(null);
                          setUserImagePreview(null);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-6 rounded-xl border-2 border-dashed border-zinc-800 text-zinc-500 text-xs hover:border-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                      📷 点击上传自拍/穿搭图
                    </button>
                  )}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: scenario.themeColor }}
              >
                开始伴看分析
              </button>
            </div>
          )}

          {step === 'analyzing' && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fade-in">
              {/* Spinning lingrui */}
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center animate-spin-slow"
                  style={{ backgroundColor: `${scenario.themeColor}20` }}
                >
                  <img
                    src={scenario.lingruiImage}
                    alt=""
                    className="w-14 h-14 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-30"
                  style={{ backgroundColor: scenario.themeColor }}
                />
              </div>

              {/* Steps */}
              <div className="space-y-3 w-full max-w-[200px]">
                {ANALYZE_STEPS.map((label, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex items-center gap-2 text-xs transition-all duration-300',
                      i <= analyzeStep ? 'text-white/90 opacity-100' : 'text-zinc-600 opacity-50'
                    )}
                  >
                    {i < analyzeStep ? (
                      <span style={{ color: scenario.themeColor }}>✓</span>
                    ) : i === analyzeStep ? (
                      <div
                        className="w-3 h-3 rounded-full animate-pulse"
                        style={{ backgroundColor: scenario.themeColor }}
                      />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-zinc-700" />
                    )}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'result' && result && (
            <div className="animate-fade-in">
              <ResultCard result={result} themeColor={scenario.themeColor} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
