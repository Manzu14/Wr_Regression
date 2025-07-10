const { HomePage } = require('../../../pages/HomePage');
const { FlightUpgradePage } = require('../../../pages/package/FlightUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
// import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
// import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the Flight amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.flightAmendment);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();

            const flightUpgradePage = new FlightUpgradePage(page);
            expect(await flightUpgradePage.flightComponent()).toBe(true, 'Flight Component is not visible');

            await flightUpgradePage.upgradeFlight();

            const selected = await flightUpgradePage.selectFlightOptions();
            expect(selected).toBe(true, 'No unselected flight option was available to check');
            await flightUpgradePage.saveButton();

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            const reviewandconfirm = new ReviewAndConfirm(page);
            await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            await reviewandconfirm.confirmChanges.click();
            /*const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink(); // 
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();*/
        },
    );
});
