import { PassengerDetailsPage } from '../package/PassengerDetailsPage';

export class FlightOnlyExtraOptionsPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.flightservicepageContinuebtn = page.locator("button[aria-label='extra options continue button']");
    }

    /**
     * @return {Promise<PassengerDetailsPage>}
     */
    async flightServiceClickContinue() {
        await this.flightservicepageContinuebtn.waitFor({ state: 'visible' });
        await this.flightservicepageContinuebtn.click();
        return new PassengerDetailsPage(this.page);
    }
}
