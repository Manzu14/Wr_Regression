import { TestDataProvider } from '../../test-data/TestDataProvider';

export class PaymentValidationPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.carNumberTextBox = page.locator('input[id="number"]');
        this.cardHolderNameTextBox = page.locator('input[id="cardholderName"]');
        this.cardExpiryMonth = page.locator('input[id="expirationMonth"]');
        this.cardExpiryYear = page.locator('input[id="expirationYear"]');
        this.cvcCodeTextBox = page.locator('input[id="cvv"]');
        this.paymentButton = page.locator('.payment-form__payment-button input');
        this.emailTextBox = page.locator('#email');
        this.selectVisaRadioButton = page.locator(
            '#paymentForm > div.UI__paymentType > ul > li:nth-child(3) > span > label > span.inputs__circle.inputs__alignmiddle',
        );
    }

    async enterVisaCardDetails() {
        const visa = await new TestDataProvider().getPaymentData('visa');
        await this.carNumberTextBox.waitFor({ timeout: 40_000 });
        await this.carNumberTextBox.fill(visa.cardNumber);
        await this.cardHolderNameTextBox.fill(visa.cardHolderName);
        await this.cardExpiryMonth.fill(visa.cardExpiryMonth);
        await this.cardExpiryYear.fill(visa.cardExpirYear);
        await this.cvcCodeTextBox.fill(visa.cvcCode);
        await this.emailTextBox.fill(visa.email);
    }

    async clickOnPaymentButton() {
        await this.paymentButton.click();
    }
}
