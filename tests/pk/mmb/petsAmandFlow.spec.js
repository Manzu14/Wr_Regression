import { HomePage } from '../../../pages/HomePage.js';
import { PetsUpgradePage } from '../../../pages/package/PetsUpgradePage.js';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents.js';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage.js';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm.js';
// import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm.js';
// import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage.js';
import { expect, test } from '../../fixures/test.js';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the pets amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@be', '@nl', '@inhouse'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.petsAmendment);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();

            const petsUpgradePage = new PetsUpgradePage(page);
            await expect(await petsUpgradePage.petsComponent()).toBe(true, 'Pets Component is not visible');

            await petsUpgradePage.upgradePets();

            const selectedPet = await petsUpgradePage.selectPetsOptions();
            await expect(selectedPet).toBe(true, 'No pets option was available to select');
            console.log(`🐕 Selected pet option: ${petsUpgradePage.selectedPet.name} - €${petsUpgradePage.selectedPet.price}`);

            await petsUpgradePage.saveButton();
            const actualPrice = await petsUpgradePage.validatePetsPrices();
            console.log(`💰 Summary shows total: €${actualPrice}`);
            
            expect(actualPrice).toBe(petsUpgradePage.selectedPet.price, `Summary price (€${actualPrice}) doesn't match selected price (€${petsUpgradePage.selectedPet.price})`);

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();

            const reviewandconfirm = new ReviewAndConfirm(page);
            await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            console.log('🔄 Navigated to Review and Confirm page');

            const reviewPrice = await reviewandconfirm.validatePetsPrice();
            console.log(`💰 Review page shows: €${reviewPrice} (${petsUpgradePage.selectedPet.name} for 1 pax)`);
            
            expect(reviewPrice).toBe(actualPrice, `Review price (€${reviewPrice}) doesn't match summary price (€${actualPrice})`);

            await reviewandconfirm.confirmChanges.click();


           /* const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink(); // 
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();*/
        },
    );
});
