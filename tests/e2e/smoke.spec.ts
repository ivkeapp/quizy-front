import { expect, test } from '@playwright/test';

test('login to quiz result smoke flow', async ({ page }) => {
  const healthResponse = await page.request.get('http://localhost:3000/health');
  expect(healthResponse.ok()).toBeTruthy();

  await page.goto('/login');

  await page.getByPlaceholder('Email').fill('admin@quizy.local');
  await page.getByPlaceholder('Password').fill('Admin123!');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.getByText('Network Error')).toHaveCount(0);

  await expect(page.getByRole('heading', { name: 'Start Quiz Session' })).toBeVisible();

  await page.getByRole('button', { name: 'Start quiz' }).click();

  await expect(page).toHaveURL(/\/quiz\/session\/\d+$/);
  await expect(page.getByRole('heading', { name: 'Quiz in progress' })).toBeVisible();

  for (let index = 0; index < 60; index += 1) {
    const resultHeading = page.getByRole('heading', { name: 'Quiz Result' });
    if ((await resultHeading.count()) > 0) {
      break;
    }

    const backendError = page.getByText(/prisma\.userAnswer\.upsert\(\)/i);
    if ((await backendError.count()) > 0) {
      throw new Error(
        'Backend error on answer submit: prisma.userAnswer.upsert() uses invalid unique key in /api/quiz/:sessionId/answer',
      );
    }

    const answerButtons = page.locator('main [data-testid^="answer-option-"]');
    if ((await answerButtons.count()) === 0) {
      await page.waitForTimeout(150);
      break;
    }

    const firstAnswerButton = answerButtons.first();
    await firstAnswerButton.waitFor({ state: 'visible', timeout: 10_000 });

    const clickResult = await firstAnswerButton
      .click({ timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    if (!clickResult) {
      await page.waitForTimeout(150);
      continue;
    }

    const submitButton = page.getByRole('button', { name: 'Submit & next' });
    if (await submitButton.isVisible()) {
      await submitButton.click({ timeout: 10_000 });
    }

    await page.waitForTimeout(100);
  }

  await expect(page).toHaveURL(/\/quiz\/session\/\d+\/result$/);
  await expect(page.getByRole('heading', { name: 'Quiz Result' })).toBeVisible();
  await expect(page.getByText('Total Score')).toBeVisible();
});
