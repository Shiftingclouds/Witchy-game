import { test, expect } from './fixtures.js';
import { enterMode } from './story-helpers.js';

// Coloured glow is reserved for light sources (DESIGN.md "Light has a source").
const chromaticShadows = (page) =>
  page.evaluate(() => {
    const chromatic = (value) =>
      [...value.matchAll(/rgba?\(([^)]+)\)/g)].some(([, inner]) => {
        const [r, g, b, a = 1] = inner.split(',').map(Number);
        return a > 0.05 && Math.max(r, g, b) - Math.min(r, g, b) > 40;
      });
    return [...document.querySelectorAll('.app-shell *')]
      .filter((el) => !el.closest('[data-light-source]'))
      .filter((el) => {
        const s = getComputedStyle(el);
        return chromatic(s.boxShadow) || chromatic(s.textShadow);
      })
      .map((el) => el.className.toString())
      .slice(0, 5);
  });

test.use({ viewport: { width: 1440, height: 900 } });

test('your day leads with the scene; map, people and profiles speak Lamplight', async ({
  page,
}) => {
  await page.goto('/');
  await enterMode(page, 'live');
  const hero = await page.locator('.scene').first().boundingBox();
  const content = await page.locator('.main-content').boundingBox();
  expect(hero.width / content.width).toBeGreaterThan(0.6);
  expect(await chromaticShadows(page)).toEqual([]);

  await page.getByRole('button', { name: 'World map', exact: true }).click();
  const tileName = page.locator('.location-tile strong').first();
  await expect(tileName).toBeVisible();
  expect(await tileName.evaluate((el) => getComputedStyle(el).fontFamily)).toMatch(
    /Cormorant Garamond/,
  );
  expect(await chromaticShadows(page)).toEqual([]);

  await page.getByRole('button', { name: 'People', exact: true }).click();
  const card = page.locator('.person-card').first();
  await expect(card).toBeVisible();
  expect(await card.evaluate((el) => getComputedStyle(el).borderRadius)).toMatch(/^[0-3]px$/);
  expect(await chromaticShadows(page)).toEqual([]);
});
