'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type MutableRefObject, type RefObject } from 'react';
import { Scenario } from '@/data/scenarios';
import { AnalysisResult, getMockResult } from '@/data/mockResults';
import { cn } from '@/lib/cn';
import { getLingruiMemory, saveLingruiMemory } from '@/lib/storage';

interface AnalyzeDrawerProps {
  scenario: Scenario;
  isOpen: boolean;
  onClose: () => void;
}

type ChatMessage =
  | {
      id: string;
      sender: 'assistant' | 'user';
      kind: 'text';
      text: string;
    }
  | {
      id: string;
      sender: 'assistant';
      kind: 'result';
      result: AnalysisResult;
    };

const GREETINGS: Record<Scenario['id'], string> = {
  bixie: '辟邪探头。等我先嗅一口这条种草味，别急着冲，钱袋子先交给我看一眼。',
  baize: '白泽到。收藏先别急，我把这条备考建议拆成你今天能做的一小口。',
  jiuwei: '九尾来啦。别急着买同款，我先拆它好看在哪；你拍一下，我再给你自己的版本。',
  tianlu: '天禄上线。这个 AI 技巧我来拆成能跑、能查错、还不泄露 Key 的小步骤。',
  xuangui: '玄龟在这。先把焦虑音量调小一点，我们只拿这条视频里真正有用的一小块。',
};

const ANALYZING_LABELS: Record<Scenario['id'], string> = {
  bixie: '辟邪正在扒一扒话术的小尾巴…',
  baize: '白泽正在把建议切成小块…',
  jiuwei: '九尾正在捋顺风格毛线团…',
  tianlu: '天禄正在把步骤排排坐…',
  xuangui: '玄龟正在把压力声量拧小…',
};

export default function AnalyzeDrawer({ scenario, isOpen, onClose }: AnalyzeDrawerProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initialFeedbackKeyRef = useRef<string | null>(null);
  const progressTimerRef = useRef<number | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  const isJiuwei = scenario.id === 'jiuwei';

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsCameraReady(false);
    setIsCameraStarting(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!isJiuwei || streamRef.current || typeof navigator === 'undefined') return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('当前浏览器不能直接拍摄，可以上传一张照片继续。');
      return;
    }

    setIsCameraStarting(true);
    setCameraError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsCameraReady(true);
    } catch {
      setCameraError('相机没有打开，可以授权后重试，或上传一张照片继续。');
    } finally {
      setIsCameraStarting(false);
    }
  }, [isJiuwei]);

  const resetDrawer = useCallback(() => {
    stopCamera();
    if (progressTimerRef.current) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    initialFeedbackKeyRef.current = null;
    setQuestion('');
    setMessages([]);
    setIsSending(false);
    setError(null);
    setCameraError(null);
    setCapturedImage(null);
  }, [stopCamera]);

  useEffect(() => {
    messagesRef.current = messages;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isSending, error]);

  const handleClose = useCallback(() => {
    resetDrawer();
    onClose();
  }, [onClose, resetDrawer]);

  const analyze = useCallback(
    async (
      visibleQuestion: string,
      options?: {
        imageDataUrl?: string;
        hiddenQuestion?: string;
        silentUserMessage?: boolean;
        progressIntro?: string;
      }
    ) => {
      const trimmed = visibleQuestion.trim();
      const hiddenQuestion = options?.hiddenQuestion?.trim();
      if (!trimmed && !hiddenQuestion && !options?.imageDataUrl) return;

      if (trimmed && !options?.silentUserMessage) {
        setMessages((prev) => [
          ...prev,
          {
            id: createMessageId(),
            sender: 'user',
            kind: 'text',
            text: trimmed,
          },
        ]);
      }

      setQuestion('');
      setIsSending(true);
      setError(null);
      const conversationHistory = buildConversationHistory(messagesRef.current);

      const progressMessageId = createMessageId();
      setMessages((prev) => [
        ...prev,
        {
          id: progressMessageId,
          sender: 'assistant',
          kind: 'text',
          text: options?.progressIntro || ANALYZING_LABELS[scenario.id],
        },
      ]);
      startProgressStream(progressMessageId, scenario, (id, text) => {
        setMessages((prev) => prev.map((message) => (message.id === id && message.kind === 'text' ? { ...message, text } : message)));
      }, progressTimerRef);

      try {
        const frameImageBase64 = createFrameHint(scenario);
        const imageDataUrl = options?.imageDataUrl || capturedImage || undefined;
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
            question: hiddenQuestion || trimmed || scenario.defaultQuestion,
            conversationHistory,
            frameImageBase64,
            userImageBase64: imageDataUrl ? imageDataUrl.split(',')[1] : undefined,
            userContext:
              scenario.id === 'jiuwei' && imageDataUrl
                ? {
                    preferences: ['jiuwei_camera_demo', 'do_not_show_gender_label'],
                    lingruiMemory: getRoleMemoryForRequest(scenario.id),
                  }
                : {
                    lingruiMemory: getRoleMemoryForRequest(scenario.id),
                  },
          }),
        });

        if (!response.ok) {
          throw new Error(`分析失败 (${response.status})`);
        }

        const data: AnalysisResult = await response.json();
        saveLingruiMemory(scenario.id, {
          lastChoice: data.coreInsight,
          lastMemorySeed: data.memorySeed,
        });
        stopProgressStream(progressTimerRef);
        setMessages((prev) => [
          ...prev.filter((message) => message.id !== progressMessageId),
          ...(data.debug?.fallbackReason && data.debug.fallbackReason !== 'AI_MODE_MOCK'
            ? [
                {
                  id: createMessageId(),
                  sender: 'assistant' as const,
                  kind: 'text' as const,
                  text: '大模型这次没接稳，我先把这条视频的预制评价给你。',
                },
              ]
            : []),
          {
            id: createMessageId(),
            sender: 'assistant',
            kind: 'result',
            result: data,
          },
        ]);
      } catch (err) {
        const message = err instanceof Error ? err.message : '分析出错了';
        const fallback = getMockResult(scenario.id);
        saveLingruiMemory(scenario.id, {
          lastChoice: fallback.coreInsight,
          lastMemorySeed: fallback.memorySeed,
        });
        stopProgressStream(progressTimerRef);
        setError(message);
        setMessages((prev) => [
          ...prev.filter((item) => item.id !== progressMessageId),
          {
            id: createMessageId(),
            sender: 'assistant',
            kind: 'text',
            text: `大模型没连上，我先用${scenario.lingruiName}为这条视频准备的评价兜底。`,
          },
          {
            id: createMessageId(),
            sender: 'assistant',
            kind: 'result',
            result: {
              ...fallback,
              debug: {
                usedVision: false,
                usedUserImage: Boolean(options?.imageDataUrl || capturedImage),
                fallbackReason: message,
              },
            },
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [capturedImage, scenario]
  );

  useEffect(() => {
    if (!isOpen) return;

    const feedbackKey = `${scenario.id}:${isOpen ? 'open' : 'closed'}`;
    if (initialFeedbackKeyRef.current === feedbackKey) return;
    initialFeedbackKeyRef.current = feedbackKey;

    const setupTimer = window.setTimeout(() => {
      saveLingruiMemory(scenario.id, { incrementCallCount: true });
      setMessages([
        {
          id: createMessageId(),
          sender: 'assistant',
          kind: 'text',
          text: GREETINGS[scenario.id],
        },
      ]);
      setError(null);
      setCapturedImage(null);

      if (scenario.id === 'jiuwei') {
        void startCamera();
      } else {
        stopCamera();
      }
    }, 0);

    const feedbackTimer = window.setTimeout(() => {
      void analyze('', {
        hiddenQuestion: `先按照${scenario.lingruiName}的人设，直接给出一条针对当前视频的短反馈。不要等待用户圈选或再次点击。`,
        silentUserMessage: true,
        progressIntro: `${scenario.lingruiName}先看这条视频…`,
      });
    }, 450);

    return () => {
      window.clearTimeout(setupTimer);
      window.clearTimeout(feedbackTimer);
    };
  }, [analyze, isOpen, resetDrawer, scenario.id, scenario.lingruiName, startCamera, stopCamera]);

  const handleSend = useCallback(() => {
    void analyze(question);
  }, [analyze, question]);

  const handleCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video || !isCameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageDataUrl);
    stopCamera();

    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        sender: 'assistant',
        kind: 'text',
        text: '拍好了。我先看结构，不贴标签。你也可以继续问我穿搭、妆发或拍照角度。',
      },
    ]);

    void analyze('', {
      imageDataUrl,
      hiddenQuestion: '这是九尾拍摄框捕获的用户样貌图。请按 demo 规则做内部粗略适配判断，不要在输出里显示性别标签，只给穿搭建议和风格结论。',
      progressIntro: '九尾正在看你的风格结构…',
      silentUserMessage: true,
    });
  }, [analyze, isCameraReady, stopCamera]);

  const handleImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const imageDataUrl = reader.result as string;
        setCapturedImage(imageDataUrl);
        stopCamera();
        void analyze('', {
          imageDataUrl,
          hiddenQuestion: '这是九尾上传照片。请按 demo 规则做内部粗略适配判断，不要在输出里显示性别标签，只给穿搭建议和风格结论。',
          progressIntro: '九尾正在看你的风格结构…',
          silentUserMessage: true,
        });
      };
      reader.readAsDataURL(file);
    },
    [analyze, stopCamera]
  );

  const submitDisabled = isSending || !question.trim();

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[90] flex flex-col">
      <div className="absolute inset-0 bg-black/72 backdrop-blur-sm" onClick={handleClose} />

      <div
        className={cn(
          'absolute bottom-[62px] left-1 right-1',
          'flex max-h-[82dvh] min-h-[56dvh] flex-col overflow-hidden',
          'rounded-[24px] border border-white/[0.08] bg-[#111116]',
          'shadow-[0_-18px_48px_rgba(0,0,0,0.42)] animate-slide-up'
        )}
      >
        <div className="flex shrink-0 justify-center pb-1 pt-2.5">
          <div className="h-1 w-12 rounded-full bg-zinc-700/90" />
        </div>

        <div className="flex shrink-0 items-center justify-between px-4 pb-3 pt-1">
          <div className="flex items-center gap-3">
            <img
              src={scenario.lingruiImage}
              alt={scenario.lingruiName}
              className="h-9 w-9 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="text-[15px] font-bold text-white">{scenario.lingruiName}</h3>
              <p className="mt-0.5 text-[11px] text-zinc-500">{scenario.lingruiTitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800/90 text-lg text-zinc-400 transition-colors hover:text-white"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-5">
          <div className="space-y-3.5">
            <div className="line-clamp-1 rounded-full bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-500">
              {scenario.videoTitle}
            </div>

            {isJiuwei && !capturedImage && (
              <CameraPanel
                cameraError={cameraError}
                isCameraReady={isCameraReady}
                isCameraStarting={isCameraStarting}
                onCapture={handleCapture}
                onRetry={() => void startCamera()}
                onUpload={() => fileInputRef.current?.click()}
                videoRef={videoRef}
              />
            )}

            {isJiuwei && capturedImage && (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/70">
                <img src={capturedImage} alt="" className="max-h-44 w-full object-cover" />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {messages.map((message) =>
              message.kind === 'text' ? (
                <ChatBubble key={message.id} message={message} themeColor={scenario.themeColor} />
              ) : (
                <LingruiReplyBubble
                  key={message.id}
                  result={message.result}
                  themeColor={scenario.themeColor}
                  onAsk={(text) => {
                    void analyze(text);
                  }}
                />
              )
            )}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: scenario.themeColor }}
                />
                {ANALYZING_LABELS[scenario.id]}
              </div>
            )}

            {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">{error}</div>}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="shrink-0 border-t border-white/[0.08] bg-[#0d0d11] px-3 pb-3 pt-3">
          <div className="flex items-end gap-2.5">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!submitDisabled) handleSend();
                }
              }}
              placeholder={isJiuwei ? '和九尾聊穿搭、妆容或拍照角度' : `和${scenario.lingruiName}继续聊`}
              className="max-h-28 min-h-[50px] flex-1 resize-none rounded-[14px] border border-white/[0.12] bg-[#17171d] px-4 py-3 text-[14px] leading-relaxed text-white placeholder:text-zinc-500 outline-none transition focus:border-[#ff4d5f]/80 focus:bg-[#1d1d24]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={submitDisabled}
              className={cn(
                'h-[50px] w-[58px] shrink-0 rounded-[14px] text-sm font-black transition-all',
                submitDisabled
                  ? 'border border-white/[0.08] bg-white/[0.04] text-[#ffd233]/35'
                  : 'bg-[#ffd233] text-black shadow-[0_0_18px_rgba(255,210,51,0.28)] active:scale-[0.96]'
              )}
              title="发送"
            >
              发
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ message, themeColor }: { message: Extract<ChatMessage, { kind: 'text' }>; themeColor: string }) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[88%] rounded-[22px] px-4 py-3 text-[15px] leading-[1.75]',
          isUser ? 'rounded-br-lg text-white' : 'rounded-bl-lg border border-zinc-800 bg-zinc-900/80 text-zinc-100'
        )}
        style={isUser ? { backgroundColor: themeColor } : undefined}
      >
        {message.text}
      </div>
    </div>
  );
}

function LingruiReplyBubble({
  result,
  themeColor,
  onAsk,
}: {
  result: AnalysisResult;
  themeColor: string;
  onAsk: (text: string) => void;
}) {
  const visibleSections = result.sections.slice(0, 3);
  const chips = result.nextActions.slice(0, 3);

  return (
    <div className="flex justify-start">
      <div className="max-w-[96%] rounded-[24px] rounded-bl-lg border border-white/[0.08] bg-zinc-900/88 px-[18px] py-4 text-sm text-zinc-100 shadow-[0_10px_28px_rgba(0,0,0,0.22)]">
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className="h-2 w-2 rounded-full shadow-[0_0_10px_currentColor]"
            style={{ color: themeColor, backgroundColor: themeColor }}
          />
          <span className="text-xs font-semibold" style={{ color: themeColor }}>
            {result.openingLine}
          </span>
        </div>

        <p className="text-[16px] font-semibold leading-[1.7] text-white">{softenLine(result.coreInsight)}</p>
        <p className="mt-2 text-[13px] leading-[1.7] text-zinc-400">{result.emotionRead}</p>
        <p className="mt-2 text-[12.5px] leading-[1.7] text-zinc-500">{result.videoRead}</p>

        <div className="mt-4 space-y-3">
          {visibleSections.map((section) => (
            <div key={section.title} className="rounded-[18px] bg-white/[0.045] px-4 py-3">
              <div className="mb-2 text-xs font-semibold text-zinc-300">{section.title}</div>
              <div className="space-y-1.5">
                {section.items.slice(0, 2).map((item) => (
                  <p key={item} className="text-[12.5px] leading-[1.7] text-zinc-400">
                    {cuteBullet(item)}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-[12.5px] leading-[1.7] text-zinc-400">{result.shareQuote}</p>

        {chips.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => onAsk(chip)}
                className="rounded-full border px-3.5 py-2 text-[11.5px] leading-none text-white/85 transition-all hover:bg-white/10 active:scale-95"
                style={{ borderColor: `${themeColor}55`, backgroundColor: `${themeColor}18` }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CameraPanel({
  cameraError,
  isCameraReady,
  isCameraStarting,
  onCapture,
  onRetry,
  onUpload,
  videoRef,
}: {
  cameraError: string | null;
  isCameraReady: boolean;
  isCameraStarting: boolean;
  onCapture: () => void;
  onRetry: () => void;
  onUpload: () => void;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-black">
      <div className="relative aspect-[3/4] max-h-[420px]">
        <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
        {!isCameraReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 text-center">
            <div className="mb-2 text-sm font-semibold text-white">{isCameraStarting ? '正在打开拍摄框' : '九尾拍摄框'}</div>
            <div className="max-w-48 text-xs leading-relaxed text-zinc-500">
              {cameraError || '打开相机后，按下拍摄键即可开始识别。'}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 border-t border-zinc-900 px-4 py-3">
        <button
          onClick={cameraError ? onRetry : onCapture}
          disabled={!cameraError && !isCameraReady}
          className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-white/20 transition-all active:scale-95 disabled:opacity-40"
          aria-label={cameraError ? '重试打开相机' : '拍摄'}
        >
          <span className="h-10 w-10 rounded-full bg-white" />
        </button>
        {cameraError && (
          <button
            onClick={onUpload}
            className="rounded-full border border-zinc-700 px-4 py-2 text-xs text-zinc-300 transition-colors hover:bg-white/10"
          >
            上传照片
          </button>
        )}
      </div>
    </div>
  );
}

function createFrameHint(scenario: Scenario): string | undefined {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 390;
    canvas.height = 693;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `${scenario.themeColor}40`);
    gradient.addColorStop(1, `${scenario.themeColor}10`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png').split(',')[1];
  } catch {
    return undefined;
  }
}

function createMessageId(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getRoleMemoryForRequest(roleId: string) {
  const memory = getLingruiMemory(roleId);
  if (!memory || !('callCount' in memory)) return undefined;
  return memory;
}

function startProgressStream(
  messageId: string,
  scenario: Scenario,
  onText: (messageId: string, text: string) => void,
  timerRef: MutableRefObject<number | null>
) {
  stopProgressStream(timerRef);

  const chunks = [
    `${scenario.lingruiName}先贴近屏幕看一眼…`,
    `小小灵力启动：${scenario.lingruiTitle}上线中…`,
    '正在捡出最有用的一句话…',
    '马上回你，正在把话说得短一点、软一点…',
  ];
  let index = 0;

  onText(messageId, chunks[index]);
  timerRef.current = window.setInterval(() => {
    index = Math.min(index + 1, chunks.length - 1);
    onText(messageId, chunks[index]);
  }, 520);
}

function buildConversationHistory(messages: ChatMessage[]) {
  return messages
    .slice(-10)
    .map((message) => ({
      role: message.sender,
      content: message.kind === 'text' ? message.text : resultToConversationText(message.result),
    }))
    .filter((message) => message.content.trim().length > 0);
}

function resultToConversationText(result: AnalysisResult): string {
  const sectionText = result.sections
    .slice(0, 2)
    .map((section) => `${section.title}：${section.items.slice(0, 2).join('；')}`)
    .join(' / ');

  return `${result.openingLine} ${result.coreInsight} ${sectionText}`;
}

function softenLine(line: string): string {
  if (/[呀呢啦喔～~]$/.test(line)) return line;
  return `${line} 我先这样判一下。`;
}

function cuteBullet(item: string): string {
  if (/^(先别|不要|不建议)/.test(item)) return `先别：${item.replace(/^(先别|不要|不建议)/, '').trim()}`;
  return `小记：${item}`;
}

function stopProgressStream(timerRef: MutableRefObject<number | null>) {
  if (!timerRef.current) return;
  window.clearInterval(timerRef.current);
  timerRef.current = null;
}
