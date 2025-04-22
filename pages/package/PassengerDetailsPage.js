import { HolidaySummaryModal } from './components/shared/HolidaySummaryModal';
import { PassengersDataProvider } from '../../test-data/PassengersDataProvider';
const { getCountryType, isBE } = require('../../config/test_config');
import { I18nMessages } from '../helpers/I18nMessages';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { ConfirmBookingPage } from './ConfirmBookingPage';
import { PaymentOptionsPage } from './PaymentOptionsPage';
import { FeesComponent } from '../flightonly/components/PassengerDetailsPage/FeesComponent';
import { FlightOnlyPaymentPage } from '../flightonly/PaymentPage';
import { SalesQuote } from '../flightonly/components/PassengerDetailsPage/SalesQuote';
const { expect } = require('@playwright/test');

export class PassengerDetailsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.minAdultAge = 30;
        this.page = page;
        this.passengerForm = page.locator('div.PassengerFormV2__passengerContainer');
        this.iAgreeCheckBox = page.locator('div.UI__select_show_box').locator('label.inputs__checkBox');
        this.bookPaymentObligationButton = page.locator('//button[@class="buttons__button buttons__primary buttons__fill buttons__large"]');
        this.eMailMarketingPreference = page.locator('label').filter({ hasText: /^E-mail$/ });
        this.nationalityLeadPassenger = page.locator('#NATIONALITYADULT1');
        this.landLeadPassenger = page.locator('#COUNTRYADULT1');
        this.countryCodePhone = page.locator('#PHONECODEADULT1');
        this.dropDownCompanions = page.locator('.SelectDropdown__large.SelectDropdown__button');
        this.availableCompanions = page.locator('.SelectDropdown__option');
        this.contactInfoName = page.locator('input[name="stayHomelastName"]');
        this.phoneContact = page.locator('input[name="stayHomemobileNum"]');
    }

    /**
     * Gets the holiday summary modal.
     * @returns {HolidaySummaryModal} The holiday summary modal instance.
     */
    get holidaySummaryModal() {
        return new HolidaySummaryModal(this.page.locator('div.HolidaySummaryWithPhoto__withBorder'), this.page);
    }

    get foAgentFees() {
        return new FeesComponent(this.page);
    }

    /**
     * Gets the Sales quote of agent .
     * @returns {SalesQuote} pdf.
     */
    get foSalesQuote() {
        return new SalesQuote(this.page);
    }

    /**
     * Fills details for all passengers.
     * @returns {Promise<void>}
     */
    async fillAllPassangersDetails() {
        await this.passengerForm.first().waitFor({ state: 'visible' });
        const passangersCount = await this.passengerForm.count();
        const translation = await new I18nMessages().extractI18nMessages(this.page);
        for (let i = 0; i < passangersCount; i++) {
            const { age } = await this.getPassengersAge(i, translation.age);
            await this.fillPassengerDetails(i, age);
        }
    }

    async getPassengersAge(index, ageTranslation) {
        const passengerTitle = await this.page
            .locator('#passengerFormFields__component')
            .first()
            .locator('div.CardHeaderBar__cardHeaderBar')
            .nth(index)
            .textContent();
        const regex = new RegExp(`\\(${ageTranslation} (\\d+)\\)`, 'g');
        const match = regex.exec(passengerTitle);
        const age = match ? Number.parseInt(match[1]) : faker.number.int({ min: this.minAdultAge, max: 90 });
        return { passengerTitle, age };
    }

    /**
     * Fills details for a specific passenger.
     * @param {number} [passengerIndex=0] - The index of the passenger to fill details for.
     * @param {number|null} [age=null] - The age of the passenger.
     * @returns {Promise<void>}
     */
    async fillPassengerDetails(passengerIndex = 0, age = null) {
        let birthDate;
        if (age !== null && age <= this.minAdultAge) {
            const { returnDate } = await this.holidaySummaryModal.holidayInfoContainer.getTravelDates();
            birthDate = this.getBirthdate(age, returnDate);
            if (birthDate.isAfter(dayjs())) {
                await this.passengerForm.nth(passengerIndex).locator('[aria-label="Nog niet geboren baby"]').locator('span.inputs__box').check();
                return;
            }
        } else {
            birthDate = this.getBirthdate(age);
        }
        const passangerData = new PassengersDataProvider().getPassanger(birthDate);
        await this.#fillPassengerData(passengerIndex, passangerData);
        await this.page.locator('input[name="stayHomelastName"]').fill(passangerData.surname);
        await this.page.locator('input[name="stayHomemobileNum"]').fill(passangerData.phoneNumber.number);
    }

    async getPassengerBasicData(passengerIndex) {
        return {
            firstName: this.page.locator(`input[name="paxInfoFormBean[${passengerIndex}].firstName"]`),
            lastName: this.page.locator(`input[name="paxInfoFormBean[${passengerIndex}].lastName"]`),
            gender: this.page.locator(`select[name="paxInfoFormBean[${passengerIndex}].gender"]`),
            dobDay: this.passengerForm.nth(passengerIndex).locator('input[aria-label="day"]'),
            dobMonth: this.passengerForm.nth(passengerIndex).locator('input[aria-label="month"]'),
            dobYear: this.passengerForm.nth(passengerIndex).locator('input[aria-label="year"]'),
            streetName: this.page.locator(`input#ADDRESS1ADULT${passengerIndex + 1}`),
            buildingNumber: this.page.locator(`input#HOUSENUMBERADULT${passengerIndex + 1}`),
            postalCode: this.page.locator(`input#POSTALCODEADULT${passengerIndex + 1}`),
            city: this.page.locator(`input#TOWNADULT${passengerIndex + 1}`),
            phoneNumber: this.page.locator(`input#MOBILENUMBERADULT${passengerIndex + 1}`),
            email: this.page.locator(`input#EMAILADDRESSADULT${passengerIndex + 1}`),
        };
    }

    async getPassengerSelectedGender(index) {
        const leadPassengerDataPage = await this.getPassengerBasicData(index);
        return leadPassengerDataPage.gender.evaluate(sel => sel.options[sel.options.selectedIndex].textContent);
    }

    async getValuesOfPassengerBasicData(fieldName, index) {
        const leadPassengerDataPage = await this.getPassengerBasicData(index);
        return await leadPassengerDataPage[`${fieldName}`].getAttribute('value');
    }

    async getPassengerNatonality() {
        return await this.nationalityLeadPassenger.evaluate(sel => sel.options[sel.options.selectedIndex].textContent);
    }

    async getPassengerLand() {
        return await this.landLeadPassenger.evaluate(sel => sel.options[sel.options.selectedIndex].textContent);
    }

    async getPassengerCountryCode() {
        return await this.countryCodePhone.evaluate(sel => sel.options[sel.options.selectedIndex].textContent);
    }

    async selectFirstAvailableCompanion() {
        await this.dropDownCompanions.first().click();
        expect(await this.availableCompanions.count()).toBeGreaterThan(0);
        await this.availableCompanions.first().click();
    }

    async validatePassengerNationalityAndLand() {
        if (isBE()) {
            expect(await this.getPassengerNatonality()).toEqual('Belg');
            expect(await this.getPassengerLand()).toEqual('België');
        } else {
            expect(await this.getPassengerNatonality()).toEqual('Nederlands');
            expect(await this.getPassengerLand()).toEqual('Nederland');
        }
    }

    /**
     * Fills data for a specific passenger (private method).
     * @returns {Promise<void>}
     * @private
     */
    async #fillPassengerData(passengerIndex, passangerData) {
        const passengerDetails = await this.getPassengerBasicData(passengerIndex);
        await passengerDetails.firstName.fill(passangerData.name);
        await passengerDetails.lastName.fill(passangerData.surname);
        await passengerDetails.gender.selectOption(passangerData.sex);
        await passengerDetails.dobDay.fill(passangerData.birthdate.day);
        await passengerDetails.dobMonth.fill(passangerData.birthdate.month);
        await passengerDetails.dobYear.fill(passangerData.birthdate.year);
        if (passengerIndex === 0) {
            await this.fillIfRequired(passengerDetails.streetName, passangerData.address.streetName);
            await this.fillIfRequired(passengerDetails.buildingNumber, passangerData.address.buildingNumber);
            await this.fillIfRequired(passengerDetails.postalCode, passangerData.address.postalCode);
            await this.fillIfRequired(passengerDetails.city, passangerData.address.city);
            await this.fillIfRequired(passengerDetails.phoneNumber, passangerData.phoneNumber.number);
            await this.fillIfRequired(passengerDetails.email, passangerData.email);
        }
        return passangerData;
    }

    async fillIfRequired(selector, value) {
        if (await selector.isVisible()) {
            await selector.fill(value);
        }
    }

    /**
     *
     * @param age
     * @param {dayjs.Dayjs|null} returnDate - The return date (optional).
     * @return {dayjs.Dayjs}
     */
    getBirthdate(age, returnDate = null) {
        if (returnDate) return returnDate.subtract(age, 'year').subtract(1, 'week');
        else {
            const date = age
                ? faker.date.birthdate({
                      min: age,
                      max: age,
                      mode: 'age',
                  })
                : faker.date.birthdate();
            return dayjs(date);
        }
    }

    async agreeToAllConditions() {
        await this.iAgreeCheckBox.first().waitFor({ state: 'visible' });
        for await (const agreeBtn of await this.iAgreeCheckBox.all()) {
            await agreeBtn.click();
        }
    }

    async foClickAgreeContinue() {
        if (getCountryType() === 'ma') {
            await this.iAgreeCheckBox.first().click();
        } else {
            await this.agreeToAllConditions();
        }
        await this.bookPaymentObligationButton.click({ noWaitAfter: true });
        return new FlightOnlyPaymentPage(this.page);
    }

    async clickOnBookWithPaymentObligrationButton() {
        await expect(this.bookPaymentObligationButton).toBeVisible({ timeout: 40_000 });
        await this.bookPaymentObligationButton.click({ noWaitAfter: true });
        const confirmBookingPage = new ConfirmBookingPage(this.page);
        const paymentOptionsPage = new PaymentOptionsPage(this.page);
        return { confirmBookingPage, paymentOptionsPage };
    }

    async fillAllPassengersDetailsWithoutDOB() {
        await this.passengerForm.first().waitFor({ state: 'visible' });
        const passengersCount = await this.passengerForm.count();

        for (let i = 0; i < passengersCount; i++) {
            await this.fillPassengerDetailsWithoutDOB(i);
        }
    }

    async fillPassengerDetailsWithoutDOB(passengerIndex = 0) {
        const passengerData = new PassengersDataProvider().getPassanger(dayjs().subtract(30, 'years'));
        await this.#fillPassengerDataWithoutDOB(passengerIndex, passengerData);
        await this.page.locator('input[name="stayHomelastName"]').fill(passengerData.surname);
        await this.page.locator('input[name="stayHomemobileNum"]').fill(passengerData.phoneNumber.number);
    }

    async #fillPassengerDataWithoutDOB(passengerIndex, passengerData) {
        const passengerDetails = await this.getPassengerBasicData(passengerIndex);
        await passengerDetails.firstName.fill(passengerData.name);
        await passengerDetails.lastName.fill(passengerData.surname);
        await passengerDetails.gender.selectOption(passengerData.sex);

        if (passengerIndex === 0) {
            await this.fillIfRequired(passengerDetails.streetName, passengerData.address.streetName);
            await this.fillIfRequired(passengerDetails.buildingNumber, passengerData.address.buildingNumber);
            await this.fillIfRequired(passengerDetails.postalCode, passengerData.address.postalCode);
            await this.fillIfRequired(passengerDetails.city, passengerData.address.city);
            await this.fillIfRequired(passengerDetails.phoneNumber, passengerData.phoneNumber.number);
            await this.fillIfRequired(passengerDetails.email, passengerData.email);
        }
    }
}
