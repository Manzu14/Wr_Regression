const { expect } = require('@playwright/test');
export class PackageInsurance {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.insuranceTypeSelectButton = page.locator('.InsuranceType__selectButton');
        this.insuranceHeader = page.locator('.InsuranceHeader__title');
        this.getQuotePassengerCheckbox = page.locator('.GetQuoteV2__getQuoteForm .GetQuoteV2__passenger .inputs__checkBox .inputs__box');
        this.getQuotePassenger = page.locator('.GetQuoteV2__passenger');
        this.savePaxDOB = page.locator('.GetQuoteV2__button');
        this.insuranceTypeaccordion = page.locator('.InsuranceType__collapsibleIcon');
        this.selectinsuranceCheckbox = page.locator('.PerPersonSelectList__checkedIcon');
        this.reviewInsurance = page.locator('.ReviewInsurancePricesButtons__button');
        this.confirmInsuranceButton = page.locator('.Modal__applyButton');
    }

    async insuranceSelectButton() {
        await this.insuranceTypeSelectButton.click();
        await expect(this.insuranceHeader).toBeVisible({ timeout: 120_000 });
    }

    async selectPassenger() {
        const count = await this.getQuotePassengerCheckbox.count();
        for (let i = 0; i < count; i++) {
            await this.getQuotePassengerCheckbox.nth(i).click();
        }
    }

    /**
     * Method to enter Date of Birth (DOB) for adults in Playwright.
     * @param {import('@playwright/test').Page} page - The Playwright page instance.
     * @returns {Promise<void>}
     */
    async enterAdultDOB() {
        const DEFAULT_YEAR = '1980';
        const DEFAULT_MONTH = '01';
        const DEFAULT_DAY = '01';

        const yearFields = this.page.locator('input[aria-label="year"]');
        const monthFields = this.page.locator('input[aria-label="month"]');
        const dayFields = this.page.locator('input[aria-label="day"]');
        const totalFields = await yearFields.count();

        if (totalFields === 0) {
            throw new Error('No "year" fields found');
        }

        for (let i = 0; i < totalFields; i++) {
            const yearField = yearFields.nth(i);
            const monthField = monthFields.nth(i);
            const dayField = dayFields.nth(i);
            const currentValue = await yearField.inputValue();

            if (!currentValue) {
                await yearField.fill(DEFAULT_YEAR);
                await monthField.fill(DEFAULT_MONTH);
                await dayField.fill(DEFAULT_DAY);
            }
        }
    }

    async savePassengerDOB() {
        await this.savePaxDOB.click({ timeout: 60_000 });
    }

    async insuranceType() {
        await this.insuranceTypeaccordion.first().click();
        await this.page.waitForLoadState('load');
    }

    async selectInsurance() {
        await expect(this.selectinsuranceCheckbox).not.toHaveCount(0);
        for (let i = 0; i < 2; i++) {
            const checkbox = this.selectinsuranceCheckbox.nth(i);
            await checkbox.click();
        }
    }

    async reviewInsuranceCTA() {
        await this.reviewInsurance.click();
        await this.page.waitForLoadState('load');
    }

    async confirmInsurance() {
        await this.confirmInsuranceButton.click();
        await this.page.waitForLoadState('load');
    }

    async selectInsured() {
        await this.insuranceSelectButton();
        await this.selectPassenger();
        await this.enterAdultDOB();
        await this.savePassengerDOB();
        await this.insuranceType();
        await this.selectInsurance();
        await this.reviewInsuranceCTA();
        await this.confirmInsurance();
    }
}
