const { ManageBookingPage } = require('../../pages/package/ManageBookingPage');

export class ConfirmBookingPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.bookingReferenceId = page.locator('//span[@class=" BookingReference__referenceID"]');
        this.manageBookingCTA = page.locator('#paymentDetails__component > section > form > button');
        this.nextCustomerBTN = page.locator('.PaymentDetails__nextCustomer > button');
    }

    /**
     * @type{import('playwright').Locator}
     * This Method is used to click the Further button in Accomadation details page
     * @returns {Promise<{bookingRefernceNumber: string, manageBookingPage: ManageBookingPage}>}
     */
    async getBookingReferenceId() {
        await this.page.waitForLoadState('load');
        await this.bookingReferenceId.waitFor({ state: 'visible', timeout: 90_000 });
        const bookingRefernceNumber = await this.bookingReferenceId.textContent();
        const manageBookingPage = new ManageBookingPage(this.page);
        return { bookingRefernceNumber, manageBookingPage };
    }

    async goToManageReservation() {
        await this.manageBookingCTA.click();
        await this.page.waitForLoadState('load');
    }

    async clickNextCustomerBTN() {
        await this.nextCustomerBTN.waitFor({ state: 'visible', timeout: 60_000 });
        await this.nextCustomerBTN.click();
    }
}
