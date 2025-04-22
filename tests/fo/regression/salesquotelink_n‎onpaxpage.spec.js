import { toSelectFlightPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe(
    '[B2B][FO]: Verify Sales Quote link in non pax pages and generate Sales quote PDF',
    { tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'] },
    () => {
        test('Sales Quote link flight Options page', { annotation: { type: 'test_key', description: 'B2B-3327' } }, async ({ page }) => {
            test.setTimeout(5 * 60 * 1000);
            const flightOptionPage = await toSelectFlightPage(page);
            const accomadationDetailsPage = await flightOptionPage.passengerDetailsPage.foSalesQuote.createSaleQuote();
            const newPage = await accomadationDetailsPage.validateInNewTabPdfPageDisplayed();
            await expect(newPage).toHaveURL(/document-service/, { timeout: 60000 });
        });
        test('Sales Quote link on Extra option page', { annotation: { type: 'test_key', description: 'B2B-3327' } }, async ({ page }) => {
            test.setTimeout(5 * 60 * 1000);
            const flightOptionPage = await toSelectFlightPage(page);
            await flightOptionPage.flightOptionPageClickContinue();
            const accomadationDetailsPage = await flightOptionPage.passengerDetailsPage.foSalesQuote.createSaleQuote();
            const newPage = await accomadationDetailsPage.validateInNewTabPdfPageDisplayed();
            await expect(newPage).toHaveURL(/document-service/, { timeout: 60000 });
        });
    },
);
