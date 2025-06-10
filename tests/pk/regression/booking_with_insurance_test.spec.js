const { toSummaryDetailsPage } = require('../../../flows/navigate');
const { BookSummaryDetailsPage } = require('../../../pages/package/BookSummaryDetailsPage');
const { PackageInsurance } = require('../../../pages/package/components/insurance/package_insurance');
const { test, expect } = require('../../fixures/test');

test.describe('@mahesh [B2B]-[PKG]: validation able to complete package booking with Insurance', () => {
    test(
        '[B2B][PKG]: Verify ability to complete booking with insurance',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@stable'],
            annotation: { type: 'test_key', description: 'B2B-3283' },
        },
        async ({ page }) => {
            await toSummaryDetailsPage(page);
            const packageInsurance = new PackageInsurance(page);
            await packageInsurance.selectInsured();
            const bookSummaryDetailsPage = new BookSummaryDetailsPage(page);
            const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
            await passengerDetailsPage.fillAllPassengersDetailsWithoutDOB();
            await passengerDetailsPage.agreeToAllConditions();
            const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
            await paymentOptionsPage.enterPaymentDetails();
            expect(await confirmBookingPage.getBookingReferenceId()).toBeTruthy();
        },
    );
});
