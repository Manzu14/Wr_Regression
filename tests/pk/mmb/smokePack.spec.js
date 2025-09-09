const { HomePage } = require('../../../pages/HomePage');
const { BaggageUpgradePage } = require('../../../pages/package/BaggageUpgradePage');
const { YourBookingComponents } = require('../../../pages/package/components/mmb/Yourbookingcomponents');
const { ManageBookingPage } = require('../../../pages/package/ManageBookingPage');
const { ReviewAndConfirm } = require('../../../pages/package/ReviewAndConfirm');
const { LoginPage } = require('../../../pages/LoginPage'); // ✅ NEW
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
            await manageBookingPage.enterBookingReferenceNumber('100005952007');
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
            //await (paymentOptions.skipPayment).toBeVisible({ timeout: 60_000 });
            await paymentOptions.clickSkipPaymentLink(); // 
            const managePaymentConfirm = new ManagePaymentConfirm(page);
            await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            await expect(managePaymentConfirm.thankYouMessage).toBeVisible();

            
        },
    );

    test(
        '[B2B][mmb]: Verify the Pax amendment, navigate to the review and confirmation page, and proceed to the payment options',
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

            const reviewandconfirm = new ReviewAndConfirm(page);

            await page.waitForLoadState('networkidle');
            await expect(reviewandconfirm.reviewAndConfirm).toBeVisible({ timeout: 30_000 });

            await reviewandconfirm.reviewAndConfirm.click();
            await page.waitForURL('**/initiateUpdate', { timeout: 30000 }); // precise navigation wait



            // // Proceed to payment options
            // const paymentOptions = new PaymentOptionsPage(page);
            // //await (paymentOptions.skipPayment).toBeVisible({ timeout: 60_000 });
            // await (paymentOptions.skipPayment).click();
            // const managePaymentConfirm = new ManagePaymentConfirm(page);
            // await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
            // await expect(managePaymentConfirm.thankYouMessage).toBeVisible();


        },
    );

    test(
            '[B2B][mmb]: Verify the pets amendment, navigate to the review and confirmation page, and proceed to the payment options',
            {
                tag: ['@be', '@nl', '@inhouse'],
                annotation: { type: 'test_key', description: 'B2B-3379' },
            },
            async ({ page }) => {
                const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
                const manageBookingPage = new ManageBookingPage(page);
                await manageBookingPage.enterBookingReferenceNumber(testData.petsAmendment);
                await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
                await manageBookingPage.clickLoginReservationButton();
    
                const petsUpgradePage = new PetsUpgradePage(page);
                expect(await petsUpgradePage.petsComponent()).toBe(true, 'Pets Component is not visible');
    
                await petsUpgradePage.upgradePets();
    
                const selected = await petsUpgradePage.selectPetsOptions();
                expect(selected).toBe(true, 'No unselected pets option was available to check');
                await petsUpgradePage.saveButton();
    
                const yourBookingComponents = new YourBookingComponents(page);
                await yourBookingComponents.summaryButton();
                const reviewandconfirm = new ReviewAndConfirm(page);
                await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
                await reviewandconfirm.validatePetsPrice(180);
                
                
                await reviewandconfirm.confirmChanges.click();
    
    
               /* const paymentOptions = new PaymentOptionsPage(page);
                await paymentOptions.clickSkipPaymentLink(); // 
                const managePaymentConfirm = new ManagePaymentConfirm(page);
                await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60_000 });
                await expect(managePaymentConfirm.thankYouMessage).toBeVisible();*/
            },
        );

    test(
            '[B2B][mmb]: Verify the Seat amendment, navigate to the review and confirmation page, and proceed to the payment options',
            {
                tag: ['@regression', '@be','@inhouse'],
                annotation: { type: 'test_key', description: 'B2B-3379' },
            },
            async ({ page }) => {
                const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
                const manageBookingPage = new ManageBookingPage(page);
                await manageBookingPage.enterBookingReferenceNumber(testData.seatAmend);
                await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
                await manageBookingPage.clickLoginReservationButton();
    
                const seatUpgradePage = new SeatUpgradePage(page);
                expect(await seatUpgradePage.seatComponent()).toBe(true, 'Seat Component is not visible');
    
                await seatUpgradePage.upgradeSeat();
    
                const selected = await seatUpgradePage.selectSeatOptions();
                expect(selected).toBe(true, 'No unselected seat option was available to check');
                await seatUpgradePage.saveButton();
    
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
