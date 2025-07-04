const { HomePage } = require('../../../pages/HomePage');
const { PetsUpgradePage } = require('../../../pages/package/PetsUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { expect, test } from '../../fixures/test';
import { testData } from './testData.js';

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
            expect(await petsUpgradePage.petsComponent()).toBe(true, 'Pets Component is not visible');

            await petsUpgradePage.upgradePets();

            const selected = await petsUpgradePage.selectPetsOptions();
            expect(selected).toBe(true, 'No unselected pets option was available to check');
            await petsUpgradePage.saveButton();

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
