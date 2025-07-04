import { HomePage } from '../../../pages/HomePage';
import { BaggageUpgradePage } from '../../../pages/package/BaggageUpgradePage';
import { SpecialBaggageUpgradePage } from '../../../pages/package/SpecialBaggageUpgradePage';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm';
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { LoginPage } from '../../../pages/LoginPage';
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    // Baggage Amendment Test
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
            await paymentOptions.clickSkipPaymentLink();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
        },
    );
    // Special Baggage Amendment Test
    test(
        '[B2B][mmb]: Verify the special baggage amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.specialBaggage);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            const specialBaggageUpgradePage = new SpecialBaggageUpgradePage(page);
            await expect(await specialBaggageUpgradePage.specialBaggageComponent()).toBe(true, 'Baggage Component is not visible');
            await specialBaggageUpgradePage.upgradeSpecialBaggage();
            const selected = await specialBaggageUpgradePage.selectSpecialBaggageOptions();
            await expect(selected).toBe(true, 'No unselected baggage option was available to check');
            await specialBaggageUpgradePage.saveButton();
            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            const reviewAndConfirm = new ReviewAndConfirm(page);
            await expect(await reviewAndConfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await reviewAndConfirm.confirmChanges.click();
            const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
        },
    );
    // Name Amendment Test
    test(
        '[B2B][mmb]: Verify the Pax amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            // STEP 1: Perform login
            const loginPage = new LoginPage(page);
            await loginPage.doLogin();
            // STEP 2: Go to the login URL for name amendment
            await page.goto(
                'https://tuiretail-be-sit.tuiad.net/retail/travel/nl/your-account/managemybooking/yourbooking',
                { waitUntil: 'networkidle' }
            );
            // STEP 3: Continue existing test logic
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.nameAmendment);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            const yourBookingComponents = new YourBookingComponents(page);
            await expect(yourBookingComponents.passengerListWrapper).toBeVisible();
            await yourBookingComponents.updatePassengerDetailsLink.click();
            await page.waitForTimeout(5000);
            // Fill and save passenger details
            await yourBookingComponents.passengerFill();
            await expect(yourBookingComponents.saveContactDetailsButton).toBeVisible({ timeout: 30_000 });
            await yourBookingComponents.saveContactDetailsButton.click();
            // Wait for the scroll wrapper to disappear (indicates save complete)
            await expect(yourBookingComponents.customScrollWrapper).toHaveCount(0, { timeout: 10000 });
            // Wait for network to settle before proceeding
            await page.waitForLoadState('networkidle');
            // Wait explicitly for the review button to appear in the DOM
            await page.waitForSelector("//div[@class='UI__summaryButton']//button[1]", { timeout: 20000 });
            // Scroll it into view (just in case it's below viewport)
            await yourBookingComponents.reviewButton.scrollIntoViewIfNeeded();
            // Final visibility check and click
            await expect(yourBookingComponents.reviewButton).toBeVisible({ timeout: 20000 });
            await yourBookingComponents.reviewButton.click();
            const reviewandconfirm = new ReviewAndConfirm(page);
            await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await reviewandconfirm.confirmChanges.click();
            const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
        },
    );
});
