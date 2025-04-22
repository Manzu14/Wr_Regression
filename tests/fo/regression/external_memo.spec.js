import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe(
    '[B2B][FO]: Verify ability to add external memos to the booking in MMB',
    { annotation: { type: 'test_key', description: 'B2B-3318' }, tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'] },
    () => {
        test('Add external memos to the booking in MMB', async ({ page }) => {
            test.setTimeout(6 * 60 * 1000);
            const passengerDetailsPage = await toExtraOptionsPage(page);
            await passengerDetailsPage.fillAllPassangersDetails();
            const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
            await flightOnlyPaymentPage.skipPaymentBtn.waitFor({ state: 'visible', timeout: 60000 });
            const flightOnlyConfirmBookingPage = await flightOnlyPaymentPage.skipPayment();
            const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyConfirmBookingPage.getBookingReferenceId();
            expect(bookingRefernceNumber).toBeTruthy();
            await flightOnlyManageBookingPage.clickRequestReservation();
            await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
            await flightOnlyManageBookingPage.clickLoginReservationButton();
            await flightOnlyManageBookingPage.createExternalMemo();
            await expect(flightOnlyManageBookingPage.confirmedMemo).toBeVisible();
        });
    },
);
