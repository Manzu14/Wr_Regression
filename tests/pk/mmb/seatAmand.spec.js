import { HomePage } from '../../../pages/HomePage.js';
import { SeatUpgradePage } from '../../../pages/package/SeatUpgradePage.js';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents.js';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage.js';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm.js';
// import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm.js';
// import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage.js';
import { expect, test } from '../../fixures/test.js';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the seat amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.seatAmend);
            await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();

            const seatUpgradePage = new SeatUpgradePage(page);
            await expect(await seatUpgradePage.seatComponent()).toBe(true, 'Seat Component is not visible');

            await seatUpgradePage.upgradeSeat();

            const selectedSeat = await seatUpgradePage.selectSeatOptions();
            await expect(selectedSeat).toBe(true, 'No seat upgrade option was available to select');
            console.log(`🪑 Selected seat upgrade: ${seatUpgradePage.selectedSeat.name} - €${seatUpgradePage.selectedSeat.price}`);

            await seatUpgradePage.saveButton();
            const actualPrice = await seatUpgradePage.validateSeatPrices();
            console.log(`💰 Summary shows total: €${actualPrice}`);
            
            expect(actualPrice).toBe(seatUpgradePage.selectedSeat.price, `Summary price (€${actualPrice}) doesn't match selected price (€${seatUpgradePage.selectedSeat.price})`);

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();

            const reviewandconfirm = new ReviewAndConfirm(page);
            await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            console.log('🔄 Navigated to Review and Confirm page');

            const reviewPrice = await reviewandconfirm.validateSeatPrice();
            console.log(`💰 Review page shows: €${reviewPrice} (${seatUpgradePage.selectedSeat.name} for 2 pax)`);
            
            expect(reviewPrice).toBe(actualPrice, `Review price (€${reviewPrice}) doesn't match summary price (€${actualPrice})`);

            await reviewandconfirm.confirmChanges.click();
            /*const paymentOptions = new PaymentOptionsPage(page);
            await paymentOptions.clickSkipPaymentLink(); // 
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();*/
        },
    );
});
