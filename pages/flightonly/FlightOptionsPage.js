import { PassengerDetailsPage } from '../../pages/package/PassengerDetailsPage';
import { FlightOnlyExtraOptionsPage } from './ExtraOptionsPage';

export class FlightOnlyFlightOptionsPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.flightservicepageContinuebtn = page.locator("button[aria-label='extra options continue button']");
        this.servicebundlelist = page.locator('main > div > div > div.serviceWrapper___Vxa0S > div:nth-child(2) > div > div > div').last();
        this.passengerDetailsPage = new PassengerDetailsPage(page);
    }

    /**
     * @return {Promise<FlightOnlyExtraOptionsPage>}
     */
    async flightOptionPageClickContinue() {
        await this.servicebundlelist.waitFor({ state: 'visible' });
        await this.flightservicepageContinuebtn.click();
        return new FlightOnlyExtraOptionsPage(this.page);
    }
}
