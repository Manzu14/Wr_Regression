export class ReviewAndConfirm {
    constructor(page) {
        this.page = page;
        this.confirmChanges = this.page.locator('.ActionBtns__getSearchButtonConfirm');
        this.reviewAndConfirm = this.page.locator('.UI__reviewAndConfirmValidation');
    }

    async reviewandconfirmButton() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.locator('#ReviewConfirmActionBtn__component button:nth-child(2)').scrollIntoViewIfNeeded();
        return await this.page.locator('#ReviewConfirmActionBtn__component button:nth-child(2)').isVisible();
    }

    getCurrentUrl() {
        return this.page.url();
    }
}
