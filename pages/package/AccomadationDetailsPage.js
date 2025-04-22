import { BookSummaryDetailsPage } from './BookSummaryDetailsPage';
const { getCountryType, isThirdParty, isBE } = require('../../config/test_config');
const { expect } = require('@playwright/test');
const countryCode = getCountryType();
const pr = require('promise');
export class AccomadationDetailsPage {
    /** @param {import('playwright').Page} page */
    constructor(page) {
        this.page = page;
        this.furtherButton = page.locator(
            '//div[@class="ProgressbarNavigation__summaryButton"]//button[@class="buttons__button buttons__primary buttons__fill"]',
        );
        this.createaQuoteLink = page.locator('#createQuoteLink');
        this.selectCostTypeFieldDropDown = page.locator('//select[@id="costTypeField1"]');
        this.salesQuoteSumTextBox = page.locator('//input[@name="sum"]');
        this.salesQuoteNoteTextBox = page.locator('//textarea[@id="notesField1"]');
        this.salesQuoteSaveAsPdfButton = page.locator('button.saveAsPdfButton');
        this.atYourHoliday = page.locator('.ProgressbarNavigation__completed').locator('a[aria-label="YOUR_HOLIDAY"]');
    }

    /**
     * This Method is used to click the Further button in Accomadation details page
     * @returns {Promise<BookSummaryDetailsPage>}
     */
    async clickFurtherButton() {
        await this.furtherButton.click();
        await expect(this.atYourHoliday).toBeVisible({ timeout: 90_000 });
        return new BookSummaryDetailsPage(this.page);
    }

    /**
     * This Method used to click sales quote hyperlink and enter data in the displayed textbox
     * @param {boolean} isPaxPages accepts boolean value to check whether it is pax pages or not
     * @returns {Promise<void>}
     */
    async clickSalesQuoteLinkEnterIputdata(isPaxPages) {
        const sumArr = { be: '250', nl: '300', ma: '500' };
        const sum = sumArr[countryCode];
        const notes = `Test PDF for salesquote in ${countryCode} sites`;
        if (isThirdParty() && isBE()) {
            if (!isPaxPages) {
                await this.createaQuoteLink.click();
                await this.page.waitForLoadState('load');
                await this.selectCostTypeFieldDropDown.selectOption({ index: 1 });
                await this.salesQuoteSumTextBox.fill(sum);
                await this.salesQuoteNoteTextBox.fill(notes);
                await this.salesQuoteSaveAsPdfButton.click();
            } else {
                await this.page.getByLabel('progressbar navigation').locator(this.createaQuoteLink).click();
                await this.page.getByLabel('sales quote').getByLabel('Select').selectOption({ index: 1 });
                await this.page.getByLabel('sales quote').getByLabel('text input').fill(sum);
                await this.page.getByLabel('sales quote').getByLabel('text area', { exact: true }).fill(notes);
                await this.page.getByLabel('sales quote').getByLabel('button').click();
            }
        } else {
            await this.createaQuoteLink.first().click();
        }
    }

    /**
     * This Method used to validate the PDF file loaded in new tab
     * @returns {Promise<import('@playwright/test').Page>}
     */
    async validateInNewTabPdfPageDisplayed() {
        const browserContext = this.page.context();
        let newPage;
        browserContext.on('page', page => {
            newPage = page;
        });
        await new pr(resolve => {
            browserContext.once('page', () => resolve());
        });
        return newPage;
    }
}
