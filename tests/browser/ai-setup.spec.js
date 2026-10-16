import { test, expect } from '@playwright/test';
import http from 'node:http';

test('owner connects a provider through setup, talks to a character, reloads settings, and disconnects', async ({
  page,
}) => {
  const received = [];
  const provider = http.createServer(async (req, res) => {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    received.push(JSON.parse(raw));
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                text: 'Come in. There is a place by the fire.',
                emotion: 'warm',
              }),
            },
          },
        ],
      }),
    );
  });
  await new Promise((resolve) => provider.listen(0, '127.0.0.1', resolve));
  try {
    await page.goto('/setup');
    await expect(page.getByRole('heading', { name: 'A few details, then a hello.' })).toBeVisible();
    await page.getByLabel('Setup code', { exact: true }).fill('incorrect-code');
    await page.getByRole('button', { name: 'Unlock setup' }).click();
    await expect(page.getByRole('alert')).toContainText('setup code');
    await page.getByLabel('Setup code', { exact: true }).fill('browser-tests-only-setup-code');
    await page.getByRole('button', { name: 'Unlock setup' }).click();
    await expect(page.getByRole('combobox', { name: 'AI provider', exact: true })).toBeVisible();
    await page.screenshot({ path: 'docs/ai-setup.png', fullPage: true });
    await page.getByRole('combobox', { name: 'AI provider', exact: true }).selectOption('custom');
    await page.getByLabel('API base URL').fill(`http://127.0.0.1:${provider.address().port}/v1`);
    await page.getByLabel('Model ID').fill('browser-fixture-model');
    await page.getByRole('button', { name: 'Test & save connection' }).click();
    await expect(
      page.getByRole('status').filter({ hasText: 'Connection tested and saved' }),
    ).toBeVisible();
    await expect(page.locator('.setup-preview')).toContainText('a place by the fire');
    await page.getByRole('button', { name: 'Back to the game' }).click();
    await page.getByRole('button', { name: 'Live the world', exact: false }).click();
    await page.getByRole('button', { name: 'Talk to Rowan', exact: true }).first().click();
    await page.getByLabel('Or say something in your own words').fill('What can I do here?');
    await page.getByRole('button', { name: 'Send to AI', exact: true }).click();
    await expect(page.locator('blockquote')).toContainText('a place by the fire');
    expect(received.length).toBe(2);
    expect(received[1].messages[0].content).toContain('Warm, conversational sentences');
    const browserData = await page.evaluate(() => JSON.stringify({ ...localStorage }));
    expect(browserData).not.toContain('browser-tests-only-setup-code');
    await page.reload();
    await page.getByRole('button', { name: 'AI setup & connection help' }).click();
    await page.getByLabel('Setup code', { exact: true }).fill('browser-tests-only-setup-code');
    await page.getByRole('button', { name: 'Unlock setup' }).click();
    await expect(page.getByLabel('Model ID')).toHaveValue('browser-fixture-model');
    await page.getByRole('button', { name: 'Disconnect AI and remove saved key' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'AI disconnected' })).toBeVisible();
  } finally {
    provider.closeAllConnections();
    await new Promise((resolve) => provider.close(resolve));
  }
});

test('setup stays readable on a phone and its instructions are available offline', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.goto('/setup');
  await expect(page.getByRole('heading', { name: 'No connection needed.' })).toBeVisible();
  await expect(page.getByText('npm run ai:setup-code', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Continue with prepared dialogue' }).click();
  await page.getByRole('button', { name: 'Read the book', exact: false }).click();
  await expect(page.getByRole('heading', { name: 'The light we leave behind.' })).toBeVisible();
  await context.setOffline(false);
});
