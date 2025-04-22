import { HolidayInfoContainer } from './holiday_summary/HolidayInfoContainer';
import { HotelInfoContainer } from './holiday_summary/HotelInfoContainer';

export class HolidaySummaryModal {
    /**
     * @param {import('@playwright/test').Locator} wrapper
     * @param {import('@playwright/test').Page} page
     */
    constructor(wrapper, page) {
        this.wrapper = wrapper;
        this.page = page;
    }

    get hotelInfoContainer() {
        return new HotelInfoContainer(this.wrapper.locator('div.HolidaySummaryWithPhoto__accommodation'));
    }

    get holidayInfoContainer() {
        return new HolidayInfoContainer(this.wrapper.locator('div.HolidaySummaryWithPhoto__holiday'), this.page);
    }
}
