import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe(
    '[B2B][FO]: Verify booking history details in MMB',
    { annotation: { type: 'test_key', description: 'B2B-3317' }, tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'] },
    () => {
        test('Verify booking history details in MMB', async ({ page }) => {
            test.setTimeout(5 * 60 * 1000);
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
            await flightOnlyManageBookingPage.manageReservationlink.click();
            await expect.soft(flightOnlyManageBookingPage.bookingRefNumber).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.bookingAgentName).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.versionBookingHistoryDropdown).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.bookingHistoryContainer).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.bookingHistoryPaxTable).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.typeProduct).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.travellerName).toBeVisible();
            await expect.soft(flightOnlyManageBookingPage.duration).toBeVisible();
            await flightOnlyManageBookingPage.verifyBookingHistoryContainers();
        });
    },
);
