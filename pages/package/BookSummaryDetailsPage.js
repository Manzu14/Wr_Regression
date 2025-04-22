import { DetailedPriceBreakdownPage } from './DetailedPriceBreakdownPage';
import { PassengerDetailsPage } from './PassengerDetailsPage';

export class BookSummaryDetailsPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.bookNowButton = page.locator('.ProgressbarNavigation__summaryButton button');
        this.atPassengerDetails = page.locator('.ProgressbarNavigation__completed').locator('a[aria-label="PASSENGER_DETAILS"]');
        this.viewPricingDetailsHyperlink = page.locator('.PriceDiscountBreakDownV2__detailedPriceBreakdownPageLink');
        this.totalPrice = page.locator('(//span[@class="Price__priceContainer PriceDiscountBreakDownV2__price"])[2]');
    }

    /**
     * @return {Promise<PassengerDetailsPage>}
     * This Method is used to click BookNow button in Book Summary details page
     */
    async clickBookNowButton() {
        await this.bookNowButton.click();
        await this.atPassengerDetails.waitFor({ state: 'visible', timeout: 60_000 });
        return new PassengerDetailsPage(this.page);
    }

    async validatePricingDetails() {
        await this.page.mouse.wheel(0, 15000);
        if (await this.viewPricingDetailsHyperlink.isVisible({ timeout: 40_000 })) {
            await this.viewPricingDetailsHyperlink.click();
        }
        return new DetailedPriceBreakdownPage(this.page);
    }

    async getbookingTotalPrice() {
        await this.page.mouse.wheel(0, 15000);
        let bookingTotalPrice;
        if (await this.totalPrice.isVisible({ timeout: 40_000 })) {
            bookingTotalPrice = await this.totalPrice.textContent();
        }
        return bookingTotalPrice;
    }
}
