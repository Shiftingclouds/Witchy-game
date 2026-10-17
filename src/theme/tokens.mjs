// Lamplight design tokens. Each reading mode is a full token set; CSS reads them as --lm-* variables.
export const READING_MODES = ['lamplight', 'parchment', 'night'];

export const FONTS = {
  display: "'Cormorant Garamond', Georgia, serif",
  label: "'Cormorant SC', 'Cormorant Garamond', Georgia, serif",
  read: "'EB Garamond', Georgia, serif",
};

export const tokens = {
  // Warm umber and wine dusk lit by gold: the default world.
  lamplight: {
    bg: '#1a0f0a',
    surface: '#26150d',
    surfaceStrong: '#341d12',
    backing: '#20120b',
    ink: '#fbf0d6',
    inkSoft: '#e4cfa6',
    gold: '#e8bf6e',
    goldBright: '#f6d48e',
    line: '#7a5631',
    wine: '#5b2433',
    focus: '#f6d48e',
  },
  // Cream pages, brown ink, gold trim: long reading or bright rooms.
  parchment: {
    bg: '#f1e6cf',
    surface: '#f8f0de',
    surfaceStrong: '#eadab8',
    backing: '#fbf5e8',
    ink: '#2b1a10',
    inkSoft: '#57402c',
    gold: '#93651f',
    goldBright: '#b07d2c',
    line: '#c4a575',
    wine: '#7a2c3c',
    focus: '#7f5212',
  },
  // Deeper and dimmer for reading in the dark.
  night: {
    bg: '#0d0806',
    surface: '#160d09',
    surfaceStrong: '#20130c',
    backing: '#110a07',
    ink: '#e6d8bb',
    inkSoft: '#bfab88',
    gold: '#c49d55',
    goldBright: '#d8b468',
    line: '#4a3320',
    wine: '#3d1821',
    focus: '#d8b468',
  },
};

const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return (
    0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  );
};

/** WCAG contrast ratio between two #rrggbb colours. */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const kebab = (key) => key.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

export function themeVariables(mode) {
  const set = tokens[mode] || tokens.lamplight;
  const vars = Object.fromEntries(Object.entries(set).map(([k, v]) => ['--lm-' + kebab(k), v]));
  vars['--lm-display'] = FONTS.display;
  vars['--lm-label'] = FONTS.label;
  vars['--lm-read'] = FONTS.read;
  return vars;
}
