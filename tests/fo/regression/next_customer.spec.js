import { toConfirmBookingPage } from '../../../flows/flightonly/navigate';
const { test, expect } = require('../../fixures/test');

test.describe(
    'Verify Manage this booking and Next Customer CTA buttons in confirmation page',
    { annotation: { type: 'test_key', description: 'B2B-3325' }, tag: ['@regression', '@inhouse', '@nl', '@be', '@ma'] },
    () => {
        test('Verify Manage this booking and Next Customer CTA buttons', async ({ page }) => {
            test.setTimeout(6 * 60 * 1000);
            const { bookingRefernceNumber, flightOnlyManageBookingPage } = await toConfirmBookingPage(page);
            expect(bookingRefernceNumber).toBeTruthy();
            await flightOnlyManageBookingPage.clickRequestReservation();
            await flightOnlyManageBookingPage.enterBookingReferenceNumber(bookingRefernceNumber);
            await flightOnlyManageBookingPage.clickLoginReservationButton();
            await flightOnlyManageBookingPage.getReservationNumber.waitFor({ state: 'visible' });
            const searchPage = await flightOnlyManageBookingPage.verifyNextCustomer();
            await expect(searchPage.flightSearchPanel, { message: 'search panel not displayed' }).toBeVisible();
        });
    },
);
