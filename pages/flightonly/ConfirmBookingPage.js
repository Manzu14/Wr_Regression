import { FlightOnlyManageBookingPage } from './ManageBookingPage';

export class FlightOnlyConfirmBookingPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.bookingReferenceId = page.locator('[itemprop="booking reference"]');
        this.confirmationIcon = page.locator('#preact_root > div:nth-child(1) > div > h3 > svg').nth(0);
    }

    /**
     * @returns {Promise<{bookingRefernceNumber: string, flightOnlyManageBookingPage: FlightOnlyManageBookingPage}>}
     */
    async getBookingReferenceId() {
        await this.bookingReferenceId.waitFor({ state: 'visible' });
        await this.confirmationIcon.waitFor({ state: 'visible' });
        const bookingRefernceNumber = await this.bookingReferenceId.textContent();
        const flightOnlyManageBookingPage = new FlightOnlyManageBookingPage(this.page);
        return { bookingRefernceNumber, flightOnlyManageBookingPage };
    }
}
