const { expect } = require('@playwright/test');
import { ManageBookingReviewchangePage } from './../../ManageBookingReviewchangePage';

export class MmbPriceDetailSection {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.totalPrice = page.locator('.UI__priceDetailsSection .UI__total .UI__price');
        this.agentInformationLink = page.locator('.UI__agentInfoChevronSection span a');
        this.typeOfCostsComponent = page.locator('.UI__feesReason');
        this.changeCostDropdownList = page.locator('.UI__feesReason .inputs__select select');
        this.amountTextInputField = page.locator('[name="AmountInputField"]');
        this.notesTextInputField = page.locator('.UI__textarea');
        this.saveButton = page.locator('.UI__applyFees button');
        this.priceDetailSectionTable = page.locator('.UI__priceDetailsSection');
    }

    async expandInformationAgentLink() {
        await this.agentInformationLink.click();
    }

    async getTotalTravelSum() {
        const travelSum = await this.totalPrice.textContent();
        const totalTravelSum = travelSum.replace('€', '');
        return totalTravelSum;
    }

    async addAgentFees(expectedFees = '300.00', feeNotes = 'adding 300 fee for package booking') {
        await expect(this.typeOfCostsComponent).toBeVisible({ timeout: 40_000 });
        await this.changeCostDropdownList.selectOption({ index: 1 });
        await this.amountTextInputField.fill(expectedFees);
        await this.notesTextInputField.fill(feeNotes);
        await this.saveButton.click();
        const manageBookingReviewchangePage = new ManageBookingReviewchangePage(this.page);
        return { expectedFees, manageBookingReviewchangePage };
    }
}
