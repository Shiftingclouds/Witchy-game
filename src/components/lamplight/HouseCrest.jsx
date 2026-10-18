import { useEffect, useState } from 'react';
import { art, houses } from '../../content.mjs';

// Which pieces of art are real paintings (not "ART NEEDED" placeholders), loaded once.
let manifest = null;
const loadManifest = () =>
  (manifest ??= fetch('/art/manifest.json')
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []));

export function useRealArt(id) {
  const [real, setReal] = useState(false);
  useEffect(() => {
    let live = true;
    loadManifest().then((list) => {
      if (live) setReal(list.some((a) => a.id === id && !a.placeholder));
    });
    return () => {
      live = false;
    };
  }, [id]);
  return real;
}

/**
 * A house's crest: ChatGPT's painting once `crest-<house>.png` arrives; until then a gold hairline
 * shield with the house's initial, in the house colour.
 */
export function HouseCrest({ house, size = 64 }) {
  const real = useRealArt('crest-' + house);
  const h = houses.find((x) => x.id === house);
  if (!h) return null;
  if (real)
    return (
      <img
        className="house-crest-mark"
        src={art('crest-' + house)}
        alt={`${h.name} crest`}
        width={size}
        height={size}
      />
    );
  return (
    <svg
      className="house-crest-mark"
      viewBox="0 0 64 72"
      width={size}
      height={(size * 72) / 64}
      role="img"
      aria-label={`${h.name} crest`}
    >
      <path
        d="M32 3 L59 12 V34 C59 52 47 63 32 69 C17 63 5 52 5 34 V12 Z"
        fill={h.color}
        fillOpacity="0.28"
        stroke="var(--lm-gold, #e8bf6e)"
        strokeWidth="1.4"
      />
      <path
        d="M32 9 L54 16 V34 C54 49 44 58 32 63 C20 58 10 49 10 34 V16 Z"
        fill="none"
        stroke="var(--lm-gold, #e8bf6e)"
        strokeOpacity="0.45"
        strokeWidth="0.8"
      />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="var(--lm-label, Georgia, serif)"
        fontSize="26"
        fontWeight="600"
        fill="var(--lm-gold-bright, #f6d48e)"
      >
        {h.name[0]}
      </text>
    </svg>
  );
}
