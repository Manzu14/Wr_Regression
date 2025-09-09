import { HomePage } from '../../../pages/HomePage.js';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage.js';
import { NonLeadPaxUpgradePage } from '../../../pages/package/NonLeadPaxUpgradePage.js';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm.js';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents.js';
import { expect, test } from '../../fixures/test.js';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Non-Lead Passenger Amendment flows', () => {
    test(
        '[B2B][mmb]: Verify non-lead passenger name amendment with price validation',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-NONLEAD-001' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.nameAmendment);
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            
            const nonLeadPaxUpgradePage = new NonLeadPaxUpgradePage(page);
            await nonLeadPaxUpgradePage.updateNonLeadPassengerDetails();
            console.log('✏️ Updated non-lead passenger first name');
            
            await nonLeadPaxUpgradePage.saveAndProceed();
            
            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();

            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            console.log('🔄 Navigated to Review and Confirm page');

            const reviewPrice = await reviewandconfirm.validateNonLeadNameAmendmentPrice();
            console.log(`💰 Review page shows non-lead pax name amendment cost: €${reviewPrice}`);
            
            expect(reviewPrice).toBe(62, `Non-lead pax name amendment price should be €62, but found €${reviewPrice}`);
            console.log('✅ Non-lead passenger name amendment price validation passed');
        },
    );
});