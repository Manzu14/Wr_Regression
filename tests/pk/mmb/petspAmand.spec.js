const { HomePage } = require('../../../pages/HomePage');
const { BaggageUpgradePage } = require('../../../pages/package/BaggageUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
import { P } from 'pino';
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

            // await page.locator('//div[@class="UI__summaryButton"]//button[1]').click();
            const reviewandconfirm = new ReviewAndConfirm(page);
            // expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            // await (reviewandconfirm.confirmChanges).click();
            await reviewandconfirm.reviewAndConfirm.click();
            const paymentOptions = new PaymentOptionsPage(page);
            //await (paymentOptions.skipPayment).toBeVisible({ timeout: 60_000 });
            await (paymentOptions.skipPayment).click();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();


        },
    );
});
