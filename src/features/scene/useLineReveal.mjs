import { useEffect, useMemo, useState } from 'react';
import { letterDelay, textCharacters } from '../../scene-beats.mjs';

/**
 * Types a line in. State belongs to one line id, so a new line can never start "already finished"
 * (or blank): its first render shows the first letter and counts on from there.
 */
export function useLineReveal(
  lineId,
  text,
  { speed = 'normal', reduced = false, paused = false } = {},
) {
  const chars = useMemo(() => textCharacters(text), [text]);
  const [progress, setProgress] = useState({ lineId, count: 1 });
  const immediate = reduced || speed === 'instant';
  const own = progress.lineId === lineId ? progress.count : 1;
  const count = immediate ? chars.length : Math.min(Math.max(own, 1), chars.length);
  useEffect(() => {
    if (immediate || paused || count >= chars.length) return;
    const timer = setTimeout(
      () => setProgress({ lineId, count: count + 1 }),
      letterDelay(chars[count - 1], speed),
    );
    return () => clearTimeout(timer);
  }, [lineId, chars, count, immediate, paused, speed]);
  return {
    visible: chars.slice(0, count).join(''),
    complete: count >= chars.length,
    reveal: () => setProgress({ lineId, count: chars.length }),
  };
}
