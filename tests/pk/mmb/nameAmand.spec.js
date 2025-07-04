import { HomePage } from '../../../pages/HomePage';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm';
import { LoginPage } from '../../../pages/LoginPage';
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
      // STEP 1: Login
      const loginPage = new LoginPage(page);
      await loginPage.doLogin();

      // STEP 2: Go to MMB page
      await page.goto(
        'https://tuiretail-be-sit.tuiad.net/retail/travel/nl/your-account/managemybooking/yourbooking',
        { waitUntil: 'networkidle' }
      );

      // STEP 3: Search Booking
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);

      await manageBookingPage.enterBookingReferenceNumber(testData.nameAmendment);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      // STEP 4: Pax Amendment
      const paxUpgradePage = new PaxUpgradePage(page);
      await expect(paxUpgradePage.passengerListWrapper).toBeVisible();
      await paxUpgradePage.updatePassengerDetailsLink.click();
      await page.waitForTimeout(5000);

      await paxUpgradePage.updatePassengerDetails();
      await paxUpgradePage.saveAndProceed();

      // STEP 5: Confirm Changes
      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      await reviewandconfirm.confirmChanges.click();

      // STEP 6: Skip Payment
      const paymentOptions = new PaymentOptionsPage(page);
      await paymentOptions.clickSkipPaymentLink();

      // STEP 7: Confirmation Message
      const managePaymentConfirm = new ManagePaymentConfirm(page);
      await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
      await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
    }
  );
});
