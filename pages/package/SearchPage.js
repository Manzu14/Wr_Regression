import { SearchResultPage } from './SearchResultPage';
import { DepartureAirportComponent } from './components/search/DepartureAirportComponent';
import { DestinationComponent } from './components/search/DestinationComponent';
import { DepartureDateComponent } from './components/search/DepartureDateComponent';
import { SearchResultComponent } from './components/search/SearchResultComponent';

export class SearchPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.searchPanel = page.locator('.search-panel-main');

        this.departureAirport = new DepartureAirportComponent(page);
        this.destination = new DestinationComponent(page);
        this.departureDate = new DepartureDateComponent(page);
        this.searchResult = new SearchResultComponent(page);
    }

    async doSearch(searchParams) {
        if (!searchParams || typeof searchParams !== 'object') {
            throw new Error(`Invalid searchParams: ${JSON.stringify(searchParams, null, 4)}`);
        }
        await this.departureAirport.selectAirports(searchParams.airportsOptions);
        await this.destination.selectDestination(searchParams.destinationOptions);
        await this.departureDate.selectDate(searchParams.departureOptions.flexOptions);
        await this.searchResult.clickSearch();
        return new SearchResultPage(this.page);
    }
}
