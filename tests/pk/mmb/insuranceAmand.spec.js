const { HomePage } = require('../../../pages/HomePage');
const { BaggageUpgradePage } = require('../../../pages/package/BaggageUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
const { InsuranceUpgrade } = require('../../../pages/package/InsuranceUpgrade');
import { expect, test } from '../../fixures/test';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
    test(
        '[B2B][mmb]: Verify the insurance amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber('100005790167');
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            const insuranceUpgrade = new InsuranceUpgrade(page);

            expect(await insuranceUpgrade.viewInsurance()).toBe(true, 'Insurance Component is not visible');
            await insuranceUpgrade.addInsurance();
            const manageinsuranceurl = insuranceUpgrade.getCurrentUrl();
            expect(manageinsuranceurl).toContain('/managemybooking/manageinsurance');
            await insuranceUpgrade.selectAllPax();
            //expect(await insuranceupgrade.selectAllPax()).toBe(true, 'choose Insurance button is not visible');
            await insuranceUpgrade.verifyInsuranceOptions();
            expect(await insuranceUpgrade.verifyInsuranceOptions()).toBe(true, 'Insurance options are not available');
            await insuranceUpgrade.expandInsurance();
            await insuranceUpgrade.confirmInsurancePrice();
            expect(await insuranceUpgrade.totalInsurancePriceIsVisible()).toBe(true, 'Total price is not updated');
            await insuranceUpgrade.saveInsurance();
            // expect(await yourbookingcomponents.navigatetoHomepage()).toBe(true, 'Unable to navigate to mmb home page');
            // await yourbookingcomponents.summaryButton();

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
        },
    );

    test(
        '[B2B][mmb]: Verify Verify the pets amendment, navigate to the review and confirmation page, and proceed to the payment options',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber('100005790167');
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
        },
    );
});
