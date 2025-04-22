const { AccomadationDetailsPage } = require('./AccomadationDetailsPage');
const { expect } = require('@playwright/test');

export class SearchResultPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.searchResult = page.locator('//div[@class="SearchResults__searchResultsLists"]');
        this.resultListItem = page.locator('.ResultListItemV2__packageInfoInner');
        this.packagePrice = page.locator('.ResultListItemV2__packagePrice');
        this.continueButton = this.packagePrice.locator('div.ResultsListItem__continue');
        this.hotelLocationNames = page.locator('.ResultListItemV2__GeoLocation span');
        this.flightCarrierNames = page.locator('.ResultListItemV2__shiftAirlineLogo span');
        this.accomdationAvailabilityText = page.locator('.UI__pageTitle.component');
        this.allAvailableDates = page.locator('.UI__price ');
    }

    /**
     * method opens random package from available search results
     * Random Package: randomized selection of search results packages with retries on other options without new search in case if opnned package woes do not have `.Header__accomodationSection` element.
     * @returns {Promise<AccomadationDetailsPage>} instance of BookAccommodationPage of openned valid package
     */
    async openRandomPackage() {
        let randomAccom;
        await this.resultListItem.first().waitFor();
        const usedIndexes = new Set();
        const accommodationOpennedIndicator = this.page.locator('.Header__accomodationSection');
        do {
            await this.page.keyboard.down('End');
            const totalNoOfAccom = await this.page.locator('.FilterPanelV2__holidayCounts span').textContent();
            if (totalNoOfAccom > 20) {
                await this.page.keyboard.down('End');
            }
            const listOfHotelLocations = await this.hotelLocationNames.allTextContents();
            const totalNoOfHotels = listOfHotelLocations.length;
            for (let i = 0; i < totalNoOfHotels; i++) {
                randomAccom = Math.floor(Math.random() * totalNoOfHotels);
                if (!(await this.hotelLocationNames.nth(randomAccom).textContent()).includes('Tenerife')) {
                    if (!(await this.flightCarrierNames.nth(randomAccom).textContent()).includes('Transavia')) break;
                }
            }
            usedIndexes.add(randomAccom);
            const searchUrl = this.page.url();
            const button = this.continueButton.nth(randomAccom);
            await button.click();
            await this.page.waitForLoadState('domcontentloaded');
            if (await accommodationOpennedIndicator.first().isVisible()) {
                break;
            } else {
                await this.page.goto(searchUrl);
            }
        } while (usedIndexes.size !== (await this.continueButton.count()));
        return new AccomadationDetailsPage(this.page);
    }

    async selectDatesFromSingleAccomdation() {
        await this.page.waitForLoadState('load');
        await expect(this.accomdationAvailabilityText).toBeVisible({ timeout: 40_000 });
        await expect(this.allAvailableDates.first()).toBeVisible({ timeout: 40_000 });
        const allDates = await this.allAvailableDates.all();
        const countAvailableDates = allDates.length;
        const randomDate = Math.floor(Math.random() * countAvailableDates);
        await allDates[randomDate].click();
        return new AccomadationDetailsPage(this.page);
    }
}
