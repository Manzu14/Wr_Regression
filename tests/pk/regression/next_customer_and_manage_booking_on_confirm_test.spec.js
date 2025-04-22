const { toPaymentOptionPage } = require('../../../flows/navigate');
const { test, expect } = require('../../fixures/test');
import { HomePage } from '../../../pages/HomePage';
const pr = require('promise');

test.describe('Verify CTAs on booking confirmation page', { tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty', '@stable'] }, () => {
    test(
        '[B2B][PKG]: Verify manage booking & and starting a new booking from next customer CTAs in confirmation page',
        { annotation: { type: 'test_key', description: 'B2B-3304' } },
        async ({ page }) => {
            const { confirmBookingPage, paymentOptionsPage } = await toPaymentOptionPage(page);
            await paymentOptionsPage.enterPaymentDetails();
            const { bookingRefernceNumber, manageBookingPage } = await confirmBookingPage.getBookingReferenceId();
            expect(bookingRefernceNumber).toBeTruthy();
            await new pr(resolve => setTimeout(resolve, 60_000));
            await confirmBookingPage.goToManageReservation();
            await manageBookingPage.getReservationNumber.isVisible({ timeout: 40_0000 });
            await expect(manageBookingPage.getReservationNumber).toHaveText(bookingRefernceNumber);
            await page.goBack({ waitUntil: 'load' });
            await confirmBookingPage.clickNextCustomerBTN();
            const homePage = new HomePage(page);
            await expect(homePage.headerComponent.wrapper).toBeVisible({ timeout: 40000 });
            await expect(homePage.searchPage.searchPanel).toBeVisible();
        },
    );
});
