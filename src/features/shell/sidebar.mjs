import { useCallback, useEffect, useState } from 'react';

export const SIDEBAR_STATES = ['open', 'rail', 'hidden'];
const KEY = 'lanternmere.sidebar';
const LAST_KEY = 'lanternmere.sidebar-last';

export const nextSidebarState = (state) =>
  SIDEBAR_STATES.includes(state)
    ? SIDEBAR_STATES[(SIDEBAR_STATES.indexOf(state) + 1) % SIDEBAR_STATES.length]
    : 'open';

/** The visible state to return to when un-hiding. */
export const lastVisible = (state) => (state === 'rail' ? 'rail' : 'open');

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* The sidebar still works without storage. */
  }
};

/** Open / rail / hidden, remembered between sessions. Ctrl+B hides and restores it. */
export function useSidebarState() {
  const [state, setState] = useState(() => {
    // Small windows start with the icon rail so the art has room; an explicit choice always wins.
    const fallback = typeof window !== 'undefined' && window.innerWidth < 1200 ? 'rail' : 'open';
    const saved = read(KEY, fallback);
    return SIDEBAR_STATES.includes(saved) ? saved : fallback;
  });
  const set = useCallback((next) => {
    setState(next);
    write(KEY, next);
    if (next !== 'hidden') write(LAST_KEY, next);
  }, []);
  const cycle = useCallback(() => set(nextSidebarState(state)), [state, set]);
  const toggleHidden = useCallback(
    () => set(state === 'hidden' ? lastVisible(read(LAST_KEY, 'open')) : 'hidden'),
    [state, set],
  );
  useEffect(() => {
    const onKey = (event) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'b') return;
      const field = event.target.closest?.('input, textarea, select, [contenteditable="true"]');
      if (field) return;
      event.preventDefault();
      toggleHidden();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [toggleHidden]);
  return { state, cycle, toggleHidden, show: () => set(lastVisible(read(LAST_KEY, 'open'))) };
}
