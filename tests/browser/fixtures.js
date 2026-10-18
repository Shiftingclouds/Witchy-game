// Shared test setup. Arrival paintings wait for a click before every scene and trip; most tests are
// about something else, so they dismiss themselves here. Tests of the paintings turn this off with
// test.use({ autoArrive: false }).
import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  autoArrive: [true, { option: true }],
  page: async ({ page, autoArrive }, use) => {
    if (autoArrive)
      await page.addInitScript(() => {
        new MutationObserver(() => {
          const painting = document.querySelector('.arrival-painting:not(.leaving)');
          if (painting) painting.click();
        }).observe(document, { childList: true, subtree: true });
      });
    await use(page);
  },
});
export { expect };
