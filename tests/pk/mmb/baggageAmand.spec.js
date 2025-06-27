import { HomePage } from '../../../pages/HomePage';
import { BaggageUpgradePage } from '../../../pages/package/BaggageUpgradePage';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm';
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { expect, test } from '../../fixures/test';
import { testData } from './testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the baggage amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
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
            await expect(await baggageUpgradePage.selectBaggageOptions()).toBe(true, 'Baggage options are not visible');
            await baggageUpgradePage.saveButton();

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            const reviewandconfirm = new ReviewAndConfirm(page);
            await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await reviewandconfirm.confirmChanges.click();
           const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink(); // 
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
        },
    );
});
