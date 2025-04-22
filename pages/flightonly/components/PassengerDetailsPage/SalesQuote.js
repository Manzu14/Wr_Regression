import { AccomadationDetailsPage } from '../../../package/AccomadationDetailsPage';
export class SalesQuote {
    /**
     * Creates an instance of PageHandler.
     * @param {import('playwright').Page} page - The Playwright page object.
     */
    constructor(page) {
        this.page = page;
        this.createSaleQuoteBtn = page.locator('#createQuoteLink');
        this.spinnerIcon = page.locator('img.LoadingSpinner__spinner');
    }

    async createSaleQuote() {
        await this.createSaleQuoteBtn.waitFor({ state: 'visible' });
        await this.createSaleQuoteBtn.click();
        await this.spinnerIcon.waitFor({ state: 'hidden' });
        return new AccomadationDetailsPage(this.page);
    }
}
