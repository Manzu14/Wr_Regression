import { SearchPage } from './package/SearchPage';
import { HeaderComponent } from './shared_components/HeaderComponent';
import { FlightOnlySearchPage } from './flightonly/SearchPage';
import { BookingSearchPage } from './package/BookingSearchPage';

export class HomePage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.searchPage = new SearchPage(page);
        this.flightOnlySearchPage = new FlightOnlySearchPage(page);
        this.headerComponent = new HeaderComponent(page);
        this.manageReservation = page.locator('.LinkItem__utilityNavLink');
    }

    /**
     *
     * @returns{import('playwright').Locator}
     */
    getDefaultLanguageLocator() {
        return this.page.locator('//span[@class="LanguageCountrySelector__languageText"]');
    }

    async navigateToBookingSearchPage() {
        await this.manageReservation.first().click();
        return new BookingSearchPage(this.page);
    }
}
 