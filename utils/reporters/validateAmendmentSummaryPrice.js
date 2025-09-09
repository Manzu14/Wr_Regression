// utils/validateAmendmentSummaryPrice.js

import { expect } from '@playwright/test';

export async function validateAmendmentSummaryPrice(page, expectedPrice) {
  const summaryText = await page.locator('.Commons__priceContainer .Commons__main').first().textContent(); // choose `.first()` or better locator
  const summaryPrice = parseFloat(summaryText?.replace(/[^\d.]/g, ''));

  console.log(`💶 Price shown in summary: €${summaryPrice}`);
  console.log(`🧾 Expected total: €${expectedPrice}`);

  expect(summaryPrice, '✅ Baggage total in summary').toBeCloseTo(expectedPrice, 1);
}
