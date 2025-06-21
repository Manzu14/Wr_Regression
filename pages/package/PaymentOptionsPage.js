import { isInhouse } from '../../config/test_config';
const { expect } = require('@playwright/test');
const pr = require('promise');

export class PaymentOptionsPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.payerNameInputTextBox = page.locator('//input[@name="payerName"]');
        this.amountTobePaidInputTextBox = page.locator('//input[@name="paymentAmt"]');
        this.addPaymentButton = page.locator('.UI__addPayment  button');
        this.continueButton = page.locator('.UI__continue button');
        this.skipPayment = page.locator('#paymentOptionsbutton__component .UI__skipPaymentsWrapper');
        this.displayedTotalPrice = page.locator('#paymentForm .DepositComponentOption__depositPrice');
        this.textPaymentTransfer = page.locator(
            '#paymentForm > div.UI__paymentType > ul > li:nth-child(2) > span > label > span.inputs__text.inputs__alignmiddle > span',
        );
        this.selectTransferPayment = page.locator(
            '#paymentForm > div.UI__paymentType > ul > li:nth-child(2) > span > label > span.inputs__circle.inputs__alignmiddle',
        );
        this.inputTransfer = page.locator('#transferAmount');
        this.selectCashPayment = page.locator(
            '#paymentForm > div.UI__paymentType > ul > li:nth-child(1) > span > label > span.inputs__circle.inputs__alignmiddle',
        );
        this.bookingNumberToTransfer = page.locator('#transferBookingReference');
        this.confirmBookTransferButton = page.locator('.UI__bookingReferenceNumberForm button');
        this.reservationNumberInTransfer = page.locator('.UI__bookingRefList > li:nth-child(1) > span:nth-child(2) > .UI__bookingRefItemText');
        this.amountToBeTransferred = page.locator('.UI__bookingRefList > li:nth-child(4) > span:nth-child(2) > span.UI__bookingRefItemText');
        this.totalAmountToBePaid = page.locator('li[class="PriceSummaryPanel__title"] span');
        this.payLaterOption = page.locator(
            '#paymentForm div:nth-child(1) > div:nth-child(1) > div > div.DepositComponentOption__depositOption > label > span.inputs__circle.inputs__alignmiddle',
        );
        this.selectPayAllOption = page.locator('label').filter({ hasText: 'Betaal alles' }).locator('span').first();
        this.totalAmountSummaryInfo = page.locator(
            '#holidaySummary__component  div:nth-child(4) > ul.PriceSummaryPanel__totalPriceWrapper > li.PriceSummaryPanel__title',
        );
        this.numberOfPaymentForms = page.locator('#paymentForm .DepositComponent__DepositComponent');
        this.selectCardPayment = page.locator(
            '#paymentForm > div.UI__paymentType > ul > li:nth-child(3) > span > label > span.inputs__circle.inputs__alignmiddle',
        );
        this.paymentSummary = page.locator('#paymentForm > div.UI__background > div:nth-child(1) > div.UI__paymentColStart');
    }

    async getFullAmountToBePaid() {
        return parseFloat((await this.totalAmountToBePaid.textContent()).replace('€', ''));
    }

    async enterCurrencyDetails(payerName = 'MrAllen', amountToBePaid = '250') {
        await expect(this.payerNameInputTextBox).toBeVisible({ timeout: 90_000 });
        await this.payerNameInputTextBox.fill(payerName);
        await this.amountTobePaidInputTextBox.fill(amountToBePaid);
        await this.addPaymentButton.click();
    }

    async clickContinueButton() {
        await this.continueButton.click();
    }

    async clickSkipPaymentLink() {
        await expect(this.skipPayment).toBeVisible({ timeout: 90_000 });
    
        // Handle navigation triggered by click
        await Promise.all([
            this.page.waitForURL(/managepaymentconfirm/, { timeout: 90_000 }),
            this.skipPayment.click()
        ]);
    }
    

    async enterPaymentDetails() {
        await expect(this.totalAmountSummaryInfo).toBeVisible({ timeout: 90_000 });
        if (isInhouse()) {
            await this.enterCurrencyDetails();
            await this.clickContinueButton();
        }
    }

    async enterPayInFullDetails(payerName = 'MrAllen') {
        await expect(this.totalAmountSummaryInfo).toBeVisible({ timeout: 90_000 });
        if (isInhouse()) {
            await expect(this.selectPayAllOption).toBeVisible({ timeout: 60_000 });
            await this.selectPayAllOption.click();
            const fullAmountToBePaid = await this.getFullAmountToBePaid();
            await this.payerNameInputTextBox.fill(payerName);
            if (fullAmountToBePaid >= 3000) {
                await this.amountTobePaidInputTextBox.fill('3000');
            } else {
                await this.amountTobePaidInputTextBox.fill(fullAmountToBePaid.toString());
            }

            await this.addPaymentButton.click();
            await expect(this.continueButton).toBeEnabled();
            await this.clickContinueButton();
        }
    }

    async enterTransferPaymentDetails(bookingNumber) {
        if (isInhouse()) {
            await expect(this.payerNameInputTextBox).toBeVisible({ timeout: 90_000 });
            await this.textPaymentTransfer.scrollIntoViewIfNeeded();
            await this.selectTransferPayment.click();
            await this.bookingNumberToTransfer.fill(bookingNumber);
            await this.confirmBookTransferButton.click();
            await new pr(resolve => setTimeout(resolve, 30_000));
            await this.confirmBookTransferButton.click();
            await expect(this.reservationNumberInTransfer).toBeVisible({ timeout: 40_000 });
            await expect(this.reservationNumberInTransfer).toHaveText(bookingNumber);
            const getTransferAmount = await this.amountToBeTransferred.textContent();
            const actualDifferenceValue = parseFloat(getTransferAmount.replace('€', ''));
            await this.inputTransfer.fill(actualDifferenceValue.toString());
            await this.paymentSummary.click();
            await expect(this.addPaymentButton).toBeEnabled();
            await this.addPaymentButton.click();
            await expect(this.continueButton).toBeEnabled();
            await this.continueButton.click();
        }
    }
}
