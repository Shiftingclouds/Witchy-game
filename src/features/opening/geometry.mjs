// Opening-scene geometry, in percent of the painting (0–100 on each axis).
export const PAINTING = { w: 1672, h: 941 };

const pct = (x, y) => ({
  cx: Math.round((x / PAINTING.w) * 1000) / 10,
  cy: Math.round((y / PAINTING.h) * 1000) / 10,
});

// The open lake, traced around the shore grass and the foreground rocks.
export const LAKE = '14,66 86,66 97,73 90,79 79,82 75,90 69,100 44,100 40,92 33,85 16,81 6,75';

// The lantern never moves: an oval for the body and a square-cornered block for the wide base.
export const LANTERN_CUTOUT = {
  ellipse: { cx: 50, cy: 69, rx: 4.3, ry: 12 },
  base: { x: 46.4, y: 71, w: 7.2, h: 10 },
};

// Floating light orbs beside the lantern; they are not water.
export const ORBS = [
  [929, 631],
  [750, 677],
  [912, 685],
  [1059, 763],
  [930, 756],
  [675, 756],
].map(([x, y]) => pct(x, y));

// Directly under the lantern the lake is calmer (dark grey lets about a third of the ripple through).
export const CALM_ZONE = { cx: 50, cy: 86, rx: 7.5, ry: 10, level: '#222' };

// Where the glow, ripple rings and sparks come from.
export const LANTERN_LIGHT = { x: 50, y: 69, ringY: 77.6 };

/** Mask for the rippling copy of the painting: white ripples, black stays perfectly still. */
export function waterMaskDataUri() {
  const { ellipse: e, base: b } = LANTERN_CUTOUT;
  const c = CALM_ZONE;
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>" +
    "<filter id='f'><feGaussianBlur stdDeviation='1.2'/></filter>" +
    "<filter id='g'><feGaussianBlur stdDeviation='.5'/></filter>" +
    "<filter id='c' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='2.2'/></filter>" +
    "<mask id='m'>" +
    `<polygon filter='url(#f)' fill='white' points='${LAKE}'/>` +
    // Drawn before the cut-outs so it can never reopen the lantern.
    `<ellipse cx='${c.cx}' cy='${c.cy}' rx='${c.rx}' ry='${c.ry}' fill='${c.level}' filter='url(#c)'/>` +
    "<g fill='black' filter='url(#g)'>" +
    `<ellipse cx='${e.cx}' cy='${e.cy}' rx='${e.rx}' ry='${e.ry}'/>` +
    `<rect x='${b.x}' y='${b.y}' width='${b.w}' height='${b.h}' rx='1'/>` +
    ORBS.map((o) => `<ellipse cx='${o.cx}' cy='${o.cy}' rx='1.5' ry='2.6'/>`).join('') +
    '</g></mask>' +
    "<rect width='100' height='100' fill='white' mask='url(#m)'/></svg>";
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}
