const { HomePage } = require('../../../pages/HomePage');
const { BaggageUpgradePage } = require('../../../pages/package/BaggageUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
import { ManagePaymentConfirm } from '../../../pages/package/ManagePaymentConfirm';
import { PaymentOptionsPage } from '../../../pages/package/PaymentOptionsPage';
const { InsuranceUpgrade } = require('../../../pages/package/InsuranceUpgrade');
import { expect, test } from '../../fixures/test';

test.describe('@Smoke : Verify your booking components and amendments', () => {
    test(
        '[B2B]Verify baggage upgrade component',
        {
            tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty', '@smoke'],
            annotation: { type: 'test_key', description: 'B2B-3379' },
        },
        async ({ page }) => {
            const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
            const manageBookingPage = new ManageBookingPage(page);
            await manageBookingPage.enterBookingReferenceNumber('100005925888');
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
            
            await (paymentOptions.skipPayment).click();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();

            
        },
    );

    test(
        '[B2B]Verify name amendment component',
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

    test(
        '[B2B]Verify pets upgrade component',
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
        
            await page.locator("//*[@id='SSRpetsInfo_ItemnCardIcon']/../following-sibling::div/div/button").click();
           
            await page.locator("((//*[@class='SSRPets__petOptions']/div/label/input)[1]/following-sibling::span)[1]").click();
            await page.locator("//*[@class='buttons__button buttons__secondary buttons__fill SSRPets__upgradeButtons undefined']").click();
            await page.locator("//*[@class='UI__navWrapper']/div/button").click();
            await page.locator("(//*[@id='ReviewConfirmActionBtn__component']/div/div/button)[2]").click();
            await page.waitForTimeout(10000);
            

            
            const reviewandconfirm = new ReviewAndConfirm(page);
            
            await reviewandconfirm.reviewAndConfirm.click();
            const paymentOptions = new PaymentOptionsPage(page);
            
            await (paymentOptions.skipPayment).click();
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();


        },
    ); 

    test(
        '[B2B] Verify insurancce upgrade component',
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
            const insuranceUpgrade = new InsuranceUpgrade(page);

            expect(await insuranceUpgrade.viewInsurance()).toBe(true, 'Insurance Component is not visible');
            await insuranceUpgrade.addInsurance();
            const manageinsuranceurl = insuranceUpgrade.getCurrentUrl();
            expect(manageinsuranceurl).toContain('/managemybooking/manageinsurance');
            await insuranceUpgrade.selectAllPax();
            
            await insuranceUpgrade.verifyInsuranceOptions();
            expect(await insuranceUpgrade.verifyInsuranceOptions()).toBe(true, 'Insurance options are not available');
            await insuranceUpgrade.expandInsurance();
            await insuranceUpgrade.confirmInsurancePrice();
            expect(await insuranceUpgrade.totalInsurancePriceIsVisible()).toBe(true, 'Total price is not updated');
            await insuranceUpgrade.saveInsurance();
            

            const yourBookingComponents = new YourBookingComponents(page);
            await yourBookingComponents.summaryButton();
            const reviewandconfirm = new ReviewAndConfirm(page);
            expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
        },
    );
});
