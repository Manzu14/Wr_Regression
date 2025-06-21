const { HomePage } = require('../../../pages/HomePage');
const { BaggageUpgradePage } = require('../../../pages/package/BaggageUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
const { LoginPage } = require('../../../pages/LoginPage'); // ✅ NEW
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { expect, test } from '../../fixures/test';

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
            await manageBookingPage.enterBookingReferenceNumber('100005952007');
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            const baggageUpgradePage = new BaggageUpgradePage(page);
            expect(await baggageUpgradePage.baggageComponent()).toBe(true, 'Baggage Component is not visible');
            await baggageUpgradePage.upgradeBaggage();
            
            await baggageUpgradePage.selectBaggageOptions();
            expect(await baggageUpgradePage.selectBaggageOptions()).toBe(true, 'Baggage options are not visible');
            await baggageUpgradePage.saveButton();
            const yourBookingComponents = new YourBookingComponents(page);                   
            await yourBookingComponents.summaryButton();
            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await (reviewandconfirm.confirmChanges).click();
            const paymentOptions = new PaymentOptionsPage(page);
            //await (paymentOptions.skipPayment).toBeVisible({ timeout: 60_000 });
            await paymentOptions.clickSkipPaymentLink(); // 
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();

            
        },
    );

    test(
        '[B2B][mmb]: Verify the Pax amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber('100005919287');
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();

            await page.locator("//*[@id='SSRpetsInfo_ItemnCardIcon']/../following-sibling::div/div/button").click();
            //await page.pause();
            await page.locator("((//*[@class='SSRPets__petOptions']/div/label/input)[1]/following-sibling::span)[1]").click();
            await page.locator("//*[@class='buttons__button buttons__secondary buttons__fill SSRPets__upgradeButtons undefined']").click();
            await page.locator("//*[@class='UI__navWrapper']/div/button").click();
            await page.locator("(//*[@id='ReviewConfirmActionBtn__component']/div/div/button)[2]").click();
            await page.waitForTimeout(10000);
            // await page.locator("(//*[@class='SSRPets__buttonContainer']/button)[2]").click();

            const reviewandconfirm = new ReviewAndConfirm(page);

            await page.waitForLoadState('networkidle');
            await expect(reviewandconfirm.reviewAndConfirm).toBeVisible({ timeout: 30_000 });

            await reviewandconfirm.reviewAndConfirm.click();
            await page.waitForURL('**/initiateUpdate', { timeout: 30000 }); // precise navigation wait



            // Proceed to payment options
            const paymentOptions = new PaymentOptionsPage(page);
            //await (paymentOptions.skipPayment).toBeVisible({ timeout: 60_000 });
            await (paymentOptions.skipPayment).click();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();


        },
    );

    test(
        '[B2B][mmb]: Verify the pets amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            // ✅ STEP 1: Perform login
            const loginPage = new LoginPage(page);
            await loginPage.doLogin();

            // ✅ STEP 2: After login, navigate to MMB page
            await page.goto(
                'https://tuiretail-be-stng.tuiad.net/retail/travel/nl/your-account/managemybooking/yourbooking',
                { waitUntil: 'networkidle' }
            );

            // ✅ STEP 3: Continue existing test logic
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);

            await manageBookingPage.enterBookingReferenceNumber('100005976402');
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
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
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await reviewandconfirm.confirmChanges.click();

            const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink();

            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
        }
    );

    
});
