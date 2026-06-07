'use client';

import { cn } from '@/lib/cn';

interface DouyinShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function DouyinShell({ children, className }: DouyinShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black">
      <div
        className={cn(
          'relative h-[100dvh] w-full max-w-[420px] overflow-hidden bg-black text-white',
          'shadow-[0_0_80px_rgba(0,0,0,0.9)]',
          className
        )}
      >
        <div className="absolute inset-0">{children}</div>

        <StatusBar />
        <TopNav />
        <BottomNav />
        <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-[70] h-1 w-32 -translate-x-1/2 rounded-full bg-white/55" />
      </div>
    </main>
  );
}

function StatusBar() {
  return (
    <div className="pointer-events-none absolute left-0 right-0 top-0 z-[70] flex h-[34px] items-center justify-between bg-gradient-to-b from-black/45 to-transparent px-5 pt-1.5 text-[15px] font-semibold tracking-[0.2px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.45)]">
      <span>9:41</span>
      <div className="flex items-center gap-1.5 text-[11px] font-bold">
        <span className="tracking-[1px]">5G</span>
        <span className="relative inline-flex h-[9px] w-[18px] rounded-[2px] border border-white/90 after:absolute after:-right-[3px] after:top-1/2 after:h-[5px] after:w-[2px] after:-translate-y-1/2 after:rounded-r after:bg-white/90">
          <span className="m-[1px] block h-[5px] w-[13px] rounded-[1px] bg-white" />
        </span>
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <div className="absolute left-0 right-0 top-[34px] z-[65] flex items-center gap-3 bg-gradient-to-b from-black/35 to-transparent px-3.5 pb-2 pt-2 text-sm text-white/60 [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
      <button className="flex h-8 w-8 items-center justify-center text-2xl font-light text-white active:scale-95">
        ≡
      </button>
      <button className="relative whitespace-nowrap px-0 py-1.5 font-medium active:scale-95">
        关注
      </button>
      <button className="relative whitespace-nowrap px-0 py-1.5 text-[17px] font-extrabold tracking-[0.5px] text-white after:absolute after:bottom-0 after:left-1/2 after:h-[3px] after:w-[18px] after:-translate-x-1/2 after:rounded-full after:bg-white after:shadow-[0_0_6px_rgba(255,255,255,0.55)] active:scale-95">
        推荐
      </button>
      <button className="relative whitespace-nowrap px-0 py-1.5 font-medium active:scale-95">
        灵瑞
      </button>
      <button className="ml-auto flex h-8 w-8 items-center justify-center text-[21px] text-white/95 active:scale-95">
        ⌕
      </button>
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-[70] flex h-[46px] items-center justify-around border-t border-white/[0.06] bg-black text-[11.5px] tracking-[0.5px] text-white/60">
      <TabItem label="首页" active />
      <TabItem label="朋友" />
      <button className="flex min-w-12 items-center justify-center active:scale-95" title="发布">
        <span className="relative flex h-7 w-[46px] items-center justify-center rounded-lg border-2 border-white bg-black text-[22px] font-light leading-none text-white before:absolute before:-left-1 before:top-1 before:h-5 before:w-5 before:rounded-md before:bg-[#25f4ee] before:opacity-70 after:absolute after:-right-1 after:top-1 after:h-5 after:w-5 after:rounded-md after:bg-[#fe2c55] after:opacity-70">
          <span className="relative z-10">+</span>
        </span>
      </button>
      <TabItem label="消息" />
      <TabItem label="我" />
    </nav>
  );
}

function TabItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={cn(
        'min-w-12 px-2 py-1 leading-[1.4] active:scale-95',
        active && 'text-[13px] font-extrabold text-white'
      )}
    >
      {label}
    </button>
  );
}
