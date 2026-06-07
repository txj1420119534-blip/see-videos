'use client';

const STORAGE_KEY = 'lingrui-bankan-state';
const MEMORY_KEY = 'lingrui-bankan-lingrui-memory';

interface AppState {
  lastSummonedLingrui: string | null;
  visitCount: number;
  nickname: string;
  lastVisit: string;
}

export interface LingruiMemoryEntry {
  callCount: number;
  lastChoice?: string;
  lastMemorySeed?: string;
  updatedAt: string;
}

export type LingruiMemory = Record<string, LingruiMemoryEntry>;

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

export function getLingruiMemory(roleId?: string): LingruiMemoryEntry | LingruiMemory | undefined {
  if (typeof window === 'undefined') return roleId ? undefined : {};
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    const memory = raw ? (JSON.parse(raw) as LingruiMemory) : {};
    return roleId ? memory[roleId] : memory;
  } catch {
    return roleId ? undefined : {};
  }
}

export function saveLingruiMemory(
  roleId: string,
  patch: Partial<Omit<LingruiMemoryEntry, 'callCount' | 'updatedAt'>> & { incrementCallCount?: boolean }
) {
  if (typeof window === 'undefined') return;
  const all = (getLingruiMemory() as LingruiMemory) || {};
  const current = all[roleId] || { callCount: 0, updatedAt: '' };
  const updated: LingruiMemoryEntry = {
    ...current,
    ...patch,
    callCount: current.callCount + (patch.incrementCallCount ? 1 : 0),
    updatedAt: new Date().toISOString(),
  };

  delete (updated as LingruiMemoryEntry & { incrementCallCount?: boolean }).incrementCallCount;

  localStorage.setItem(
    MEMORY_KEY,
    JSON.stringify({
      ...all,
      [roleId]: updated,
    })
  );
}
