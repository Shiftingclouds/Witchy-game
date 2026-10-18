import { useEffect, useRef, useState } from 'react';
import { soundFor } from './soundscape.mjs';
import { getVolumes, useVolumes, VOLUME_LEVELS } from './settings.mjs';

let manifest = null;
const loadManifest = () =>
  (manifest ??= fetch('audio/manifest.json')
    .then((r) => (r.ok ? r.json() : { tracks: {} }))
    .then((m) => m.tracks || {})
    .catch(() => ({})));

/** A short sound, if it exists (e.g. playSfx('sfx-lantern-light')). Silent when missing or muted. */
export function playSfx(name) {
  const level = VOLUME_LEVELS[getVolumes().sound];
  if (!level) return;
  loadManifest().then((tracks) => {
    const src = tracks['sfx/' + name];
    if (!src) return;
    const a = new Audio(src);
    a.volume = level;
    a.play().catch(() => {});
  });
}

const FADE = 1600;

/** Fade one <audio> element's volume to a target over FADE ms. */
function fadeTo(audio, target, done) {
  const start = audio.volume;
  const began = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - began) / FADE);
    audio.volume = start + (target - start) * t;
    if (t < 1) requestAnimationFrame(step);
    else done?.();
  };
  requestAnimationFrame(step);
}

/** One looping layer (the music, or one ambient bed) that crossfades when its track changes. */
function useLayer(src, level) {
  const playing = useRef(null);
  useEffect(() => {
    const old = playing.current;
    if (!old && !src) return;
    if (old && old.dataset.src === src) {
      old.volume = level;
      return;
    }
    if (old) fadeTo(old, 0, () => old.pause());
    if (!src || !level) {
      playing.current = null;
      return;
    }
    const next = new Audio(src);
    next.dataset.src = src;
    next.loop = true;
    next.volume = 0;
    playing.current = next;
    const start = () =>
      next
        .play()
        .then(() => fadeTo(next, level))
        .catch(() => {});
    start();
    // Browsers may wait for a first click or key before sound is allowed.
    const retry = () => next.paused && playing.current === next && start();
    addEventListener('pointerdown', retry, { once: true });
    addEventListener('keydown', retry, { once: true });
    return () => {
      removeEventListener('pointerdown', retry);
      removeEventListener('keydown', retry);
    };
  }, [src, level]);
  useEffect(() => () => playing.current?.pause(), []);
}

/**
 * Plays the music and ambient sound for `context` (see soundFor). Renders an invisible marker so
 * tests and debugging can see what is playing.
 */
export function Soundscape({ context }) {
  const [tracks, setTracks] = useState(null);
  const volumes = useVolumes();
  useEffect(() => {
    loadManifest().then(setTracks);
  }, []);
  const available = new Set(Object.keys(tracks || {}));
  const { music, ambience } = tracks ? soundFor(context, available) : { music: null, ambience: [] };
  const musicLevel = VOLUME_LEVELS[volumes.music];
  const soundLevel = VOLUME_LEVELS[volumes.sound] * 0.7;
  useLayer(music && tracks[music], musicLevel);
  useLayer(ambience[0] && tracks[ambience[0]], soundLevel);
  useLayer(ambience[1] && tracks[ambience[1]], soundLevel);
  return (
    <span
      className="soundscape"
      hidden
      data-music={music || ''}
      data-ambience={ambience.join(' ')}
      data-music-volume={volumes.music}
    />
  );
}
