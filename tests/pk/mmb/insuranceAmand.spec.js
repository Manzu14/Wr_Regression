const { HomePage } = require('../../../pages/HomePage');
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
const { InsuranceUpgrade } = require('../../../pages/package/InsuranceUpgrade');
import { expect, test } from '../../fixures/test';
import { testData } from '../../../test-data/testData.js';

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
            await manageBookingPage.enterBookingReferenceNumber(testData.insurance);
            expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
            await manageBookingPage.clickLoginReservationButton();
            const insuranceUpgrade = new InsuranceUpgrade(page);

            expect(await insuranceUpgrade.viewInsurance()).toBe(true, 'Insurance Component is not visible');
            await insuranceUpgrade.addInsurance();
            const manageinsuranceurl = insuranceUpgrade.getCurrentUrl();
            expect(manageinsuranceurl).toContain('/managemybooking/manageinsurance');
            await insuranceUpgrade.selectAllPax();
            
            await insuranceUpgrade.verifyInsuranceOptions();
            expect(await insuranceUpgrade.verifyInsuranceOptions()).toBe(true, 'Insurance options are not available');
            
            const selectedOptionPrice = await insuranceUpgrade.getInsuranceOptionPrice(0);
            expect(await insuranceUpgrade.validatePriceFormat(selectedOptionPrice)).toBe(true, 'Selected option price format is invalid');
            
            await insuranceUpgrade.expandInsurance();
            await insuranceUpgrade.selectPassengers();
            await insuranceUpgrade.confirmInsurancePrice();
            
            expect(await insuranceUpgrade.totalInsurancePriceIsVisible()).toBe(true, 'Total price is not updated');
            const totalPrice = await insuranceUpgrade.getTotalInsurancePrice();
            expect(totalPrice).toMatch(/€\d+\.\d{2}/, 'Total price format is invalid');
            
            const perPaxPrice = await insuranceUpgrade.getPerPassengerPrice(0);
            expect(await insuranceUpgrade.validatePriceFormat(perPaxPrice)).toBe(true, 'Per passenger price format is invalid');
            
            const actualPrice = await insuranceUpgrade.validatePriceAgainstSummary(72);
            console.log(`💰 Summary shows total: €${actualPrice}`);
            expect(actualPrice).toBe(72, `Insurance price should be €72, but found €${actualPrice}`);
            
            await insuranceUpgrade.saveInsurance();
            console.log('💾 Insurance selection saved');

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            
            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
            console.log('🔄 Navigated to Review and Confirm page');

            const reviewPrice = await reviewandconfirm.validateInsurancePrice();
            console.log(`💰 Review page shows insurance cost: €${reviewPrice}`);
            
            expect(reviewPrice).toBe(72, `Insurance price should be €72, but found €${reviewPrice}`);
            console.log('✅ Insurance price validation passed');
        },
    );
});