import { isVip } from '../../../../config/test_config';

/**
 * Component for handling departure date selection in the search panel
 */
export class DepartureDateComponent {
    MIN_AVAILABLE_DATES = 20;

    /**
     * @param {import("playwright").Page} page
     */
    constructor(page) {
        this.page = page;
        this.departureDateInput = page.getByTestId('departureDateInput');
        this.resetButton = this.departureDateInput.getByRole('button', { name: 'Reset' });
        this.calendarNextMonthNavigation = page.locator('span[class="chevron right icon xsmall"]');
        this.saveDropDownButton = page.locator('button[class="button primary medium"]');
        this.availableCalendarDates = page.locator('.day.current.sheet.legecyDate.SelectLegacyDate__available');
        this.allFlexOptions = this.page.locator('ul.flexibleOptions');
        this.namedFlexOption = flexibilityOption =>
            this.allFlexOptions.locator('li').filter({ has: this.page.locator(`[value="${flexibilityOption.toString()}"]`) });
    }

    /**
     * Selects a date with flexibility option
     * @param {number} flexibilityOption - The flexibility option (e.g. '+/- 14 dagen')
     */
    async selectDate(flexibilityOption) {
        await this.resetButton.click();
        await this.allFlexOptions.waitFor({ state: 'visible' });
        await this.namedFlexOption(flexibilityOption).click();
        await this.selectDepartureInFuture();
    }

    async selectAvailableDate() {
        const availableDepartingDates = await this.availableCalendarDates.all();
        const totalAvailableDepartingCount = availableDepartingDates.length;
        let randomDepartingIndex = Math.floor(Math.random() * totalAvailableDepartingCount);
        if (isVip()) {
            //these clicks are just for 3rd party vip and it's to select a date for at least january next year
            for (let i = 1; i <= 6; i++) {
                await this.calendarNextMonthNavigation.click();
            }
        }
        if (totalAvailableDepartingCount < this.MIN_AVAILABLE_DATES) {
            await this.calendarNextMonthNavigation.click();
            randomDepartingIndex = Math.floor(Math.random() * totalAvailableDepartingCount);
            await availableDepartingDates[randomDepartingIndex].click();
        } else {
            await availableDepartingDates[randomDepartingIndex].click();
        }
        await this.saveDropDownButton.click();
    }

    async selectDepartureInFuture() {
        for (let i = 1; i <= 2; i++) {
            await this.calendarNextMonthNavigation.click();
        }
        await this.selectAvailableDate();
    }
}
