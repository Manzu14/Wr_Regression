import { HomePage } from '../../../pages/HomePage';
import { ConfirmBookingPage } from '../../../pages/package/ConfirmBookingPage';
const { toAccommodationDetails } = require('../../../flows/navigate');
const { test, expect } = require('../../fixures/test');
let refernceNumber;

test.describe.configure({ mode: 'default', retries: 3 });
test.describe('Validate creation of a booking with transfer payment', { tag: ['@regression', '@be', '@nl', '@inhouse', '@stable'] }, () => {
    test.beforeEach(async ({ reusedFutureBooking }) => {
        refernceNumber = reusedFutureBooking.bookingRefernceNumber;
        expect(refernceNumber).toBeTruthy();
    });
    test(
        '[B2B][PKG]: Create booking with payment transfer',
        {
            annotation: {
                type: 'test_key',
                description: 'B2B-3288',
            },
        },
        async ({ reusedFutureBooking }) => {
            const confirmBookingPageFuture = new ConfirmBookingPage(reusedFutureBooking.page);
            await confirmBookingPageFuture.clickNextCustomerBTN();
            const homePage = new HomePage(reusedFutureBooking.page);
            await expect(homePage.headerComponent.wrapper).toBeVisible({ timeout: 40_000 });
            await expect(homePage.searchPage.searchPanel).toBeVisible();
            const accomadationDetailsPage = await toAccommodationDetails(reusedFutureBooking.page);
            const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
            const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
            await passengerDetailsPage.fillAllPassangersDetails();
            await passengerDetailsPage.agreeToAllConditions();
            const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
            await paymentOptionsPage.enterTransferPaymentDetails(refernceNumber);
            expect(await confirmBookingPage.getBookingReferenceId()).toBeTruthy();
        },
    );
});
