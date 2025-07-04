const { HomePage } = require('../../../pages/HomePage');
const { SpecialAsstUpgradePage } = require('../../../pages/package/SpecialAsstUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { expect, test } from '../../fixures/test';

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

      await manageBookingPage.enterBookingReferenceNumber('100005982889');
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy(); // Optional visibility check
      await manageBookingPage.clickLoginReservationButton();

      // Step 2: Special Assistance Amendment
      const specialAsstUpgradePage = new SpecialAsstUpgradePage(page);
      await expect(await specialAsstUpgradePage.specialAsstComponent()).toBe(true, 'Special Assistance component is not visible');
      await specialAsstUpgradePage.upgradeSpecialAsst();

      
      const yourBookingComponents = new YourBookingComponents(page);
      await yourBookingComponents.reviewButton.waitFor({ state: 'visible', timeout: 30000 });
      await yourBookingComponents.reviewButton.scrollIntoViewIfNeeded();
      await yourBookingComponents.reviewButton.click();



      // Step 4: Review & Confirm
      const reviewAndConfirm = new ReviewAndConfirm(page);
      await expect(await reviewAndConfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      await reviewAndConfirm.confirmChanges.click(); // Again, fix usage

      // Step 5: Payment Options
      const paymentOptions = new PaymentOptionsPage(page);
      await paymentOptions.clickSkipPaymentLink();

      // Step 6: Confirmation Page
      const managePaymentConfirm = new ManagePaymentConfirm(page);
      await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
      await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
    }
  );
});

