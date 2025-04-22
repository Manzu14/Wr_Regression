export class BookingSearchPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.manageReservation = page.locator('.LinkItem__utilityNavLink');
        this.retrieveWithoutRefTab = page.locator('#retrieve-without-ref-tab');
        this.startDate = page.locator('#startDate');
        this.previousButton = page.locator('#select-month-prev-btn');
        this.previousCalenderDate = page.locator('.calendar .day.sheet');
        this.closeButton = page.locator('#close-btn');
        this.searchButton = page.locator('#search-btn');
        this.bookingReferenceLink = page.locator('.button-link');
        this.MmbBookingReference = page.locator('.UI__Bookingref a');
    }

    async retrieveWithoutBookingRefTab() {
        await this.retrieveWithoutRefTab.click();
    }

    async searchWithDate() {
        await this.startDate.click();
        await this.previousButton.click();
        await this.previousButton.click();
        await this.previousCalenderDate.first().click();
        await this.closeButton.click();
        await this.searchButton.click();
    }

    async retrieveBooking() {
        await this.bookingReferenceLink.first().click();
    }
}
