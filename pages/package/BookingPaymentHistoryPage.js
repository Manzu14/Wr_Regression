const { expect } = require('@playwright/test');

export class BookingPaymentHistoryPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.manageReservation = page.locator('#DirectDebit__component a[href*="/retail/travel/"]');
        this.paymentHistoryLink = page.getByLabel('payment_history');
        this.allPaymentHistoryHeaders = page.locator('.TableHeaderCell__tableHeaderCell');
        this.paymentHistoryTable = page.locator('.UI__paymentHistoryTable');
        this.bookingReferenceEntry = page.locator('#paymentHistory__component td[arialabel="payment history payment reference"]');
        this.paymentHistoryAmount = page.locator('#paymentHistory__component td[arialabel="payment history amount"]');
        this.makePaymendAdjustmentLink = page.locator('.HighlightedLink__underlined');
        this.paymentAdjustmentAmountBlock = page.locator('.Components__amountBlock');
        this.paymentAdjustmentPaymentBlock = page.locator('.Components__cardPaymentDetails');
        this.paymentAdjustmentCancelButton = page.locator('.Modal__cancelLink');
        this.paymentAdjustmentConfirmButton = page.locator('.Modal__applyButton.Components__applyClassName');
        this.remarkLink = page.locator('.UI__iconEnabled');
        this.agentInRemarkInformation = page.locator('#paymentHistory__component tr:nth-child(2) > td > div:nth-child(2) > span:nth-child(2)');
    }

    async openBookingPaymentHistoryPage() {
        await this.manageReservation.click();
        await expect(this.paymentHistoryLink).toBeVisible({ timeout: 60000 });
        await this.paymentHistoryLink.click();
        await expect(this.paymentHistoryTable).toBeVisible({ timeout: 60000 });
    }
}
