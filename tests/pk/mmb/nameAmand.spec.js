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
            await manageBookingPage.enterBookingReferenceNumber('100005925888');
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();           
            
                       
            const yourBookingComponents = new YourBookingComponents(page);    
                           
           await expect(yourBookingComponents.passengerListWrapper).toBeVisible();
            await (yourBookingComponents.updatePassengerDetailsLink).click();
            await page.waitForTimeout(5000);
           // await expect(yourBookingComponents.editContactdetailsWrapper).toBeVisible();
           // await (yourBookingComponents.adultFirstname).click();
          // await page.locator(`//*[@id='FIRSTNAMEADULT1']`).click();
          //  await (yourBookingComponents.adultFirstname).fill('Jyo');
            await yourBookingComponents.passengerFill();
            await page.waitForTimeout(2000);
            await expect(yourBookingComponents.reviewButton).toBeVisible();
            await (yourBookingComponents.reviewButton).click();


            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await (reviewandconfirm.confirmChanges).click();
            const paymentOptions = new PaymentOptionsPage(page);
            await page.waitForTimeout(35000);
            await (paymentOptions.skipPayment).click();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();

            
        },
    );
});
