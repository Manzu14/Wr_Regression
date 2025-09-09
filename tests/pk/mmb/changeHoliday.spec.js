import { HomePage } from '../../../pages/HomePage.js';
import { HolidayUpgradePage } from '../../../pages/package/HolidayUpgradePage.js';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage.js';
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
  test(
    '[B2B][mmb]: Verify the Holiday Upgrade, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@inhouse'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.hotel);
      expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      const holidayUpgradePage = new HolidayUpgradePage(page);
      await holidayUpgradePage.changeDepartureDateToLater();

      await expect(page).toHaveURL(/reviewChanges/);
    }
  );
});
