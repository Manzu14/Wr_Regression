import { expect } from '@playwright/test';

export class FeesComponent {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.priceDetailsDropdown = page.locator('#thirdPartyBookingDetails__component > div > div > div > div > div > span');
        this.priceDetailPrice = page.locator('div.UI__priceDetailsSection > ul > li.UI__total > span.UI__price');
        this.feesTypeSelect = page.locator('#thirdPartyBookingDetails__component').getByLabel('Select');
        this.feesInput = page.locator('//input[@name="AmountInputField"]');
        this.feesNote = page.locator('//textarea[@class="UI__textarea"]');
        this.savePayment = page.locator('//div[@class="UI__feesButtonSection"]//button[@class="buttons__button buttons__secondary buttons__fill"]');
        this.price = page.locator("div[class='price']>span");
        this.totalFee = page.locator('(//li[@class="UI__total"])[1]');
        this.informationAgent = page.locator('div.UI__agentInfoChevronSection >span > a > span');
    }

    /** Performs a to add agent fees.
     * @param {string} feesInput - The feesInput amount.
     * @param {string} feesNote - The feesNote for note.
     */
    async addAgentfees(feesInput = '100', feesNote = 'cash') {
        const price = await this.price.textContent();
        await this.priceDetailsDropdown.hover();
        await this.priceDetailsDropdown.click();
        await expect(this.priceDetailPrice).not.toHaveText('€ 0.00', { timeout: 30_000 });
        await this.informationAgent.click();
        let count = await this.savePayment.count();
        while (count < 1) {
            await this.informationAgent.click();
            await this.totalFee.click();
            count = await this.savePayment.count();
        }
        await this.feesTypeSelect.selectOption({ index: 1 });
        await this.feesInput.fill(feesInput);
        await this.feesNote.fill(feesNote);
        await this.savePayment.click();
        await expect(this.price).not.toHaveText(price, { timeout: 30_000 });
    }
}
