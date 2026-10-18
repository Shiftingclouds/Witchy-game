import { test, expect } from './fixtures.js';

for (const mode of ['lamplight', 'parchment', 'night']) {
  test(`AI-mode patterns work in ${mode}`, async ({ page }) => {
    await page.addInitScript((m) => localStorage.setItem('lanternmere.reading-mode', m), mode);
    await page.goto('/?patterns');
    const veil = page.getByRole('status').filter({ hasText: 'The world is stirring' });
    await expect(veil).toHaveAttribute('aria-busy', 'true');

    const input = page.getByRole('textbox', { name: 'What do you do?' });
    await input.press('Enter');
    await expect(page.getByText(/^Submitted:/)).toHaveCount(0);
    await input.fill('Open the door');
    await input.press('Enter');
    await expect(page.getByText('Submitted: Open the door')).toBeVisible();
    await expect(input).toHaveValue('');

    const cards = page.getByRole('radio');
    await expect(cards).toHaveCount(2);
    await cards.first().click();
    await expect(cards.first()).toHaveAttribute('aria-checked', 'true');
    await page.keyboard.press('ArrowRight');
    await expect(cards.nth(1)).toHaveAttribute('aria-checked', 'true');
    await expect(cards.first()).toHaveAttribute('aria-checked', 'false');
  });
}
