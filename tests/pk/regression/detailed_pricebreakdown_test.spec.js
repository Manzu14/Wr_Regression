const { toAccommodationDetails } = require('../../../flows/navigate');
const { test, expect } = require('../../fixures/test');

test.describe(
    '[PKG]: Verification of detailed price breakdown in bookflow.',
    { tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty', '@stable'] },
    () => {
        test(
            '[PKG]: Verify detailed price breakdown in bookflow.',
            {
                annotation: { type: 'test_key', description: 'B2B-3289' },
            },
            async ({ page }) => {
                test.setTimeout(500000);
                const accomadationDetailsPage = await toAccommodationDetails(page);
                const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
                await expect(bookSummaryDetailsPage.viewPricingDetailsHyperlink).toBeVisible();
                const expectedTotalPrice = await bookSummaryDetailsPage.getbookingTotalPrice();
                const detailedPriceBreakdownPage = await bookSummaryDetailsPage.validatePricingDetails();
                await expect(detailedPriceBreakdownPage.priceDetailsText.first()).toBeVisible();
                const actualTotalPrice = await detailedPriceBreakdownPage.getTotalPriceInPriceBreakDownPage();
                expect(actualTotalPrice).toEqual(expectedTotalPrice);
            },
        );
    },
);
