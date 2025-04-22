const { toExtraOptionsPage } = require('../../../flows/flightonly/navigate');
const { test, expect } = require('../../fixures/test');

test.describe('Flight Only smoke test for 3PA', { tag: ['@smoke', '@be', '@nl', '@vip', '@ma', '@inhouse', '@3rdparty'] }, () => {
    if (process.env.CI) test.describe.configure({ retries: 3 });
    test('Flight Only create booking and search booking in MMB for 3PA', async ({ page }, testInfo) => {
        test.setTimeout(5 * 60 * 1000);
        const passengerDetailsPage = await toExtraOptionsPage(page);
        await passengerDetailsPage.fillAllPassangersDetails();
        const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
        const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyPaymentPage.flightOnlyConfirmBookingPage.getBookingReferenceId();
        expect(bookingRefernceNumber).toBeTruthy();
        await test.step(`adding booking number to test info: ${bookingRefernceNumber}`, () => {
            testInfo.annotations.push({ type: 'bookingRefernceNumber', description: bookingRefernceNumber });
        });
        await flightOnlyManageBookingPage.clickRequestReservation();
        await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
        await flightOnlyManageBookingPage.clickLoginReservationButton();
        await flightOnlyManageBookingPage.getReservationNumber.isVisible({ timeout: 40_0000 });
        await expect(flightOnlyManageBookingPage.getReservationNumber).toHaveText(bookingRefernceNumber);
    });
});
