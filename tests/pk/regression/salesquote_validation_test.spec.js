const { FlexibleDaysEnum, CountryEngNamesEnum } = require('../../../flows/api/search/defs/SearchApiEnumDef');
const { SearchUrlBuilder } = require('../../../flows/api/search/SearchUrlBuilder');
const { SearchResultPage } = require('../../../pages/package/SearchResultPage');
const { test, expect } = require('../../fixures/test');
let accomadationDetailsPage;

test.describe(
    '[PKG]-[accomadationDetailsPage]: Sample test to validate sales quote functionality',
    { tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty', '@stable'] },
    () => {
        test.beforeEach(async ({ page }) => {
            const url = await SearchUrlBuilder.getSearchUrl({
                airportsOptions: ['all'],
                departureOptions: { dateOptions: 30, flexOptions: FlexibleDaysEnum.FOURTEEN },
                destinationOptions: { countryEngNames: [CountryEngNamesEnum.Spain] },
                paxOptions: {
                    passengersOptions: [],
                },
            });
            await page.goto(url);
            const searchResultPage = new SearchResultPage(page);
            accomadationDetailsPage = await searchResultPage.openRandomPackage();
        });
        test(
            '[PKG]: Verify Sales Quote link in non pax pages and generate Sales quote PDF.',
            { annotation: { type: 'test_key', description: 'B2B-3306' } },
            async () => {
                await accomadationDetailsPage.clickSalesQuoteLinkEnterIputdata(false);
                const newPage = await accomadationDetailsPage.validateInNewTabPdfPageDisplayed();
                await expect(newPage.locator('embed')).toBeVisible();
            },
        );
        test(
            '[PKG]: Verify Sales Quote link in pax pages and generate Sales quote PDF.',
            { annotation: { type: 'test_key', description: 'B2B-3307' } },
            async () => {
                const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
                const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
                await passengerDetailsPage.fillAllPassangersDetails();
                await accomadationDetailsPage.clickSalesQuoteLinkEnterIputdata(true);
                const newPage = await accomadationDetailsPage.validateInNewTabPdfPageDisplayed();
                await expect(newPage.locator('embed')).toBeVisible();
            },
        );
    },
);
