import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe('[B2B][FO]: Verify Travel Assistance flag in MMB.', { tag: ['@regression', '@be', '@nl', '@ma', '@vip'] }, () => {
    test('Verify Travel Assistance flag in MMB.', { tag: ['@inhouse'], annotation: { type: 'test_key', description: 'B2B-3329' } }, async ({ page }) => {
        test.setTimeout(6 * 60 * 1000);
        const passengerDetailsPage = await toExtraOptionsPage(page);
        await passengerDetailsPage.fillAllPassangersDetails();
        const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
        await flightOnlyPaymentPage.verifyPaymentMethods();
        const flightOnlyConfirmBookingPage = await flightOnlyPaymentPage.selectPaymentmethod(0, 'Cash');
        const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyConfirmBookingPage.getBookingReferenceId();
        await flightOnlyManageBookingPage.clickRequestReservation();
        await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
        await flightOnlyManageBookingPage.clickLoginReservationButton();
        await flightOnlyManageBookingPage.selectTravelWithAssistance();
        await expect(flightOnlyManageBookingPage.travelWithAssistanceRow).toBeVisible();
        await flightOnlyManageBookingPage.reviewConfirmButton.click();
        await flightOnlyManageBookingPage.reservationConfirmationBox.waitFor({ state: 'visible', timeout: 60_000 });
        await expect(flightOnlyManageBookingPage.reservationNumber).toBeVisible();
    });
    test(
        '[3PA][FO] Verify Travel Assistance flag in MMB.',
        { tag: ['@3rdparty'], annotation: { type: 'test_key', description: 'B2B-3329' } },
        async ({ page }) => {
            test.setTimeout(6 * 60 * 1000);
            const passengerDetailsPage = await toExtraOptionsPage(page);
            await passengerDetailsPage.fillAllPassangersDetails();
            const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
            const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyPaymentPage.flightOnlyConfirmBookingPage.getBookingReferenceId();
            expect(bookingRefernceNumber).toBeTruthy();
            await flightOnlyManageBookingPage.clickRequestReservation();
            await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
            await flightOnlyManageBookingPage.clickLoginReservationButton();
            await flightOnlyManageBookingPage.selectTravelWithAssistance();
            await expect(flightOnlyManageBookingPage.travelWithAssistanceRow).toBeVisible();
            await flightOnlyManageBookingPage.reviewConfirmButton.click();
            await flightOnlyManageBookingPage.reservationConfirmationBox.waitFor({ state: 'visible', timeout: 60_000 });
            await expect(flightOnlyManageBookingPage.reservationNumber).toBeVisible();
        },
    );
});
