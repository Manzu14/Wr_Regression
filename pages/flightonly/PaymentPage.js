import { FlightOnlyConfirmBookingPage } from './ConfirmBookingPage';
import { isNL } from '../../config/test_config';
import { expect } from '@playwright/test';

export class FlightOnlyPaymentPage {
    /** @param {import('playwright').Page} page - The Playwright page object.*/
    constructor(page) {
        this.page = page;
        this.cashPayment = page.locator('span.UI__cardLabel');
        this.skipPaymentBtn = page.locator('//a[contains(@href ,"book/confirm/booking")]');
        this.mainPriceValue = page.locator('(//div[@class="UI__paymentRow"]//div[@class=" UI__paymentColEnd"])[2]');
        this.cashPayerInputBox = page.locator('input[name="payerName"]');
        this.paymentAmtInputBox = page.locator('input[name="paymentAmt"]');
        this.addpayment = page.locator('//span[@class="UI__addPayment"]//button');
        this.continue = page.locator('div[class="UI__continue"] > button');
        this.flightOnlyConfirmBookingPage = new FlightOnlyConfirmBookingPage(page);
    }

    /**
     * Verify payment options like cash, card etc
     * @param {number} index on element
     * @param {string} paymentType cash, card
     */
    async verifyPaymentOptions(index, paymentType) {
        await this.cashPayment.nth(index).waitFor({ state: 'visible', timeout: 60_000 });
        await this.cashPayment.nth(index).hover();
        const textContent = await this.cashPayment.nth(index).textContent();
        expect(textContent).toContain(paymentType);
    }

    /**
     * @return {Promise<FlightOnlyConfirmBookingPage>}
     */
    async skipPayment() {
        await expect(this.skipPaymentBtn).toBeVisible();
        await this.skipPaymentBtn.click();
        return new FlightOnlyConfirmBookingPage(this.page);
    }

    async verifyPaymentMethods() {
        await this.verifyPaymentOptions(0, 'Cash');
        await this.verifyPaymentOptions(1, 'Transfer Payment');
        if (isNL()) {
            await this.verifyPaymentOptions(2, 'TUI Paper voucher');
        } else {
            await this.verifyPaymentOptions(2, 'Debit/Credit Card');
        }
    }

    async selectPaymentmethod(index, paymentMode = 'cash', priceText = '100') {
        await this.mainPriceValue.waitFor({ state: 'visible', timeout: 60_000 });
        const price = await this.mainPriceValue.textContent();
        await this.cashPayment.nth(index).hover();
        await this.cashPayment.nth(index).click();
        await this.cashPayerInputBox.fill(paymentMode);
        await this.paymentAmtInputBox.fill(priceText);
        await this.addpayment.click();
        await expect(this.mainPriceValue).not.toHaveText(price, { timeout: 60_000 });
        await this.continue.click();
        return new FlightOnlyConfirmBookingPage(this.page);
    }
}
