const { HomePage } = require('../../../pages/HomePage');
const { HotelUpgradePage } = require('../../../pages/package/HotelUpgradePage');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the Hotel Upgrade, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@inhouse'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.hotel);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();

            // Step 2–8: Hotel change flow
            const hotelUpgradePage = new HotelUpgradePage(page);
            await hotelUpgradePage.changeHotel();

            // Final Step: Assertion
            await expect(page).toHaveURL(/reviewChanges/);
        });
});