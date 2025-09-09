import { HomePage } from '../../../pages/HomePage.js';
import { YourBookingComponents } from '../../../pages/package/components/mmb/Yourbookingcomponents';
import { BaggageUpgradePage } from '../../../pages/package/BaggageUpgradePage.js';
import { FlightUpgradePage } from '../../../pages/package/FlightUpgradePage.js';
import { SeatUpgradePage } from '../../../pages/package/SeatUpgradePage.js';
import { PetsUpgradePage } from '../../../pages/package/PetsUpgradePage.js';
import { PaxUpgradePage } from '../../../pages/package/PaxUpgradePage.js';
import { SpecialAsstUpgradePage } from '../../../pages/package/SpecialAsstUpgradePage.js';
import { SpecialBaggageUpgradePage } from '../../../pages/package/SpecialBaggageUpgradePage.js';
import { HotelUpgradePage } from '../../../pages/package/HotelUpgradePage.js';
import { ManageBookingPage } from '../../../pages/package/ManageBookingPage.js';
import { InsuranceUpgrade } from '../../../pages/package/InsuranceUpgrade.js';
import { ReviewAndConfirm } from '../../../pages/package/ReviewAndConfirm.js';
import  { CanxReservationPage } from '../../../pages/package/CanxReservationPage.js';
import  { CancelBookingConfirmationPage } from'../../../pages/package/CancelBookingConfirmationPage.js';
import { expect, test } from '../../fixures/test.js';
import { testData } from '../../../test-data/testData.js';

test.describe('[B2B]-[mmb]: Validation MMB flows', () => {
  test(
    '[B2B][mmb]: Verify the baggage amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379-baggage' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.baggage);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      const baggageUpgradePage = new BaggageUpgradePage(page);
      await expect(await baggageUpgradePage.baggageComponent()).toBe(true, 'Baggage Component is not visible');
      await baggageUpgradePage.upgradeBaggage();
      await expect(await baggageUpgradePage.selectBaggageOptions()).toBe(true, 'Baggage options are not visible');
      await baggageUpgradePage.saveButton();
      await baggageUpgradePage.validatePriceAgainstSummary();



      const yourBookingComponents = new YourBookingComponents(page);
      await yourBookingComponents.summaryButton();

      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      console.log('🔄 Navigated to Review and Confirm page');

      // ✅ Dynamically calculate total baggage price from both legs
      const totalPrice = baggageUpgradePage.selectedPrices.reduce((a, b) => a + b, 0);
      await reviewandconfirm.validateBaggagePrice(totalPrice);
      await reviewandconfirm.confirmChanges.click();


      /* const paymentOptions = new PaymentOptionsPage(page);
       await paymentOptions.clickSkipPaymentLink();
 
       const managePaymentConfirm = new ManagePaymentConfirm(page);
       await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
       await expect(managePaymentConfirm.thankYouMessage).toBeVisible();*/
    }
  );
  test(
    '[B2B][mmb]: Verify the Hotel Upgrade, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@inhouse'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.hotel);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      // Step 2–8: Hotel change flow
      const hotelUpgradePage = new HotelUpgradePage(page);
      await hotelUpgradePage.changeHotel();

      // Final Step: Assertion
      await expect(page).toHaveURL(/reviewChanges/);
    }
  );
  test(
    '[B2B][mmb]: Verify the specialbaggage amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379-specialbaggage' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.specialBaggage);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      const specialBaggageUpgradePage = new SpecialBaggageUpgradePage(page);
      await expect(await specialBaggageUpgradePage.specialBaggageComponent()).toBe(true, 'Special Baggage Component is not visible');

      await specialBaggageUpgradePage.upgradeSpecialBaggage();

      const selected = await specialBaggageUpgradePage.selectSpecialBaggageOptions();
      await expect(selected).toBe(true, 'No unselected special baggage option was available to check');

      await specialBaggageUpgradePage.saveButton();
      // await specialBaggageUpgradePage.validatePriceAgainstSummary();


      const yourBookingComponents = new YourBookingComponents(page);
      await yourBookingComponents.summaryButton();

      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      await reviewandconfirm.confirmChanges.click();

      // Uncomment below if you want to validate payment confirmation
      /*
      const paymentOptions = new PaymentOptionsPage(page);
      await paymentOptions.clickSkipPaymentLink();

      const managePaymentConfirm = new ManagePaymentConfirm(page);
      await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
      await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
      */
    }
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
      expect(bookingSearchPage.MmbBookingReference).toBeTruthy();

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
      expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');

      await reviewandconfirm.confirmChanges.click();

      // const paymentOptions = new PaymentOptionsPage(page);
      // await paymentOptions.clickSkipPaymentLink();

      // const managePaymentConfirm = new ManagePaymentConfirm(page);
      // await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
      // await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
    },
  );

  test(
    '[B2B][mmb]: Verify the Seat amendment, navigate to the review and confirmation page, and proceed to the payment options',
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
    '[B2B][mmb]: Verify the Pax amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      // STEP 1: Navigate to Booking Search
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);

      // STEP 2: Search Booking and handle login navigation
      await manageBookingPage.enterBookingReferenceNumber(testData.nameAmendment);
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle' }),
        manageBookingPage.clickLoginReservationButton()
      ]);

      // STEP 3: Verify Booking Reference
      await expect(bookingSearchPage.MmbBookingReference).toBeVisible({ timeout: 30000 });

      // STEP 4: Pax Amendment
      const paxUpgradePage = new PaxUpgradePage(page);
      await expect(paxUpgradePage.passengerListWrapper).toBeVisible();
      await paxUpgradePage.updatePassengerDetailsLink.click();
      await page.waitForTimeout(5000);
      await paxUpgradePage.updatePassengerDetails();
      await paxUpgradePage.saveAndProceed();

      // STEP 5: Click Summary Button
      const yourBooking = new YourBookingComponents(page);
      await yourBooking.summaryButton();

      // STEP 6: Confirm Changes
      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(
        true,
        'Review & confirm button is not visible'
      );
      await reviewandconfirm.confirmChanges.click();

      // // STEP 7: Skip Payment
      // const paymentOptions = new PaymentOptionsPage(page);
      // await paymentOptions.clickSkipPaymentLink();

      // // STEP 8: Confirmation Message
      // const managePaymentConfirm = new ManagePaymentConfirm(page);
      // await expect(managePaymentConfirm.successMessage).toBeVisible({ timeout: 60000 });
      // await expect(managePaymentConfirm.thankYouMessage).toBeVisible();
    }
  );
  test(
    '[B2B][mmb]: Verify the Special Assistance Amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      // Step 1: Navigate to booking and login
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.specialAsst);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      // Step 2: Special Assistance Amendment
      const specialAsstUpgradePage = new SpecialAsstUpgradePage(page);
      await expect(await specialAsstUpgradePage.specialAsstComponent()).toBe(true, 'Special Assistance component is not visible');
      await specialAsstUpgradePage.upgradeSpecialAsst();


      // Step 3: Click Review Button from Sticky Panel
      const yourBookingComponents = new YourBookingComponents(page);
      await yourBookingComponents.summaryButton();
      const reviewandconfirm = new ReviewAndConfirm(page);
      await expect(await reviewandconfirm.reviewandconfirmButton()).toBe(true, 'Review & confirm button is not visible');
      await reviewandconfirm.confirmChanges.click();
      // Optional: Proceed to payment/confirmation if needed
    }
  );
  test(
    '[B2B][mmb]: Verify the insurance amendment, navigate to the review and confirmation page, and proceed to the payment options',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();
      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber('100006091920');
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
    '[B2B][MMB]: Verify the Cancel Booking flow and URL confirmation',
    {
      tag: ['@regression', '@be', '@nl', '@inhouse', '@3rdparty'],
      annotation: { type: 'test_key', description: 'B2B-3379' },
    },
    async ({ page }) => {
      const bookingSearchPage = await new HomePage(page).navigateToBookingSearchPage();

      const manageBookingPage = new ManageBookingPage(page);
      await manageBookingPage.enterBookingReferenceNumber(testData.cancelBooking);
      await expect(bookingSearchPage.MmbBookingReference).toBeTruthy();
      await manageBookingPage.clickLoginReservationButton();

      const canxReservationPage = new CanxReservationPage(page);
      await canxReservationPage.cancelReservation();

      const cancelBookingConfirmationPage = new CancelBookingConfirmationPage(page);
      await cancelBookingConfirmationPage.waitForCancelBookingConfirmationPage();

      // Optional: Go back to booking
      // await cancelBookingConfirmationPage.clickBackToBookingButton();
    }
  );

});
