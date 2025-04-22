import { FlightOnlyFlightOptionsPage } from './FlightOptionsPage';

export class FlightOnlySelectFlightPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.selectFlight = page.locator("div[class='FlightInformation__selectionStatus']>button");
        this.selectReturnFlight = page.locator("(//h2[@class='Outbound__title']/..//div[@class='FlightInformation__selectionStatus']//button)[last()]");
        this.continueButton = page.locator("button[class='buttons__button buttons__primary buttons__fill ContinueButton__continueButton']");
        this.flightservicepage = page.locator("div[data-theme='tui-light']");
    }

    /**
     * @return {Promise<FlightOnlyFlightOptionsPage>}
     */
    async selectFlightOptions() {
        await this.selectReturnFlight.waitFor();
        await this.selectFlight.first().click();
        await this.selectReturnFlight.last().click();
        await this.continueButton.click();
        const ele = this.flightservicepage.first();
        await ele.waitFor({ state: 'visible' });
        return new FlightOnlyFlightOptionsPage(this.page);
    }
}
