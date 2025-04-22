export class PreviousReconcillationPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.previousProcessingComp = page.locator('.container.mt-sm');
        this.backtoPaymentProcessingLink = page.locator('#recon-payments-link');
        this.SearchButton = page.locator('#search-button');
        this.alert = page.locator('.alert.alert-error.mt-4xs.mb-2xs.flex-wrap');
        this.alertText = page.locator('.alert-text');
        this.saveButtonOnCalender = page.locator('#done-btn');
        this.fromDateInputField = page.locator('#from-input-field');
        this.monthSelectDropDown = page.locator('#month-select');
        this.activeDates = page.locator('time[class="sheet day"]');
        this.toDateInputField = page.locator('#to-input-field');
        this.reconcilePaymentTable = page.locator('table[data-testid="reconcile-payment-table"]');
    }

    async clickBackToPaymentProcessing() {
        await this.backtoPaymentProcessingLink.click();
    }

    async selectActiveDateInCalender(date) {
        await this.monthSelectDropDown.click();
        await this.monthSelectDropDown.selectOption(date);
        const allActiveDates = await this.activeDates.all();
        const totalListOfActiveDatesCount = allActiveDates.length;
        const randomCount = Math.floor(Math.random() * totalListOfActiveDatesCount);
        await allActiveDates[randomCount].click();
        await this.saveButtonOnCalender.click();
    }
}
