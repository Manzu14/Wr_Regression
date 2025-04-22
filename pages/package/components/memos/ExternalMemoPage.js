const { expect } = require('@playwright/test');
export class ExternalMemoPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.viewExternalMemoButton = page.locator('.ExternalMemoLanding__centerBtn button');
        this.createExternalMemoHeader = page.locator('.MemoHeading__externalHeader');
        this.preferenceRadioButton = page.locator('//input[@name="PR"]//following-sibling::span[@class="inputs__circle inputs__alignmiddle"]');
        this.allSelectDropDowns = page.locator('//div[@class="CreateMemo__memoField"]//select');
        this.createNewExternalMemoButton = page.locator('.MemoHeading__createMemoBtn button');
        this.notesTextBox = page.locator('.CreateMemo__memoNote div textarea');
        this.sendMemoButton = page.locator('div.CreateMemo__memoButton').locator('button.buttons__primary');
        this.memoCard = page.locator('.MemoCard__dataContent');
        this.necessaryRequestRadioButton = page.locator('//input[@name="ER"]//following-sibling::span[@class="inputs__circle inputs__alignmiddle"]');
        this.assistanceRadioButton = page.locator('//input[@name="WF"]//following-sibling::span[@class="inputs__circle inputs__alignmiddle"]');
        this.programChangeRadioButton = page.locator('//input[@name="PC"]//following-sibling::span[@class="inputs__circle inputs__alignmiddle"]');
        this.deleteMemoLink = page.locator('span[class="HighlightedLink__text"]');
        this.confirmDeleteMemoButton = page.locator('//button[contains(text(),"BEVESTIGEN")]');
    }

    async addExternalMemo(memoType) {
        await this.viewExternalMemoButton.click();
        await expect(this.createExternalMemoHeader).toBeVisible({ timeout: 40_000 });
        await this.createNewExternalMemoButton.click({ timeout: 40_000 });
        await expect(this.preferenceRadioButton).toBeVisible({ timeout: 40_000 });
        const cleanMemo = await this.page.getByLabel('external_memo', { exact: true }).ariaSnapshot();
        switch (memoType) {
            case 'preference':
                await this.preferenceRadioButton.click();
                await this.allSelectDropDowns.nth(0).selectOption({ index: 1 });
                break;
            case 'necessaryRequest':
                await this.necessaryRequestRadioButton.click();
                await this.allSelectDropDowns.nth(0).selectOption({ index: 1 });
                await this.allSelectDropDowns.nth(1).selectOption({ index: 1 });
                break;
            case 'assistance':
                await this.assistanceRadioButton.click();
                await this.allSelectDropDowns.nth(0).selectOption({ index: 1 });
                await this.allSelectDropDowns.nth(1).selectOption({ index: 1 });
                break;
            case 'programChange':
                await this.programChangeRadioButton.click();
                await this.allSelectDropDowns.nth(2).selectOption({ index: 1 });
                break;
        }
        return cleanMemo;
    }

    async addExternalMemoNotes() {
        await this.notesTextBox.fill('external memo test');
    }

    async sendMemoButtonClick() {
        await this.sendMemoButton.click();
        await expect(this.createExternalMemoHeader).toBeVisible({ timeout: 60_000 });
    }

    /**
     *
     * @param memoType
     * @return {import('@playwright/test').Locator}
     */
    getAddedMemoType(memoType) {
        return this.page.locator(`//div[contains(text(),'${memoType}')]//following::div[@class="MemoCard__rowBody"]`).nth(1);
    }
}
