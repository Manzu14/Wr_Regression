import { expect } from '@playwright/test';
import { FlightOnlySelectFlightPage } from './SelectFlightPage';

export class FlightOnlySearchResultPage {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.searchFlightList = page.locator('div.FlightCardsList__flightCardsList > div.Selectable__selectableCard.FlightCard__flightCard').last();
        this.outboundFlight = page.locator('((//div[@class="carousel__frame "])[1]//div[@class="DataCarouselItem__dateCarouselItem"])[1]');
        this.returnFlight = page.locator('((//div[@class="carousel__frame "])[2]//div[@class="DataCarouselItem__dateCarouselItem"])[1]');
    }

    /**
     * @return {Promise<FlightOnlySelectFlightPage>}
     */
    async checkFlightSearchResult() {
        await this.returnFlight.waitFor({ state: 'visible' });
        await this.outboundFlight.click();
        await this.returnFlight.click();
        await expect(this.searchFlightList).toBeVisible();
        return new FlightOnlySelectFlightPage(this.page);
    }
}
