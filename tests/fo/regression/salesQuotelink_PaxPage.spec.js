import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe(
    '[B2B][FO]: Verify Sales Quote link in pax pages and generate Sales quote PDF',
    { annotation: { type: 'test_key', description: 'B2B-3328' }, tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'] },
    () => {
        test('Sales Quote link in pax pages', async ({ page }) => {
            test.setTimeout(5 * 60 * 1000);
            const passengerDetailsPage = await toExtraOptionsPage(page);
            await passengerDetailsPage.fillAllPassangersDetails();
            const accomadationDetailsPage = await passengerDetailsPage.foSalesQuote.createSaleQuote();
            const newPage = await accomadationDetailsPage.validateInNewTabPdfPageDisplayed();
            await expect(newPage).toHaveURL(/document-service/);
        });
    },
);
