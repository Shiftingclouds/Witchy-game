import { PNG } from 'pngjs';

/** Box as fractions of the viewport: [x0, y0, x1, y1]. */
async function grab(page, box) {
  const { width, height } = page.viewportSize();
  const clip = {
    x: box[0] * width,
    y: box[1] * height,
    width: (box[2] - box[0]) * width,
    height: (box[3] - box[1]) * height,
  };
  return PNG.sync.read(await page.screenshot({ clip }));
}

export function difference(a, b) {
  let total = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const la = 0.299 * a.data[i] + 0.587 * a.data[i + 1] + 0.114 * a.data[i + 2];
    const lb = 0.299 * b.data[i] + 0.587 * b.data[i + 1] + 0.114 * b.data[i + 2];
    total += Math.abs(la - lb);
  }
  return total / (a.data.length / 4);
}

/** Mean luminance change inside a box over `ms` milliseconds. */
export async function motion(page, box, ms) {
  const first = await grab(page, box);
  await page.waitForTimeout(ms);
  return difference(first, await grab(page, box));
}

export async function frames(page, box, count, gap) {
  const shots = [];
  for (let i = 0; i < count; i++) {
    shots.push(await grab(page, box));
    await page.waitForTimeout(gap);
  }
  return shots;
}
