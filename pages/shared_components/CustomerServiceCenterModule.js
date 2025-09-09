import { expect } from '@playwright/test';
export class CustomerServiceCenterModule {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.wrapper = page.locator('div.SearchModal__agencySearchModal');
        this.customerServiceCenterInputTextbox = this.wrapper.locator('div[class="inputs__textInput"] input');
        this.searchBtn = this.wrapper.locator('button[class="buttons__button buttons__search buttons__fill"]');
        this.customerCenterSearchResultLink = this.wrapper.locator('a[class=" StandardLink__standardLink StandardLink__primary StandardLink__underlined "]');
    }

    async searchAgent(agentNumber) {
        await this.wrapper.waitFor({ state: 'visible' });
        await this.customerServiceCenterInputTextbox.fill(agentNumber);
        await this.searchBtn.click();
    }

    async selectAgent(agentNumber) {
        await expect(this.customerCenterSearchResultLink).toContainText(agentNumber);
        await this.customerCenterSearchResultLink.click();
        await this.wrapper.waitFor({ state: 'hidden' });
    }
}
