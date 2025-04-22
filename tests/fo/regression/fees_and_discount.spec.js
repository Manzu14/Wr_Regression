import { toExtraOptionsPage } from '../../../flows/flightonly/navigate';
const { test } = require('../../fixures/test');
import { expect } from '@playwright/test';

test.describe(
    'Verify ability to complete booking with fee & discounts and validate price breakdown in bookflow',
    {
        annotation: { type: 'test_key', description: 'B2B-3319' },
        tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'],
    },
    () => {
        if (process.env.CI) test.describe.configure({ retries: 1 });
        test('complete booking with fee & discounts', async ({ page }) => {
            test.setTimeout(5 * 60 * 1000);
            const passengerDetailsPage = await toExtraOptionsPage(page);
            await passengerDetailsPage.foAgentFees.addAgentfees();
            await passengerDetailsPage.fillAllPassangersDetails();
            const flightOnlyPaymentPage = await passengerDetailsPage.foClickAgreeContinue();
            await flightOnlyPaymentPage.verifyPaymentMethods();
            const flightOnlyConfirmBookingPage = await flightOnlyPaymentPage.skipPayment();
            const { bookingRefernceNumber, flightOnlyManageBookingPage } = await flightOnlyConfirmBookingPage.getBookingReferenceId();
            expect(bookingRefernceNumber).toBeTruthy();
            await flightOnlyManageBookingPage.clickRequestReservation();
            await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
            await flightOnlyManageBookingPage.clickLoginReservationButton();
            await flightOnlyManageBookingPage.getReservationNumber.waitFor({ state: 'visible', timeout: 40_000 });
            await expect(flightOnlyManageBookingPage.getReservationNumber).toHaveText(bookingRefernceNumber);
        });
    },
);
