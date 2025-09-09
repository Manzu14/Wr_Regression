const { HomePage } = require('../../../pages/HomePage');
const { CanxReservationPage } = require('../../../pages/package/CanxReservationPage');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { CancelBookingConfirmationPage } = require('../../../pages/package/CancelBookingConfirmationPage');

const { expect, test } = require('../../fixures/test');
const { testData } = require('../../../test-data/testData.js');

test.describe('[B2B]-[MMB]: Validation MMB flows', () => {
  test(
    '[B2B][MMB]: Verify the Cancel Booking flow and URL confirmation',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();

      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.cancelBooking);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      const canxReservationPage = new CanxReservationPage(page);
      await canxReservationPage.cancelReservation();

      const cancelBookingConfirmationPage = new CancelBookingConfirmationPage(page);
      await cancelBookingConfirmationPage.waitForCancelBookingConfirmationPage();

      // Optional: Go back to booking
      // await cancelBookingConfirmationPage.clickBackToBookingButton();
    }
  );
});
