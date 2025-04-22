export class DetailedPriceBreakdownPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.totalPriceLabelText = page.locator('.PriceDiscountBreakDownV2__tpDescription');
        this.totalPriceValue = page.locator('//div[@class="TotalPrice__total"]//span');
        this.priceDetailsText = page.locator('.sectionWrapper.clearFix');
    }

    async getTotalPriceInPriceBreakDownPage() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.keyboard.down('End');
        let actualBookingTotalPrice;
        if (await this.totalPriceValue.isVisible({ timeout: 40_000 })) {
            actualBookingTotalPrice = await this.totalPriceValue.textContent();
        }
        return actualBookingTotalPrice;
    }
}
