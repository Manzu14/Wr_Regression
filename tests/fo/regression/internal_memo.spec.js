import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe('[B2B][FO]: Verify ability to add internal memos to the booking in MMB.', () => {
    test(
        'Add internal memos to the booking in MMB',
        { tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'], annotation: { type: 'test_key', description: 'B2B-3323' } },
        async ({ page }) => {
            test.setTimeout(6 * 60 * 1000);
            const passengerDetailsPage = await toExtraOptionsPage(page);
            await passengerDetailsPage.fillAllPassangersDetails();
            const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
            await flightOnlyPaymentPage.skipPaymentBtn.waitFor({ state: 'visible', timeout: 60000 });
            const flightOnlyConfirmBookingPage = await flightOnlyPaymentPage.skipPayment();
            const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyConfirmBookingPage.getBookingReferenceId();
            await flightOnlyManageBookingPage.clickRequestReservation();
            await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
            await flightOnlyManageBookingPage.clickLoginReservationButton();
            await flightOnlyManageBookingPage.createInternalMemo();
            await expect(flightOnlyManageBookingPage.memoList.nth(0)).toBeVisible();
            await expect(flightOnlyManageBookingPage.memoInfo.nth(0)).toBeVisible();
            await expect(flightOnlyManageBookingPage.memoDetails.nth(0)).toBeVisible();
            await flightOnlyManageBookingPage.memoDetails.nth(0).click();
            await expect(flightOnlyManageBookingPage.openActiveMemo.nth(0)).toBeVisible();
            await flightOnlyManageBookingPage.createInternalMemoReservering();
            await expect(flightOnlyManageBookingPage.memoInfo.nth(1)).toBeVisible();
            await flightOnlyManageBookingPage.memoDetails.nth(1).click();
            await expect(flightOnlyManageBookingPage.openActiveMemo.nth(1)).toBeVisible();
        },
    );
});
