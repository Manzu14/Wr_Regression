import { expect } from '@playwright/test';

export class HolidayUpgradePage {
  constructor(page) {
    this.page = page;

    this.changeHolidayBtn = this.page.locator("(//div[contains(@class,'Column__col Column__col-12')]//button)[1]");
    this.continuePopupBtn = page.locator('.ChangeHolidayModal__refundButtonContainer .buttons__button.buttons__secondary.buttons__fill');
    this.searchButton = page.locator('.SearchPanel__searchPanelWrapper button.buttons__button.buttons__search');

    this.resultsCalendar = page.locator('#availDatesAndPrices__component');

    // ✅ Corrected CSS Selector for valid future dates
    this.validDateButtons = page.locator('.UI__calendar button:not([disabled]):not(.UI__day--outside)');

    this.bookNowContinueBtn = page.locator("//font[normalize-space(text())='FURTHER']");
    this.summaryContinueBtn = page.locator("(//button[@aria-label='button']//font)[2]");

    this.urls = {
      search: /changeholiday\/search/,
      results: /changeholiday\/results/,
      bookAccommodation: /bookaccommodation/,
      summary: /changeholiday\/summary/,
      review: /reviewChanges/
    };
  }

  async changeDepartureDateToLater() {
    // Step 1: Click "Vakantie wijzigen"
    await this.changeHolidayBtn.waitFor({ state: 'visible', timeout: 20000 });
    await this.changeHolidayBtn.click();

    // Step 2: Continue on modal popup
    await this.continuePopupBtn.waitFor({ state: 'visible', timeout: 30000 });
    await this.continuePopupBtn.click();

    // Step 3: Wait for and click Search
    await this.page.waitForURL(this.urls.search, { timeout: 30000 });
    await this.searchButton.waitFor({ timeout: 10000 });
    await this.searchButton.click();

    // Step 4: Wait for calendar and select a future valid date
    await this.page.waitForURL(this.urls.results, { timeout: 30000 });
    await this.resultsCalendar.waitFor({ state: 'visible', timeout: 30000 });

    await expect(this.validDateButtons.first()).toBeVisible({ timeout: 10000 });

    const count = await this.validDateButtons.count();
    let clicked = false;

    for (let i = 0; i < count; i++) {
      const btn = this.validDateButtons.nth(i);
      const text = await btn.textContent();
      const day = parseInt(text?.trim());

      if (!isNaN(day) && day > 5) {
        await btn.scrollIntoViewIfNeeded();
        await Promise.all([
          this.page.waitForURL(this.urls.bookAccommodation, { timeout: 30000 }),
          btn.click()
        ]);
        clicked = true;
        break;
      }
    }

    if (!clicked) throw new Error("No valid future date found to click.");

    // Step 5: Book accommodation page
    await this.bookNowContinueBtn.waitFor({ timeout: 10000 });
    await this.bookNowContinueBtn.click();

    // Step 6: Summary page
    await this.page.waitForURL(this.urls.summary, { timeout: 30000 });
    await this.summaryContinueBtn.waitFor({ timeout: 10000 });
    await this.summaryContinueBtn.click();

    // Step 7: Final review page
    await this.page.waitForURL(this.urls.review, { timeout: 30000 });
    expect(this.page.url()).toMatch(this.urls.review);
  }
}
