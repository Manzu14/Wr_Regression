export class HotelInfoContainer {
    /**
     * @param {import('@playwright/test').Locator} wrapper
     */
    constructor(wrapper) {
        this.wrapper = wrapper;
    }

    get hotelName() {
        return this.wrapper.locator('div.HolidaySummaryWithPhoto__hotelName');
    }

    get hotelLocation() {
        return this.wrapper.locator('div.HolidaySummaryWithPhoto__location');
    }

    get hotelRating() {
        return this.wrapper.locator('div.HolidaySummaryWithPhoto__rating').locator('span.ratings__rating');
    }
}
