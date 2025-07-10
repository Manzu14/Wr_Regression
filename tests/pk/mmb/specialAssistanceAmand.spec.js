const { HomePage } = require('../../../pages/HomePage');
const { SpecialAsstUpgradePage } = require('../../../pages/package/SpecialAsstUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
const { expect, test } = require('../../fixures/test');
const { testData } = require('../../../test-data/testData');

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
  test(
    '[B2B][mmb]: Verify the Special Assistance Amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      // Step 1: Navigate to booking and login
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.specialAsst);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      // Step 2: Special Assistance Amendment
      const specialAsstUpgradePage = new SpecialAsstUpgradePage(page);
      await expect(await specialAsstUpgradePage.specialAsstComponent()).toBe(true, 'Special Assistance component is not visible');
      await specialAsstUpgradePage.upgradeSpecialAsst();
      

      // Step 3: Click Review Button from Sticky Panel
      const yourBookingComponents = new YourBookingComponents(page);
      await yourBookingComponents.summaryButton();
      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      await reviewandconfirm.confirmChanges.click();
      // Optional: Proceed to payment/confirmation if needed
    }
  );
});
