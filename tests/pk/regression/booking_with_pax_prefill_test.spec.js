const { toAccommodationDetails } = require('../../../flows/navigate');
import { PaxPrefillPage } from '../../../pages/package/PaxPrefillPage';
const { test, expect } = require('../../fixures/test');

test.describe('Create booking and use myTUI modal to prefill passenger information', { tag: ['@regression', '@be', '@nl', '@inhouse', '@stable'] }, () => {
    test(
        '[B2B][PKG] Create booking and use myTUI modal to prefill passenger information',
        {
            annotation: {
                type: 'test_key',
                description: 'B2B-3051',
            },
        },
        async ({ page }) => {
            const paxPrefill = new PaxPrefillPage(page);
            const accomadationDetailsPage = await toAccommodationDetails(page);
            const bookSummaryDetailsPage = await accomadationDetailsPage.clickFurtherButton();
            const passengerDetailsPage = await bookSummaryDetailsPage.clickBookNowButton();
            await paxPrefill.myTUISearchAccountAndAddCompanions();
            const leadPassengerDataMyTui = await paxPrefill.getLeadPassengerInfoMyTUI();
            await paxPrefill.closeButton.click();
            await passengerDetailsPage.selectFirstAvailableCompanion();
            await paxPrefill.myTUIButton.click();

            expect.soft(leadPassengerDataMyTui.firstNameMainPassenger).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('firstName', 0));
            expect.soft(leadPassengerDataMyTui.lastNameMainPassenger).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('lastName', 0));
            expect.soft(leadPassengerDataMyTui.genderMainPassenger.toUpperCase()).toEqual(await passengerDetailsPage.getPassengerSelectedGender(0));
            expect.soft(leadPassengerDataMyTui.dayLeadDOB).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('dobDay', 0));
            expect.soft(leadPassengerDataMyTui.monthLeadDOB).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('dobMonth', 0));
            expect.soft(leadPassengerDataMyTui.yearLeadDOB).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('dobYear', 0));
            await passengerDetailsPage.validatePassengerNationalityAndLand();

            expect.soft(leadPassengerDataMyTui.houseNumber).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('buildingNumber', 0));
            expect.soft(leadPassengerDataMyTui.streetName).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('streetName', 0));
            expect.soft(leadPassengerDataMyTui.postalCode).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('postalCode', 0));
            expect.soft(leadPassengerDataMyTui.cityName).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('city', 0));
            expect.soft(paxPrefill.defaultEmail).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('email', 0));
            expect.soft(leadPassengerDataMyTui.phoneCountryCode).toEqual(await passengerDetailsPage.getPassengerCountryCode());
            expect.soft(leadPassengerDataMyTui.mobileNumber).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('phoneNumber', 0));

            const companionDataMyTui = await paxPrefill.getCompanionInfoMyTUI(1);
            expect.soft(companionDataMyTui.firstNameCompanion).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('firstName', 1));
            expect.soft(companionDataMyTui.lastNameCompanion).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('lastName', 1));
            expect.soft(companionDataMyTui.genderCompanion.toUpperCase()).toEqual(await passengerDetailsPage.getPassengerSelectedGender(1));
            expect.soft(companionDataMyTui.dayCompanionDOB).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('dobDay', 1));
            expect.soft(companionDataMyTui.monthCompanionDOB).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('dobMonth', 1));
            expect.soft(companionDataMyTui.yearCompanionDOB).toEqual(await passengerDetailsPage.getValuesOfPassengerBasicData('dobYear', 1));

            await paxPrefill.closeButton.click();
            await passengerDetailsPage.contactInfoName.fill(await passengerDetailsPage.getValuesOfPassengerBasicData('firstName', 0));
            await passengerDetailsPage.phoneContact.fill(await passengerDetailsPage.getValuesOfPassengerBasicData('phoneNumber', 0));
            await passengerDetailsPage.agreeToAllConditions();
            const { confirmBookingPage, paymentOptionsPage } = await passengerDetailsPage.clickOnBookWithPaymentObligrationButton();
            await paymentOptionsPage.enterPaymentDetails();
            expect(await confirmBookingPage.getBookingReferenceId()).toBeTruthy();
        },
    );
});
