
const { expect } = require('@playwright/test');
export class ManagePaymentConfirm {
    /**
     * Creates an instance of ManagePaymentConfirm.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.successMessage = this.page.locator('.PaymentConfirmation__sectionHeading');;
        this.thankYouMessage = this.page.locator('.PaymentConfirmation__mB10');

    }
}