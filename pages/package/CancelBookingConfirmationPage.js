// @ts-check
const { expect } = require('@playwright/test');

/**
 * @typedef {import('@playwright/test').Page} Page
 */

class CancelBookingConfirmationPage {
  /**
   * @param {Page} page
   */
  constructor(page) {
    this.page = page;

    // Optional UI elements if needed later
    this.backToBookingBtn = page.locator('button.PaymentConfirmation__secondary');
  }

  /**
   * Waits for user to reach the cancellation confirmation URL.
   * This does NOT assert text and avoids full load-state delays.
   */
  async waitForCancelBookingConfirmationPage() {
    console.log('⏳ Waiting for cancellation confirmation page via URL...');
    await expect(this.page).toHaveURL(/\/wrcancelbooking$/, { timeout: 30000 });
    console.log('✅ Cancellation confirmation page reached.');
  }

  /**
   * Optional button click if user wants to go back
   */
  async clickBackToBookingButton() {
    await this.backToBookingBtn.click();
  }
}

module.exports = { CancelBookingConfirmationPage };
