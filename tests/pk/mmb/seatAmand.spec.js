const { HomePage } = require('../../../pages/HomePage');
const { BaggageUpgradePage } = require('../../../pages/package/BaggageUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
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
            await manageBookingPage.enterBookingReferenceNumber('100005856729');
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
          //  const baggageUpgradePage = new BaggageUpgradePage(page);
           // expect(await baggageUpgradePage.baggageComponent()).toBe(true, 'Baggage Component is not visible');
           // await baggageUpgradePage.upgradeBaggage();
            
          //  await baggageUpgradePage.selectBaggageOptions();
          //  expect(await baggageUpgradePage.selectBaggageOptions()).toBe(true, 'Baggage options are not visible');
          //  await baggageUpgradePage.saveButton();
          
          await page.locator("(//*[@class='Commons__ItemCardFooter Commons__flexItem'])[2]/div/button").click();
          await page.locator("//*[@class='components__content']/div/ul/li[2]/*[@class='Commons__buttonWrapper null']").click();
          await page.locator("//*[@class='Commons__buttonContainer']/button[2]").click();
          



            const yourBookingComponents = new YourBookingComponents(page);                   
            await yourBookingComponents.summaryButton();
            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await (reviewandconfirm.confirmChanges).click();
            const paymentOptions = new PaymentOptionsPage(page);
            //await (paymentOptions.skipPayment).toBeVisible({ timeout: 60_000 });
            await (paymentOptions.skipPayment).click();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();

            
        },
    );
});
