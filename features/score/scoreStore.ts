/** A tiny external store for the player's lifetime score, persisted to
 *  localStorage and shared across the app via useSyncExternalStore. Kept
 *  framework-light so any component (or game hook) can read or award points. */

export type ScoreState = { total: number; wins: number };

const KEY = "framely.player.score";
const SERVER_STATE: ScoreState = { total: 0, wins: 0 };

let state: ScoreState | null = null;
const listeners = new Set<() => void>();

const load = (): ScoreState => {
  if (typeof window === "undefined") return { total: 0, wins: 0 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { total: 0, wins: 0 };
    const parsed = JSON.parse(raw) as Partial<ScoreState>;
    return {
      total: Math.max(0, Math.round(Number(parsed.total) || 0)),
      wins: Math.max(0, Math.round(Number(parsed.wins) || 0)),
    };
  } catch {
    return { total: 0, wins: 0 };
  }
};

const current = (): ScoreState => (state ??= load());

const persist = () => {
  if (typeof window !== "undefined" && state) {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  }
};

const emit = () => listeners.forEach((listener) => listener());

export const subscribeScore = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getScoreSnapshot = (): ScoreState => current();
export const getScoreServerSnapshot = (): ScoreState => SERVER_STATE;

/** Add points for a single won game and bump the win counter. */
export const addScore = (points: number): void => {
  if (!Number.isFinite(points) || points <= 0) return;
  const c = current();
  state = { total: c.total + Math.round(points), wins: c.wins + 1 };
  persist();
  emit();
};

export const resetScore = (): void => {
  state = { total: 0, wins: 0 };
  persist();
  emit();
};
