const { toPassengerDetailsPage } = require('../../../flows/navigate');
const { PackagePriceDetailSection } = require('../../../pages/package/components/price_breakdown_section/PackagePriceDetailSection');
const { test, expect } = require('../../fixures/test');
let passengerDetailsPage, packagePrice;

test.describe(
    '[B2B][PKG]: Validate amending the booking with marketing preferences and fees and discounts',
    { tag: ['@regression', '@be', '@nl', '@ma', '@inhouse', '@3rdparty', '@stable'] },
    () => {
        test.beforeEach(async ({ page }) => {
            passengerDetailsPage = await toPassengerDetailsPage(page);
            packagePrice = new PackagePriceDetailSection(page);
        });

        test(
            'Verify able to complete package booking with marketing Preference in passenger details',
            {
                tag: ['@be', '@nl', '@ma', '@vip', '@inhouse'],
                annotation: { type: 'test_key', description: 'B2B-3284' },
            },
            async () => {
                await expect(passengerDetailsPage.eMailMarketingPreference).toBeVisible({ timeout: 60_000 });
                await passengerDetailsPage.eMailMarketingPreference.click();
            },
        );
        test(
            'Validation of error message in Passenger details page when user tries to add fees more than 2 times',
            {
                tag: ['@be', '@nl', '@ma', '@vip', '@inhouse'],
                annotation: { type: 'test_key', description: 'B2B-3285' },
            },
            async () => {
                await packagePrice.expandAgentInfoChevron();
                expect(await packagePrice.errorMessageFEE()).toBeTruthy();
            },
        );
        test(
            'Verify ability to complete booking with fee & discounts and validate price breakdown in bookflow.',
            {
                tag: ['@be', '@nl', '@ma', '@vip', '@inhouse'],
                annotation: { type: 'test_key', description: 'B2B-3286' },
            },
            async () => {
                await packagePrice.expandAgentInfoChevron();
                const calculatedPrice = await packagePrice.calculatePriceAfterFeesAndDiscounts();
                expect(calculatedPrice).toEqual(parseFloat((await packagePrice.priceDisplayed.textContent()).substring(1)));
                const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
                await paymentOptionsPage.enterPaymentDetails();
                expect(calculatedPrice).toEqual(parseFloat((await paymentOptionsPage.displayedTotalPrice.textContent()).substring(1)));
                expect(await confirmBookingPage.getBookingReferenceId()).toBeTruthy();
            },
        );
        test(
            'No Fee discounts for third party package in passenger details',
            {
                tag: ['@be', '@nl', '@ma', '@vip', '@3rdparty'],
                annotation: { type: 'test_key', description: 'B2B-3287' },
            },
            async () => {
                await packagePrice.priceBreakDownChevron.click();
                await expect(packagePrice.agentInfoChevron).toHaveCount(0);
            },
        );
    },
);
