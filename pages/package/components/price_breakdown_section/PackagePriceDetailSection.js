const { expect } = require('@playwright/test');
import { PassengerDetailsPage } from './../../PassengerDetailsPage';
export class PackagePriceDetailSection {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.priceBreakDownChevron = page.locator('.UI__PriceBreakDownChevronSection svg');
        this.totalPrice = page.locator('.UI__priceDetailsSection .UI__total .UI__price');
        this.agentInfoChevron = page.locator('.UI__agentInfoChevronSection span a');
        this.agentInfoLink = page.locator('.HighlightedLink__highlightedLink.HighlightedLink__primaryCta');
        this.feesReasonDropdown = page.locator('.UI__feesReason');
        this.feeDropDownField = page.locator('.UI__feesReason .inputs__select > span:nth-child(1)');
        this.discountDropDownField = page.locator('.UI__discountReason .inputs__select > span:nth-child(1)');
        this.changeCostDropdownList = page.locator('.UI__feesReason .inputs__select select');
        this.discountDropdownList = page.locator('.UI__discountReason .inputs__select select');
        this.amountTextInputField = page.locator('[name="AmountInputField"]');
        this.notesTextInputField = page.locator('.UI__textarea');
        this.saveButton = page.locator('.UI__feesButtonSection button');
        this.saveDiscountButton = page.locator('.UI__discountButtonSection button');
        this.priceDetailSectionTable = page.locator('.UI__priceDetailsSection');
        this.addFeesLink = page.locator('.UI__addFees a');
        this.addDiscountTab = page.locator('.UI__navigationTab a');
        this.feeCountErrorMessage = page.locator('.UI__feesButtonSection .UI__errorMessageColor');
        this.priceDisplayed = page.locator('li[class="PriceSummaryPanel__title"] span');
    }

    async expandAgentInfoChevron() {
        await this.priceBreakDownChevron.click();
        await expect(this.totalPrice).not.toHaveText('€ 0.00', { timeout: 60_000 });
        await this.agentInfoLink.click();
        await this.feeDropDownField.waitFor({ state: 'visible', timeout: 180_000 });
    }

    async errorMessageFEE() {
        await this.addFeesLink.click();
        await this.page.locator('.UI__feesSectionContent').nth(0).isVisible();
        await this.addFeesLink.click();
        await this.page.locator('.UI__feesSectionContent').nth(1).isVisible();
        return this.feeCountErrorMessage.textContent();
    }

    async addAgentFees(expectedFees = '300.00', feeNotes = 'adding 300 fee for package booking') {
        await this.feeDropDownField.waitFor({ state: 'visible', timeout: 60_000 });
        await this.changeCostDropdownList.selectOption({ index: 1 });
        await this.amountTextInputField.fill(expectedFees);
        await this.notesTextInputField.fill(feeNotes);
        await this.saveButton.click();
        return expectedFees;
    }

    async addAgentDiscount(expectedDiscount = '600.00', discountNotes = 'adding 300 discount for package booking') {
        await this.addDiscountTab.nth(1).click();
        await this.discountDropDownField.waitFor({ state: 'visible', timeout: 60_000 });
        await this.discountDropdownList.selectOption({ index: 1 });
        await this.amountTextInputField.fill(expectedDiscount);
        await this.notesTextInputField.fill(discountNotes);
        await this.saveDiscountButton.click();
        return expectedDiscount;
    }

    async calculatePriceAfterFeesAndDiscounts() {
        const passengerDetails = new PassengerDetailsPage(this.page);
        const initalPrice = parseFloat((await this.totalPrice.textContent()).substring(1));
        const totalFees = parseFloat(await this.addAgentFees());
        const totalDiscounts = parseFloat(await this.addAgentDiscount());
        const priceBreakDown = initalPrice + totalFees - totalDiscounts;
        await passengerDetails.page.reload();
        await passengerDetails.agreeToAllConditions();
        return priceBreakDown;
    }
}
