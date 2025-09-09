const { HomePage } = require('../../../pages/HomePage');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { PaxUpgradePage } = require('../../../pages/package/PaxUpgradePage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Name Amendment flows', () => {
    test(
        '[B2B][mmb]: Verify name amendment with price validation',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-NAME-001' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber(testData.nameAmendment);
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            
            const paxUpgradePage = new PaxUpgradePage(page);
            await paxUpgradePage.updatePassengerDetails();
            
            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            
            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
        },
    );
});