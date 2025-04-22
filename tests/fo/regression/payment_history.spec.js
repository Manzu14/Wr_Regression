import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test } = require('../../fixures/test');
import { expect } from '@playwright/test';

test.describe(
    '[B2B][FO]: Verify Payment History details in MMB',
    { annotation: { type: 'test_key', description: 'B2B-3326' }, tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'] },
    () => {
        if (process.env.CI) test.describe.configure({ retries: 1 });
        test('Verify payment history', async ({ page }) => {
            test.setTimeout(5 * 60 * 1000);
            const passengerDetailsPage = await toExtraOptionsPage(page);
            await passengerDetailsPage.fillAllPassangersDetails();
            const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
            await flightOnlyPaymentPage.verifyPaymentMethods();
            const flightOnlyConfirmBookingPage = await flightOnlyPaymentPage.selectPaymentmethod(0, 'Cash');
            const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyConfirmBookingPage.getBookingReferenceId();
            expect(bookingRefernceNumber).toBeTruthy();
            await flightOnlyManageBookingPage.clickRequestReservation();
            await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
            await flightOnlyManageBookingPage.clickLoginReservationButton();
            await flightOnlyManageBookingPage.manageReservationlink.click();
            await flightOnlyManageBookingPage.verifyPaymentHistoryContainers();
        });
    },
);
