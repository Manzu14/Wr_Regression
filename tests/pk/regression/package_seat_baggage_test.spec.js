const { toSummaryDetailsPage } = require('../../../flows/navigate');
const { BookSummaryDetailsPage } = require('../../../pages/package/BookSummaryDetailsPage');
const { FlightSeatBaggagePage } = require('../../../pages/package/FlightSeatBaggagePage');
const { test, expect } = require('../../fixures/test');

test.describe(
    '[B2B]-[PKG]: validation able to complete package booking with flight extras',
    { tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty', '@stable'] },
    () => {
        test(
            '[B2B][PKG]: Verify ability to complete booking with flight extras',
            {
                annotation: { type: 'test_key', description: 'B2B-3305' },
            },
            async ({ page }) => {
                await toSummaryDetailsPage(page);
                const flightSeatBaggage = new FlightSeatBaggagePage(page);
                await flightSeatBaggage.selectSeatAndBaggage();
                const bookSummaryDetailsPage = new BookSummaryDetailsPage(page);
                const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
                await passengerDetailsPage.fillAllPassangersDetails();
                await passengerDetailsPage.agreeToAllConditions();
                const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
                await paymentOptionsPage.enterPaymentDetails();
                expect(await confirmBookingPage.getBookingReferenceId()).toBeTruthy();
            },
        );
    },
);
