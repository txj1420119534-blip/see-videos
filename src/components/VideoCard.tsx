'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Scenario } from '@/data/scenarios';
import { cn } from '@/lib/cn';

interface VideoCardProps {
  scenario: Scenario;
}

const BASE_COUNTS: Record<Scenario['id'], { likes: string; comments: string; saves: string; shares: string }> = {
  bixie: { likes: '12.3w', comments: '8642', saves: '收藏', shares: '分享' },
  baize: { likes: '8.6w', comments: '4321', saves: '收藏', shares: '分享' },
  jiuwei: { likes: '21.8w', comments: '1.2w', saves: '收藏', shares: '分享' },
  tianlu: { likes: '6.9w', comments: '3021', saves: '收藏', shares: '分享' },
  xuangui: { likes: '18.4w', comments: '9203', saves: '收藏', shares: '分享' },
};

export default function VideoCard({ scenario }: VideoCardProps) {
  const [videoError, setVideoError] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const counts = useMemo(() => BASE_COUNTS[scenario.id], [scenario.id]);
  const showVideo = Boolean(scenario.videoSrc) && !videoError;
  const showPoster = !showVideo && !posterError;

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay can still be paused by the browser in background tabs.
      });
    }
  }, [showVideo, scenario.videoSrc]);

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      <div className="relative flex-1 overflow-hidden">
        {showVideo ? (
          <video
            ref={videoRef}
            key={scenario.videoSrc}
            src={scenario.videoSrc}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
          />
        ) : showPoster ? (
          <img
            src={scenario.posterSrc}
            alt={scenario.videoTitle}
            className="absolute inset-0 h-full w-full object-cover"
            onError={() => setPosterError(true)}
          />
        ) : (
          <FallbackBackdrop scenario={scenario} />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/42 via-transparent via-35% to-black/88" />
        <div className="absolute bottom-[46px] left-0 right-0 h-0.5 bg-white/20">
          <div className="h-full w-1/3 animate-feed-progress bg-white/90" />
        </div>

        <RightRail
          scenario={scenario}
          counts={counts}
          liked={liked}
          saved={saved}
          onLike={() => setLiked((value) => !value)}
          onSave={() => setSaved((value) => !value)}
        />

        <Caption scenario={scenario} />
      </div>
    </div>
  );
}

function RightRail({
  scenario,
  counts,
  liked,
  saved,
  onLike,
  onSave,
}: {
  scenario: Scenario;
  counts: { likes: string; comments: string; saves: string; shares: string };
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
}) {
  return (
    <div className="absolute bottom-[110px] right-2 z-20 flex flex-col items-center gap-[18px] text-white">
      <button className="relative h-12 w-12 rounded-full border-2 border-white bg-white/10 shadow-[0_2px_8px_rgba(0,0,0,.35)] active:scale-95">
        <img src={scenario.lingruiImage} alt="" className="h-full w-full rounded-full object-cover" />
        <span className="absolute -bottom-2 left-1/2 flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center rounded-full border border-white bg-[#fe2c55] text-sm font-bold leading-none">
          +
        </span>
      </button>

      <RailButton icon={liked ? '♥' : '♡'} label={counts.likes} active={liked} onClick={onLike} />
      <RailButton icon="💬" label={counts.comments} />
      <RailButton icon={saved ? '★' : '☆'} label={counts.saves} active={saved} onClick={onSave} />
      <RailButton icon="↪" label={counts.shares} />
    </div>
  );
}

function RailButton({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-0.5 text-xs font-bold tracking-[0.3px] active:scale-95',
        active ? 'text-[#ff3a5c]' : 'text-white'
      )}
    >
      <span className="text-[31px] leading-none drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.55)]">
        {icon}
      </span>
      <span className="text-[11px] leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,.65)]">
        {label}
      </span>
    </button>
  );
}

function Caption({ scenario }: { scenario: Scenario }) {
  return (
    <div className="absolute bottom-[64px] left-3.5 right-[84px] z-20 text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.7)]">
      <p className="mb-1.5 text-base font-extrabold tracking-[0.3px]">{scenario.author}</p>
      <p className="line-clamp-2 text-sm font-medium leading-[1.55] tracking-[0.2px]">
        {scenario.videoTitle}
      </p>
      <p className="mt-1.5 line-clamp-1 text-xs text-white/88">{scenario.description}</p>
      <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-1">
        {scenario.tags.map((tag) => (
          <span key={tag} className="text-xs font-medium text-[#9ec5ff]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-xs text-white/90">
        <span className="text-sm">♪</span>
        <span className="truncate">灵瑞伴看 · {scenario.lingruiName}正在听这条视频</span>
      </div>
    </div>
  );
}

function FallbackBackdrop({ scenario }: { scenario: Scenario }) {
  return (
    <div className={cn('absolute inset-0 bg-gradient-to-br', scenario.bgGradient)}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-32 w-32 rounded-full border-2 border-white/30" />
        <div className="absolute bottom-1/3 right-1/4 h-24 w-24 rounded-full border border-white/20" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <img
            src={scenario.lingruiImage}
            alt=""
            className="mx-auto mb-4 h-24 w-24 rounded-full object-cover opacity-80"
          />
          <p className="text-sm text-white/60">
            {scenario.lingruiName} · {scenario.lingruiTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
