import { HomePage } from '../../../pages/HomePage';
import { BaggageUpgradePage } from '../../../pages/package/BaggageUpgradePage';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm';
// import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
// import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
  test(
    '[B2B][mmb]: Verify the baggage amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@inhouse'],
      annotation: { type: 'test_key', description: 'B2B-3379-baggage' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.baggage);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      const baggageUpgradePage = new BaggageUpgradePage(page);
      await expect(await baggageUpgradePage.baggageComponent()).toBe(true, 'Baggage Component is not visible');
      await baggageUpgradePage.upgradeBaggage();
      const selectedBaggage = await baggageUpgradePage.fetchAndSelectBaggageByIndex(2);
      console.log(`🧾 Selected ${selectedBaggage.weight} baggage per pax (Inbound & Outbound): €${selectedBaggage.price}`);

      await baggageUpgradePage.saveButton();
      const actualPrice = await baggageUpgradePage.validatePriceAgainstSummary(selectedBaggage.price);
      console.log(`💰 Summary shows total: €${actualPrice}`);
      
      expect(actualPrice).toBe(selectedBaggage.price, `Summary price (€${actualPrice}) doesn't match selected price (€${selectedBaggage.price})`);

      const yourBookingComponents = new YourBookingComponents(page);
      await yourBookingComponents.summaryButton();

      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      console.log('🔄 Navigated to Review and Confirm page');

      const reviewPrice = await reviewandconfirm.validateBaggagePrice();
      console.log(`💰 Review page shows: €${reviewPrice} (${selectedBaggage.weight} Inbound & Outbound baggage for 1 pax)`);
      
      expect(reviewPrice).toBe(actualPrice, `Review price (€${reviewPrice}) doesn't match summary price (€${actualPrice})`);

      await reviewandconfirm.confirmChanges.click();


     /* const paymentOptions = new PaymentOptionsPage(page);
      await paymentOptions.clickSkipPaymentLink();

      const managePaymentConfirm = new ManagePaymentConfirm(page);
      await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
      await expect(managePaymentConfirm.thankYouMessage).toBeVisible();*/
    }
  );
});
 