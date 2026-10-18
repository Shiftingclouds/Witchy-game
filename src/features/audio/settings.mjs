// Music and sound volume, remembered between sessions and shared by every control that shows them.
import { useSyncExternalStore } from 'react';

export const VOLUME_LEVELS = { off: 0, low: 0.3, medium: 0.6, high: 1 };
const DEFAULTS = { music: 'medium', sound: 'medium' };
const listeners = new Set();
const read = (key) => {
  try {
    const value = localStorage.getItem('lanternmere.' + key + '-volume');
    return value in VOLUME_LEVELS ? value : DEFAULTS[key];
  } catch {
    return DEFAULTS[key];
  }
};
let current = { music: read('music'), sound: read('sound') };

export function setVolume(key, level) {
  if (!(level in VOLUME_LEVELS)) return;
  current = { ...current, [key]: level };
  try {
    localStorage.setItem('lanternmere.' + key + '-volume', level);
  } catch {
    /* the choice just won't be remembered */
  }
  listeners.forEach((l) => l());
}
export const getVolumes = () => current;
export function useVolumes() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    () => current,
  );
}
