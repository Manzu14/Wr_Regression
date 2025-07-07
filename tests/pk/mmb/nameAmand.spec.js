import { HomePage } from '../../../pages/HomePage';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm';
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { PaxUpgradePage } from '../../../pages/package/PaxUpgradePage';
import { expect, test } from '../../fixures/test';
import { testData } from './testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
  test(
    '[B2B][mmb]: Verify the Pax amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@be', '@nl', '@inhouse'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      // STEP 1: Navigate to Booking Search
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);

       // STEP 2: Search Booking and handle login navigation
      await manageBookingPage.enterBookingReferenceNumber(testData.nameAmendment);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        manageBookingPage.clickLoginReservationButton()
      ]);

      // STEP 3: Verify Booking Reference
      await expect(bookingSearchPage.MmbBookingReference).toBeVisible({ timeout: 30000 });

      // STEP 4: Pax Amendment
      const paxUpgradePage = new PaxUpgradePage(page);
      await expect(paxUpgradePage.passengerListWrapper).toBeVisible();
      await paxUpgradePage.updatePassengerDetailsLink.click();
      await page.waitForTimeout(5000);
      await paxUpgradePage.updatePassengerDetails();
      await paxUpgradePage.saveAndProceed();

      // STEP 5: Click Summary Button
      const yourBooking = new YourBookingComponents(page);
      await yourBooking.summaryButton();

      // STEP 6: Confirm Changes
      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(
        true,
        'Review & confirm button is not visible'
      );
      await reviewandconfirm.confirmChanges.click();

      // STEP 7: Skip Payment
      const paymentOptions = new PaymentOptionsPage(page);
      await paymentOptions.clickSkipPaymentLink();

      // STEP 8: Confirmation Message
      const managePaymentConfirm = new ManagePaymentConfirm(page);
      await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
      await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
    }
  );
});