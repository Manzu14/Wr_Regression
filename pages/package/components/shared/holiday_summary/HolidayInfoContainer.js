import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { I18nMessages } from '../../../../helpers/I18nMessages';
dayjs.extend(customParseFormat);

export class HolidayInfoContainer {
    /**
     * @param {import('@playwright/test').Locator} wrapper
     * @param {import('@playwright/test').Page} page
     */
    constructor(wrapper, page) {
        this.page = page;
        this.wrapper = wrapper;
        this.holidayInfoLines = wrapper.locator('li.HolidaySummaryWithPhoto__line');
    }

    get duration() {
        return this.holidayInfoLines.nth(0);
    }

    get passangers() {
        return this.holidayInfoLines.nth(1);
    }

    get board() {
        return this.holidayInfoLines.nth(2);
    }

    get room() {
        return this.holidayInfoLines.nth(3);
    }

    get flight() {
        return this.holidayInfoLines.nth(4);
    }

    /**
     * @return {Promise<import('@playwright/test').Locator>}
     */
    async getExtrasLocator() {
        const { ExtraOption, ExtraOptions } = await new I18nMessages().extractI18nMessages(this.page);
        return this.wrapper.locator(`xpath=//*[contains(text(), "${ExtraOption}") or contains(text(), "${ExtraOptions}")]`);
    }

    /**
     * @return {Promise<{returnDate: dayjs.Dayjs, arrivalDate: dayjs.Dayjs}>}
     */
    async getTravelDates() {
        const locale = await new I18nMessages().getPageLanguage(this.page);
        require(`dayjs/locale/${locale}`);
        dayjs.locale(locale);
        const durationFullText = await this.duration.textContent();
        const [arrivalText, durationText] = durationFullText.split(' - ');
        const arrivalDate = dayjs(arrivalText.replaceAll('.', ''), 'dd DD MMM YYYY');
        const match = /^(\d+)\s+\S+/.exec(durationText)[1];
        const durationDays = parseInt(match, 10);
        const returnDate = arrivalDate.add(durationDays - 1, 'day');
        return { arrivalDate, returnDate };
    }
}
