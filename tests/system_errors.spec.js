// import { test, expect } from '@playwright/test';
// import {
//   setupPage,
//   verifyStep,
//   step_1_SelectDepartment,
//   step2_SelectAnliegen,
//   clickWeiter,
//   closeHinweis,
//   ensureWeiterButtonState,
//   checkInputValue,
//   step3_SelectLocation,
//   step4_SelectDate,
//   step_5_FillForm,
//   verifyReservierenButton,
//   verifyLogo,
//   verifyKontrastBtnAn,
//   verifyKontrastBtnAus,
//   verifySprachBtnAn,
//   verifySprachBtnAus,
//   verifyFooterLinksFunctional,
//   verifyFooterLinksVisible,
//   verifyStepIndicator,
//   verifyUebersichtData,
//   validateField,
//   runNegativeChecks,
//   verifyUebersichtState,
//   getFormattedFutureDate,
// } from './helpers.js';
//import testData from './testData.json' assert { type: 'json' };
import { test, expect } from '@playwright/test';
import { setupPage } from './helpers.js';

test.describe('System Resilience & Error Handling', () => {
  test('TS_06 - Filter: No Available Slots Handling', async ({ page }) => {
    test.fixme(true, 'Blocked: Slot availability depends on live test data');
  });

  test('TS_13 - System: API 500 Error Handling', async ({ page }) => {
    await page.route('**/calendar.js', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await setupPage(page);
    await page.getByRole('button', { name: 'Bürgeramt' }).click();

    await page.getByRole('tab').first().click();
    await page.locator('.btn-number[data-type="plus"]').first().click();

    await page.getByRole('button', { name: 'Weiter' }).click();
    await page.locator('#OKButton').click();

    const step4Heading = page.getByRole('heading', { name: 'Schritt 4' });
    await expect(step4Heading).not.toBeVisible();

    const calendarTable = page.locator('table.sugg_table');
    await expect(calendarTable).not.toBeVisible();

    const errorText = page.getByText(/Fehler/i);
    await expect(errorText).toBeVisible({ timeout: 10000 });
  });
});
