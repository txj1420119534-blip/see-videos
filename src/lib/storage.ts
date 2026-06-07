'use client';

const STORAGE_KEY = 'lingrui-bankan-state';

interface AppState {
  lastSummonedLingrui: string | null;
  visitCount: number;
  nickname: string;
  lastVisit: string;
}

export function getState(): AppState {
  if (typeof window === 'undefined') {
    return { lastSummonedLingrui: null, visitCount: 0, nickname: '', lastVisit: '' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lastSummonedLingrui: null, visitCount: 0, nickname: '', lastVisit: '' };
}

export function saveState(patch: Partial<AppState>) {
  if (typeof window === 'undefined') return;
  const current = getState();
  const updated = {
    ...current,
    ...patch,
    visitCount: current.visitCount + (patch.lastSummonedLingrui ? 1 : 0),
    lastVisit: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
