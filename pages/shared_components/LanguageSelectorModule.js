export class LanguageSelectorModule {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.languageDropdown = page.locator('div.SelectDropdown__selectbox');
        this.applyBtn = page.locator('button.Modal__applyButton');
    }

    async selectLanguage(language) {
        await this.languageDropdown.click();
        await this.page.locator(`//li[normalize-space()="${language}"]`).click();
    }

    async applySelection() {
        await this.applyBtn.click();
    }
}
