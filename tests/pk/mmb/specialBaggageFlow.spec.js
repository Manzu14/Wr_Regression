import { HomePage } from '../../../pages/HomePage.js';
import { SpecialBaggageUpgradePage } from '../../../pages/package/SpecialBaggageUpgradePage.js';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents.js';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage.js';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm.js';
// import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage.js';
// import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm.js';
import { expect, test } from '../../fixures/test.js';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the specialbaggage amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@inhouse'],
            annotation: { type: 'test_key', description: 'B2B-3379-specialbaggage' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.specialBaggage);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();

            const specialBaggageUpgradePage = new SpecialBaggageUpgradePage(page);
            await expect(await specialBaggageUpgradePage.specialBaggageComponent()).toBe(true, 'Special Baggage Component is not visible');

            await specialBaggageUpgradePage.upgradeSpecialBaggage();

            const selectedEquipment = await specialBaggageUpgradePage.selectSpecialBaggageOptions();
            await expect(selectedEquipment).toBe(true, 'No sports equipment option was available to select');
            console.log(`🏅 Selected sports equipment: ${specialBaggageUpgradePage.selectedEquipment.name} - €${specialBaggageUpgradePage.selectedEquipment.price}`);

            await specialBaggageUpgradePage.saveButton();
            const actualPrice = await specialBaggageUpgradePage.validateSpecialBaggagePrices();
            console.log(`💰 Summary shows total: €${actualPrice}`);
            
            expect(actualPrice).toBe(specialBaggageUpgradePage.selectedEquipment.price, `Summary price (€${actualPrice}) doesn't match selected price (€${specialBaggageUpgradePage.selectedEquipment.price})`);

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();

            const reviewandconfirm = new ReviewAndConfirm(page);
            await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            console.log('🔄 Navigated to Review and Confirm page');

            const reviewPrice = await reviewandconfirm.validateSpecialBaggagePrice();
            console.log(`💰 Review page shows: €${reviewPrice} (${specialBaggageUpgradePage.selectedEquipment.name} for 1 pax)`);
            
            expect(reviewPrice).toBe(actualPrice, `Review price (€${reviewPrice}) doesn't match summary price (€${actualPrice})`);

            await reviewandconfirm.confirmChanges.click();

            // Uncomment below if you want to validate payment confirmation
            /*
            const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink();

            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
            */
        }
    );
});
